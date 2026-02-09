export type PublicUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    provider: string;
}

export type UserRow = PublicUser & {
    hash?: string | null;
    provider_id?: string | null;
}