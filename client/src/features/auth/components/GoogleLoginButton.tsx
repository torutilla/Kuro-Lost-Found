import GoogleSvg from "../assets/google-color.svg";
import useGoogleOAuth from "../hooks/useGoogleOAuth.tsx";
import Button from "@shared/components/common/Button.tsx";

/**
 * Kicks off the Google OAuth flow. The browser leaves this page entirely, so
 * there is no in-page loading/success state — the server redirects back to
 * `/home` on success or `/auth/failed` on failure.
 */
function GoogleLoginButton() {
  const { login } = useGoogleOAuth();
  return (
    <Button
      className="w-full"
      color="black"
      variant="outline"
      onClick={login}
    >
      <img src={GoogleSvg} className="p-0.5" alt="" />
      <p>Sign in with Google</p>
    </Button>
  );
}

export default GoogleLoginButton;
