import TextField from "@shared/components/common/TextField.tsx";
import useInput from "@shared/hooks/useInput.tsx";
import Button from "@shared/components/common/Button.tsx";
import { useToast } from "@shared/hooks/useToast.tsx";
import PasswordField from "../components/PasswordField.tsx";
import useRegistration from "../hooks/useRegistration.tsx";
import PasswordChecklist from "../components/PasswordChecklist.tsx";
import { SignupSchema, type SignupType } from "../schema/authSchema.ts";
import Form from "./Form.tsx";
import { useZodValidation } from "../hooks/useZodValidation.tsx";
import type { User } from "@shared/index.ts";

function SignupForm({ onSuccess }: { onSuccess?: (user: User) => void }) {
  const { signup, loading } = useRegistration();
  const { showToast } = useToast();
  const shape = SignupSchema.innerType().shape;
  const controllers = {
    name: useInput({ validator: shape.name }),
    email: useInput({ validator: shape.email }),
    password: useInput({ validator: shape.password }),
    confirmPassword: useInput({ validator: shape.confirmPassword }),
  };
  const { name, email, password, confirmPassword } = controllers;

  const { validate } = useZodValidation<SignupType>(SignupSchema, controllers);

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const { errors, data, success } = validate();
    if (!success) {
      showToast(errors[0].message);
      return;
    }

    try {
      const user = await signup({
        email: data.email,
        name: data.name,
        password: data.password,
      });
      onSuccess?.(user);
    } catch {
      showToast("Signup failed. Please try again.", "error");
    }
  };

  return (
    <Form disabled={loading} onSubmit={onSubmit}>
      <TextField placeholder="Name" type="text" id="NameField" {...name} />
      <TextField placeholder="Email" type="text" id="EmailField" {...email} />
      <PasswordField id="PasswordField" placeholder="Password" {...password} />
      <PasswordChecklist text={password.value} />
      <PasswordField
        id="ConfirmPassField"
        placeholder="Confirm Password"
        {...confirmPassword}
      />
      <Button type="submit" disabled={loading} className="w-full">
        Submit
      </Button>
    </Form>
  );
}

export default SignupForm;
