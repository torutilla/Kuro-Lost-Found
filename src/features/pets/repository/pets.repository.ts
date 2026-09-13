import { pool } from "@config/db.js";
import type { Pet, GetPetsOptions, PetInsert, PetArrayResponse } from "../index.js";
import type { QueryResult } from "pg";

export default class PetRepository {

    static async getPets({
        limit = 10,
        lastDateLost,
        lastId,
        status = "all" }: GetPetsOptions
    ): Promise<PetArrayResponse> {
        let params: any[] = [limit + 1];
        let conditions: string[] = [];

        if (status != "all") {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }

        if (lastDateLost && lastId) {
            params.push(lastDateLost, lastId);
            conditions.push(`(date_lost, id) < ($${params.length - 1}, $${params.length})`);
        }

        let baseQuery = `
        SELECT * FROM pets 
        ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
        ORDER BY date_lost DESC, id DESC 
        LIMIT $1
        `;

        const res: QueryResult<Pet> = await pool.query(baseQuery, params);

        let pets = res.rows;
        let hasMore = pets.length > limit;

        if (hasMore) {
            pets = pets.slice(0, limit);
        }

        const lastRow = pets[pets.length - 1];

        return {
            pets,
            nextCursor: hasMore && lastRow
                ? {
                    lastDateLost: lastRow.date_lost,
                    lastId: lastRow.id,
                }
                : null,
        };

    }

    static async addPet(pet: PetInsert): Promise<Pet | null> {
        const result: QueryResult<Pet> = await pool.query(`
            INSERT INTO pets (name, type, breed, color, description, image_url, 
            last_seen_location, date_lost, user_id, location_point)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_SetSRID(ST_MakePoint($11, $10), 4326))
            RETURNING *
            `,
            [
                pet.name,
                pet.type,
                pet.breed ?? null,
                pet.color,
                pet.description,
                pet.image_url,
                pet.last_seen_location,
                pet.date_lost,
                pet.user_id,
                pet.location_point?.lat,
                pet.location_point?.lng,
            ]);
        return result.rows[0] ?? null;
    }

    static async markPetStatus(id: string, status: "lost" | "found") {
        await pool.query(`
            UPDATE pets
            SET status = $2
            WHERE id = $1`,
            [id, status])
    }

    static async findPetById(id: string): Promise<Pet | null> {
        const res = await pool.query(`
            SELECT * 
            FROM pets
            WHERE id = $1`, [id]);
        return res.rows[0] ?? null;
    }

    static async getPetsOfUser(user_id: string): Promise<Pet[] | null> {
        const res = await pool.query(`
            SELECT *
            FROM pets
            WHERE user_id = $1`, [user_id]);
        return res.rows;
    }

    static async deletePet(id: string) {
        await pool.query(`
            DELETE 
            FROM pets
            WHERE id = $1`, [id]);
    }
}