import type { ZodSchema } from "zod/v3";

export function useForm(
  schema: ZodSchema,
  onSubmit: (e: React.SubmitEvent) => void,
) {
  void schema;
  void onSubmit;
  const handleSubmit = async () => {};
  return { handleSubmit };
}
