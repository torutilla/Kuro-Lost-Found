import { Link, useSearchParams } from "react-router-dom";
import AuthPage from "../components/AuthPage.tsx";
import Button from "@shared/components/common/Button.tsx";

/**
 * Friendly landing spot when the Google OAuth callback cannot complete.
 * The server redirects here as `/auth/failed?reason=declined|state|provider`.
 */
const MESSAGES: Record<string, { title: string; body: string }> = {
  declined: {
    title: "Sign-in cancelled",
    body: "You declined Google's permission request, so we couldn't sign you in. You can try again, or use your email and password instead.",
  },
  state: {
    title: "That sign-in link expired",
    body: "For your security, each sign-in attempt only works once and expires after a few minutes. Please start again.",
  },
  provider: {
    title: "Google sign-in failed",
    body: "Something went wrong while talking to Google. Please try again in a moment, or log in with your email and password.",
  },
};

function OAuthFailurePage() {
  const [params] = useSearchParams();
  const reason = params.get("reason") ?? "provider";
  const { title, body } = MESSAGES[reason] ?? MESSAGES.provider;

  return (
    <AuthPage title={title} subtitle="Google sign-in" variant="login">
      <p className="max-w-sm text-center text-sm leading-relaxed text-neutral-600">
        {body}
      </p>
      <Link to="/login" className="w-full">
        <Button className="w-full px-8 py-3">Back to log in</Button>
      </Link>
    </AuthPage>
  );
}

export default OAuthFailurePage;