import { useAuth } from "@features/auth/hooks/useAuth.tsx";
import NavItem from "../common/NavItem.tsx";
import ProfileTab from "../common/ProfileTab.tsx";
import { Home, Message, Pets } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useLogout from "@features/auth/hooks/useLogout.tsx";
import BrandLogo from "../common/BrandLogo.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";

function DesktopSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const ref = useGsapContext<HTMLElement>(
    ({ gsap, root }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(root, { x: -28, opacity: 0, duration: 0.6 })
        .from(
          ".sidebar-item",
          { x: -14, opacity: 0, duration: 0.45, stagger: 0.08 },
          "-=0.35",
        )
        .from(
          ".sidebar-profile",
          { y: 12, opacity: 0, duration: 0.5 },
          "-=0.25",
        );
    },
    [user],
  );

  if (!user) return null;

  return (
    <nav
      ref={ref}
      className="grain hidden lg:flex fixed top-0 left-0 h-full w-56 bg-gradient-to-b from-primary via-secondary to-secondary flex-col py-6 px-4 z-50 shadow-2xl shadow-primary/20"
    >
      <div className="sidebar-item relative z-1 mb-10">
        <BrandLogo size="md" showWordmark />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="sidebar-item">
          <NavItem
            active={location.pathname === "/home"}
            label="Home"
            icon={<Home />}
            onClick={() => navigate("/home")}
          />
        </div>
        <div className="sidebar-item">
          <NavItem
            label="Messages"
            icon={<Message />}
            active={location.pathname === "/inbox"}
            onClick={() => navigate("/inbox")}
          />
        </div>
        <div className="sidebar-item">
          <NavItem
            active={location.pathname === "/post"}
            label="Post"
            icon={<Pets />}
            onClick={() => navigate("/post")}
          />
        </div>
      </div>

      <div className="sidebar-profile relative z-1">
        <ProfileTab name={user.name} email={user.email} onLogout={logout} />
      </div>
    </nav>
  );
}

export default DesktopSidebar;

