export type Pet = {
    id: string;
    user_id: string;
    name: string;
    type: string;
    breed?: string | null;
    color: string;
    description: string;
    image_url: string;
    status: 'lost' | 'found';
    last_seen_location: string;
    date_lost: string;
    created_at: string;
};

export type PetResponse = {
    pets: Pet[];
    lastDateLost?: string;
}