import GoogleLoginButton from "../components/GoogleLoginButton.tsx";
import LoginForm from "../components/LoginForm.tsx";
import usePostLogin from "../hooks/usePostLogin.tsx";
import AuthPage from "../components/AuthPage.tsx";
import OrDivider from "../components/OrDivider.tsx";
import AuthFooter from "../components/AuthFooter.tsx";

function LoginPage() {
  const postLogin = usePostLogin();
  return (
    <AuthPage
      title="Welcome back!"
      variant="login"
      subtitle="Login to continue"
    >
      <LoginForm onSuccess={postLogin} />
      <OrDivider />

      <GoogleLoginButton onSuccess={postLogin} />

      <AuthFooter
        link={{ label: "Create an account", to: "/signup" }}
        label="Don't have an account? "
      />
    </AuthPage>
  );
}

export default LoginPage;
