

export type GetPetsOptions = {
    limit?: number;
    lastId?: string;
    lastDateLost?: string;
    status: PetFilter;
}

export type PetStatus = "lost" | "found";

export type PetFilter = PetStatus | "all";