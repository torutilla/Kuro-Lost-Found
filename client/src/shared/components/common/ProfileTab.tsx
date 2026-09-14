import { useNavigate } from "react-router-dom";
import Dropdown from "./DropdownButton.tsx";
import { Logout, MoreHoriz, PersonOutline } from "@mui/icons-material";

type ProfileTabProps = {
  name: string;
  email: string;
  avatarUrl?: string;
  onLogout?: () => void;
};

/**
 * Sidebar account card. Account actions live in the menu, which opens upward
 * (above the tab) so it can't fall off the bottom of the viewport, and closes
 * itself as soon as an option is picked.
 */
function ProfileTab({ name, email, avatarUrl, onLogout }: ProfileTabProps) {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10">
      {/* Identity block: avatar + name + email. Actions live in the menu. */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-white/25 to-white/5 ring-1 ring-white/20">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col items-start">
          <span className="max-w-full truncate text-sm font-semibold leading-tight text-white">
            {name}
          </span>
          <span className="max-w-full truncate text-xs leading-tight text-white/60">
            {email}
          </span>
        </div>
      </div>

      <Dropdown
        placement="top"
        trigger={
          <button
            aria-label="Account options"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <MoreHoriz fontSize="small" />
          </button>
        }
      >
        <button
          onClick={() => navigate("/profile")}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white/85 transition-colors hover:bg-white/10"
        >
          <PersonOutline fontSize="small" />
          View profile
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-300 transition-colors hover:bg-white/10"
        >
          <Logout fontSize="small" />
          Log out
        </button>
      </Dropdown>
    </div>
  );
}

export default ProfileTab;
