export type RegisterInput =
    | LocalUserInput
    | GoogleUserInput;

export type LocalUserInput = { provider: "local"; email: string; password: string, name: string };
export type GoogleUserInput = { provider: "google"; email: string; providerId: string, name: string };