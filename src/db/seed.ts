import "dotenv/config";
import bcrypt from "bcrypt";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to run db:seed");

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const users = [
    { email: "alice.demo@kuro.local", name: "Alice Santos", provider: "local", password: "DemoPass123!" },
    { email: "ben.demo@kuro.local", name: "Ben Cruz", provider: "local", password: "DemoPass123!" },
    { email: "gabi.demo@kuro.local", name: "Gabi Reyes", provider: "google", providerId: "demo-google-gabi-001" },
] as const;

type PetSeed = {
    id: string; owner: string; name: string; type: string; breed: string | null; color: string;
    description: string; imageUrl: string; initialStatus: "draft" | "lost" | "found";
    finalStatus: "draft" | "lost" | "found" | "reunited" | "archived";
    location: string; observedAt: string; lat: number; lng: number;
};

const pets: PetSeed[] = [
    { id: "10000000-0000-4000-8000-000000000001", owner: "alice.demo@kuro.local", name: "Mochi", type: "dog", breed: "Shih Tzu", color: "white", description: "Small dog with a blue collar.", imageUrl: "https://images.example.test/mochi.jpg", initialStatus: "lost", finalStatus: "lost", location: "BGC High Street, Taguig", observedAt: "2026-09-10T08:00:00.000Z", lat: 14.5507, lng: 121.0508 },
    { id: "10000000-0000-4000-8000-000000000002", owner: "ben.demo@kuro.local", name: "Luna", type: "cat", breed: "Persian", color: "gray", description: "Friendly gray cat near the market.", imageUrl: "https://images.example.test/luna.jpg", initialStatus: "found", finalStatus: "found", location: "Salcedo Market, Makati", observedAt: "2026-09-11T09:30:00.000Z", lat: 14.5601, lng: 121.0206 },
    { id: "10000000-0000-4000-8000-000000000003", owner: "gabi.demo@kuro.local", name: "Buddy", type: "dog", breed: null, color: "brown", description: "Medium-sized brown dog awaiting publication.", imageUrl: "https://images.example.test/buddy.jpg", initialStatus: "draft", finalStatus: "draft", location: "Quezon Memorial Circle, Quezon City", observedAt: "2026-09-09T04:00:00.000Z", lat: 14.6519, lng: 121.0499 },
    { id: "10000000-0000-4000-8000-000000000004", owner: "alice.demo@kuro.local", name: "Pepper", type: "cat", breed: "Puspin", color: "black", description: "Recovered safely by its owner.", imageUrl: "https://images.example.test/pepper.jpg", initialStatus: "found", finalStatus: "reunited", location: "UP Diliman, Quezon City", observedAt: "2026-09-08T02:00:00.000Z", lat: 14.6548, lng: 121.0685 },
    { id: "10000000-0000-4000-8000-000000000005", owner: "ben.demo@kuro.local", name: "Sunny", type: "dog", breed: "Golden Retriever", color: "gold", description: "Old report retained for history.", imageUrl: "https://images.example.test/sunny.jpg", initialStatus: "draft", finalStatus: "archived", location: "Rizal Park, Manila", observedAt: "2026-09-01T06:00:00.000Z", lat: 14.5826, lng: 120.9790 },
    { id: "10000000-0000-4000-8000-000000000006", owner: "gabi.demo@kuro.local", name: "Kiko", type: "bird", breed: null, color: "green", description: "Parakeet seen near the river.", imageUrl: "https://images.example.test/kiko.jpg", initialStatus: "lost", finalStatus: "found", location: "Pasig River Esplanade, Manila", observedAt: "2026-09-12T03:15:00.000Z", lat: 14.5953, lng: 120.9842 },
    { id: "10000000-0000-4000-8000-000000000007", owner: "alice.demo@kuro.local", name: "Toby", type: "dog", breed: "Aspen", color: "tan", description: "Young tan dog with a red leash.", imageUrl: "https://images.example.test/toby.jpg", initialStatus: "lost", finalStatus: "lost", location: "Eastwood, Quezon City", observedAt: "2026-09-12T11:00:00.000Z", lat: 14.6091, lng: 121.0792 },
    { id: "10000000-0000-4000-8000-000000000008", owner: "ben.demo@kuro.local", name: "Miso", type: "cat", breed: "Siamese", color: "cream", description: "Siamese cat reported by a finder.", imageUrl: "https://images.example.test/miso.jpg", initialStatus: "found", finalStatus: "found", location: "Bonifacio Global City, Taguig", observedAt: "2026-09-13T01:45:00.000Z", lat: 14.5547, lng: 121.0529 },
];

const run = async () => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const userIds = new Map<string, string>();
        for (const user of users) {
            const hash = user.provider === "local" ? await bcrypt.hash(user.password, 12) : null;
            const result = await client.query<{ id: string }>(`
                INSERT INTO users (email, hash, provider, provider_id, name)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, updated_at = now()
                RETURNING id
            `, [user.email, hash, user.provider, user.provider === "google" ? user.providerId : null, user.name]);
            userIds.set(user.email, result.rows[0]!.id);
        }
        for (const pet of pets) {
            await client.query(`
                INSERT INTO pets (id, user_id, name, type, breed, color, description, image_url, status,
                    location_description, observed_at, location_point)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                    ST_SetSRID(ST_MakePoint($13, $12), 4326)::geography)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name, type = EXCLUDED.type, breed = EXCLUDED.breed, color = EXCLUDED.color,
                    description = EXCLUDED.description, image_url = EXCLUDED.image_url,
                    location_description = EXCLUDED.location_description, observed_at = EXCLUDED.observed_at,
                    location_point = EXCLUDED.location_point
            `, [pet.id, userIds.get(pet.owner), pet.name, pet.type, pet.breed, pet.color, pet.description,
                pet.imageUrl, pet.initialStatus, pet.location, pet.observedAt, pet.lat, pet.lng]);
            if (pet.finalStatus !== pet.initialStatus) {
                await client.query("UPDATE pets SET status = $2 WHERE id = $1", [pet.id, pet.finalStatus]);
            }
        }
        await client.query("COMMIT");
        console.log("Demo seed completed: 3 users and 8 pet reports.");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

void run();
