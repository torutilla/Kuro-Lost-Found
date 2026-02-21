import { pool } from "@/db.js";
import { Pet, PetResponse, GetPetsOptions } from "../types/pets.type.js";
import { QueryResult } from "pg";

export default class PetModel {

    static async getPets({
        limit = 10,
        lastDateLost,
        status = "all" }: GetPetsOptions
    ): Promise<PetResponse> {
        let params: any[] = [limit];
        let conditions: string[] = [];

        if (status != "all") {
            params.push(status);
            conditions.push(`status = $2${params.length}`);
        }
        if (lastDateLost) {
            params.push(lastDateLost);
            conditions.push(`date_lost < $${params.length}`);
        }

        let baseQuery =
            `SELECT *
            FROM pets
        `;
        if (conditions.length > 0) {
            baseQuery += " WHERE " + conditions.join(" AND ");
        }
        baseQuery += `ORDER BY date_lost DESC LIMIT $1`;

        const res: QueryResult<Pet> = await pool.query(baseQuery, params);

        const lastDate = res.rows[res.rows.length - 1]?.date_lost;

        return { pets: res.rows, lastDateLost: lastDate };

    }

    static async addLostPet(pet: Pet): Promise<string | null> {
        const result: QueryResult<Pet> = await pool.query(`
            INSERT INTO pets (name, type, breed, color, description, image_url, 
            last_seen_location, date_lost)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
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
            ]);
        return result.rows[0]?.id ?? null;
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

    static async deletePet(id: string) {
        await pool.query(`
            DELETE 
            FROM pets
            WHERE id = $1`, [id]);
    }
}