import GoogleSvg from "../assets/google-color.svg";
import useGoogleOAuth from "../hooks/useGoogleOAuth.tsx";
import type { User } from "@shared/types/user.ts";
import Button from "@shared/components/common/Button.tsx";
type GoogleLoginButtonProps = {
  onSuccess?: (user: User) => void;
};
function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const { login, loading } = useGoogleOAuth();
  const handleClick = async () => {
    try {
      const user = await login();
      onSuccess?.(user);
    } catch {}
  };
  return (
    <Button
      className="w-full"
      color="black"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
    >
      <img src={GoogleSvg} className="p-0.5" />
      <p>Sign in with Google</p>
    </Button>
  );
}

export default GoogleLoginButton;
