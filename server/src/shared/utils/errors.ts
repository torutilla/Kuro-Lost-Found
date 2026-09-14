import type { ValidationError } from "../types/api.js";

export class AppError extends Error {
    public readonly code: number;
    public readonly errors?: ValidationError[];

    constructor(
        message: string,
        code: number,
        errors?: ValidationError[],
    ) {
        super(message);

        this.code = code;

        if (errors) {
            this.errors = errors;
        }

        Object.setPrototypeOf(
            this,
            new.target.prototype,
        );
    }
}

