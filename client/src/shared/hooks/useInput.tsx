import { useState } from "react";
import type z from "zod/v3";

type ValidationMode = "onBlur" | "onChange" | "onSubmit";
type UseInputOptions = {
  initialValue?: string;
  validator?: z.ZodSchema;
  validateOn?: ValidationMode;
};
type InputController = {
  validate: () => string | null;
  error: string | null;
  value: string;
  setError: (msg: string | null) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLElement>) => void;
  reset: () => void;
  onBlur: () => void;
};
function useInput({
  initialValue = "",
  validator,
  validateOn = "onBlur",
}: UseInputOptions): InputController {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function runValidation(v: string) {
    if (!validator) return null;

    const result = validator.safeParse(v);
    if (!result.success) {
      const errMessage = result.error.errors[0]?.message || "Invalid input";
      setError(errMessage);
      return errMessage;
    }
    setError(null);
    return null;
  }
  function onBlur() {
    runValidation(value);
  }
  function validate() {
    return runValidation(value);
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement, HTMLElement>) {
    const v = e.target.value;
    setValue(v);
    if (error || validateOn == "onChange") runValidation(v);
  }

  function reset() {
    setValue(initialValue);
    setError(null);
  }

  return {
    onBlur,
    setError,
    validate,
    error,
    value,
    onChange,
    reset,
  };
}

export default useInput;
