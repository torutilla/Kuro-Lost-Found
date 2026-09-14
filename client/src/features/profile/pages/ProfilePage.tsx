import { useNavigate } from "react-router-dom";
import useUser from "@shared/hooks/useUser.tsx";
import useLogout from "@features/auth/hooks/useLogout.tsx";
import Button from "@shared/components/common/Button.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import {
  ArrowBack,
  BadgeOutlined,
  Logout,
  MailOutline,
  Pets,
} from "@mui/icons-material";

function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const logout = useLogout();

  const ref = useGsapContext<HTMLDivElement>(
    ({ gsap }) => {
      gsap.from(".profile-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    [user.id],
  );

  const providerLabel = user.provider
    ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1)
    : "Kuro account";

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-10 lg:py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="profile-item link-underline inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-primary"
      >
        <ArrowBack fontSize="small" />
        Back
      </button>

      <div className="profile-item mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="grain relative h-24 overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary">
          <div className="pointer-events-none absolute -top-10 right-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="px-6 pt-5 pb-8 lg:px-10">
          {/* Identity sits fully below the banner so the cover never hides it. */}
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-3xl font-semibold text-secondary ring-1 ring-neutral-200">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-2xl font-semibold text-secondary">
                {user.name}
              </h1>
              <p className="text-sm text-neutral-500">{providerLabel}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 ring-1 ring-neutral-100">
              <MailOutline sx={{ fontSize: 18 }} className="text-accent" />
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-sm font-medium text-secondary">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 ring-1 ring-neutral-100">
              <BadgeOutlined sx={{ fontSize: 18 }} className="text-accent" />
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider">
                  Account
                </p>
                <p className="text-sm font-medium text-secondary">
                  Signed in with {providerLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 border-error px-5 text-error hover:bg-error/5"
              onClick={logout}
            >
              <Logout fontSize="small" />
              Log out
            </Button>
            <Button
              variant="outline"
              className="gap-2 px-5"
              onClick={() => navigate("/post")}
            >
              <Pets fontSize="small" />
              Report a pet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
