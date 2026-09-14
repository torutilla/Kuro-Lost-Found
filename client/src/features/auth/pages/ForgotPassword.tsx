import { Link } from "react-router-dom";
import AuthPage from "../components/AuthPage.tsx";
import Button from "@shared/components/common/Button.tsx";
import { ArrowBack, EmailOutlined } from "@mui/icons-material";

function ForgotPassword() {
  return (
    <AuthPage
      title="Forgot your password?"
      subtitle="We've all been there."
      variant="login"
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full items-start gap-3 rounded-2xl bg-accent/10 p-5">
          <EmailOutlined sx={{ fontSize: 20 }} className="mt-0.5 text-accent" />
          <p className="text-sm leading-relaxed text-accent">
            Email-based resets are on their way. In the meantime you can log in
            with Google, or create a fresh account if you're locked out.
          </p>
        </div>

        <Link to="/login" className="w-full">
          <Button className="w-full gap-2">
            <ArrowBack fontSize="small" />
            Back to log in
          </Button>
        </Link>
      </div>
    </AuthPage>
  );
}

export default ForgotPassword;
