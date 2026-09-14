import { Link } from "react-router-dom";
type AuthFooterProps = {
  label: string;
  link: {
    label: string;
    to: string;
  };
};
function AuthFooter({ link, label }: AuthFooterProps) {
  return (
    <p className="text-center text-sm text-neutral-500">
      {label}
      <Link
        to={link.to}
        className="link-underline font-medium text-primary transition-colors hover:text-primary/80"
      >
        {link.label}
      </Link>
    </p>
  );
}

export default AuthFooter;
