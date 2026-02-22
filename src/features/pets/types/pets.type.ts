export type Pet = {
    id: string;
    user_id: string;
    name: string;
    type: string;
    breed?: string | null;
    color: string;
    description: string;
    image_url: string;
    status: PetStatus;
    last_seen_location: string;
    date_lost: string;
    created_at: string;
};


export type PetResponse = {
    pets: Pet[];
    nextCursor?: {
        lastId?: string;
        lastDateLost?: string;
    } | null
}

export type GetPetsOptions = {
    limit?: number;
    lastId?: string;
    lastDateLost?: string;
    status: PetFilter;
}

export type PetStatus = "lost" | "found";

export type PetFilter = PetStatus | "all";