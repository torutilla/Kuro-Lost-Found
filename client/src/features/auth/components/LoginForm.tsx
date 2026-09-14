import { Link } from "react-router-dom";
import PasswordField from "../components/PasswordField.tsx";
import useLogin from "../hooks/useLogin.tsx";
import useInput from "@shared/hooks/useInput.tsx";
import type { User } from "@shared/types/user.ts";
import Button from "@shared/components/common/Button.tsx";
import TextField from "@shared/components/common/TextField.tsx";
import { useToast } from "@shared/hooks/useToast.tsx";
import { LoginSchema, type LoginType } from "../schema/authSchema.ts";
import { useZodValidation } from "../hooks/useZodValidation.tsx";
import Form from "./Form.tsx";

type LoginFormProps = {
  onSuccess?: (user: User) => void;
};

function LoginForm({ onSuccess }: LoginFormProps) {
  const shape = LoginSchema.shape;
  const controllers = {
    password: useInput({ validator: shape.password }),
    email: useInput({ validator: shape.email }),
  };
  const { email, password } = controllers;
  const { validate } = useZodValidation<LoginType>(LoginSchema, controllers);
  const { showToast } = useToast();
  const { login, loading } = useLogin();
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const { success, data, errors } = validate();
    if (!success) {
      showToast(errors[0].message);
      return;
    }
    try {
      const user = await login(data.email, data.password);
      onSuccess?.(user);
    } catch {
      showToast("Login failed. Please try again.");
    }
  };
  return (
    <Form onSubmit={handleSubmit} disabled={loading}>
      <TextField id="email-field" placeholder="Email" {...email} />
      <PasswordField
        autoComplete="current-password"
        id="password-field"
        placeholder="Password"
        {...password}
      />
      <Link
        to="/forgot-password"
        className="text-sm text-primary w-fit self-end"
      >
        Forgot Password?
      </Link>

      <Button disabled={loading} type="submit" className="w-full">
        Login
      </Button>
    </Form>
  );
}

export default LoginForm;
