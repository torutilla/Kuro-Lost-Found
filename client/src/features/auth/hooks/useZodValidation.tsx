import z from "zod/v3";

export function useZodValidation<T>(
  schema: z.ZodSchema,
  controllers: Record<string, any>,
) {
  type ValidationResult =
    | { success: true; data: T; errors: null }
    | { success: false; data: null; errors: z.ZodIssue[] };
  function validate(): ValidationResult {
    const values = Object.fromEntries(
      Object.entries(controllers).map(([k, v]) => [k, v.value]),
    );
    const res = schema.safeParse(values);
    if (!res.success) {
      const fieldErrors = res.error.flatten().fieldErrors;
      Object.keys(controllers).forEach((key) => {
        const typedKey = key as keyof typeof controllers;
        const messages = fieldErrors[typedKey];
        controllers[typedKey].setError(messages ? messages[0] : null);
      });
      return { success: false, data: null, errors: res.error.errors };
    }
    Object.values(controllers).forEach((ctrl) => ctrl.setError(null));
    return {
      success: true,
      data: res.data as T,
      errors: null,
    };
  }

  return { validate };
}
