

import type { PetRequest } from "../schema/pets.schema.js";

export type PetInsert = PetRequest & { user_id: string };

export type GetPetsOptions = {
    limit?: number;
    lastId?: string;
    lastDateLost?: string;
    status: PetFilter;
}

export type PetStatus = "lost" | "found";

export type PetFilter = PetStatus | "all";