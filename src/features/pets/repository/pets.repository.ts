import { pool } from "@config/db.js";
import type { GetPetsOptions, Pet, PetInsert, PetStatus } from "../index.js";
import type { QueryResult } from "pg";

export default class PetRepository {
    static async getPets({ limit = 10, lastObservedAt, lastId, status }: GetPetsOptions) {
        const params: unknown[] = [];
        const conditions = ["status IN ('lost', 'found')"];
        if (status) {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }
        if (lastObservedAt && lastId) {
            params.push(lastObservedAt, lastId);
            conditions.push(`(observed_at, id) < ($${params.length - 1}, $${params.length})`);
        }
        params.push(limit + 1);
        const res: QueryResult<Pet> = await pool.query(`
            SELECT * FROM pets WHERE ${conditions.join(" AND ")}
            ORDER BY observed_at DESC, id DESC LIMIT $${params.length}
        `, params);
        const hasMore = res.rows.length > limit;
        const pets = hasMore ? res.rows.slice(0, limit) : res.rows;
        const lastRow = pets[pets.length - 1];
        return { pets, nextCursor: hasMore && lastRow
            ? { lastObservedAt: lastRow.observed_at, lastId: lastRow.id } : null };
    }

    static async addPet(pet: PetInsert): Promise<Pet | null> {
        const result: QueryResult<Pet> = await pool.query(`
            INSERT INTO pets (name, type, breed, color, description, image_url, status,
                location_description, observed_at, user_id, location_point)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                ST_SetSRID(ST_MakePoint($12, $11), 4326)::geography) RETURNING *
        `, [pet.name, pet.type, pet.breed ?? null, pet.color, pet.description, pet.image_url,
            pet.status, pet.location_description, pet.observed_at, pet.user_id,
            pet.location_point.lat, pet.location_point.lng]);
        return result.rows[0] ?? null;
    }

    static async updateStatus(id: string, userId: string, status: PetStatus): Promise<Pet | null> {
        const res: QueryResult<Pet> = await pool.query(
            "UPDATE pets SET status = $3 WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId, status],
        );
        return res.rows[0] ?? null;
    }

    static async findPetById(id: string): Promise<Pet | null> {
        const res: QueryResult<Pet> = await pool.query("SELECT * FROM pets WHERE id = $1", [id]);
        return res.rows[0] ?? null;
    }

    static async getPetsOfUser(userId: string): Promise<Pet[]> {
        const res: QueryResult<Pet> = await pool.query(
            "SELECT * FROM pets WHERE user_id = $1 ORDER BY updated_at DESC, id DESC", [userId],
        );
        return res.rows;
    }
}
