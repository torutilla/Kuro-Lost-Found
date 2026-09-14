
export const isTooShort = (v: string) => v.length < 8;
export const missingUppercase = (v: string) => !/[A-Z]/.test(v);
export const missingNumber = (v: string) => !/\d/.test(v);

export type PasswordRule = {
    id: string;
    message: string;
    isInvalid: (v: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
    {
        id: "length",
        message: "At least 8 characters",
        isInvalid: isTooShort,
    },
    {
        id: "uppercase",
        message: "One uppercase letter",
        isInvalid: missingUppercase,
    },
    {
        id: "number",
        message: "One number",
        isInvalid: missingNumber,
    },
];
