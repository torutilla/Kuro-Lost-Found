import type { User } from "@shared/index.ts";
import AuthFooter from "../components/AuthFooter.tsx";
import AuthPage from "../components/AuthPage.tsx";
import SignupForm from "../components/SignupForm.tsx";
import { useNavigate } from "react-router-dom";
import { saveUserInfo } from "@shared/types/localStorage/userStorage.ts";
function SignupPage() {
  const navigate = useNavigate();
  const onSuccess = (user: User) => {
    navigate("/");
    saveUserInfo(user);
  };
  return (
    <AuthPage title="Sign Up" subtitle="Register your account" variant="signup">
      <SignupForm onSuccess={onSuccess} />
      <AuthFooter
        label="Already have an account? "
        link={{ label: "Login", to: "/login" }}
      />
    </AuthPage>
  );
}

export default SignupPage;
