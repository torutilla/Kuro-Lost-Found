import { useEffect, useRef, useState } from "react";
import NavItem from "../common/NavItem.tsx";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { cn } from "@shared/index.ts";

function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const ref = useGsapContext<HTMLDivElement>(({ gsap, root }) => {
    gsap.from(root, {
      y: 48,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.1,
      clearProps: "opacity",
    });
  }, []);

  // Hide the pill while scrolling down so bottom-anchored actions (the
  // submit button on the report form, the map controls) stay tappable;
  // any upward scroll (or reaching the top) brings it back.
  useEffect(() => {
    lastY.current = 0;
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      const y = typeof el.scrollTop === "number" ? el.scrollTop : 0;
      const delta = y - lastY.current;
      lastY.current = y;
      if (y < 8) return setHidden(false);
      if (Math.abs(delta) < 12) return;
      setHidden(delta > 0);
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [location.pathname]);

  return (
    // Outer nav owns the horizontal centering; the inner pill is what GSAP
    // animates so the two transforms never clash. Hiding also moves the whole
    // pill below the fold so it clears bottom-anchored buttons.
    <nav
      className={cn(
        "fixed bottom-3 left-1/2 -translate-x-1/2 z-50 lg:hidden",
        "transition-all duration-300 ease-out",
        hidden && "pointer-events-none opacity-0 translate-y-24",
      )}
    >
      <div
        ref={ref}
        className="rounded-full gap-2 p-2 h-16 bg-primary/95 backdrop-blur-md flex justify-around items-center shadow-2xl shadow-primary/30 ring-1 ring-white/10"
      >
        <NavItem
          icon={<HomeIcon />}
          label=""
          onClick={() => navigate("/home")}
          active={location.pathname == "/home"}
        />
        <NavItem
          icon={<ChatBubbleOutlineIcon />}
          label=""
          onClick={() => navigate("/inbox")}
          active={location.pathname == "/inbox"}
        />
        <NavItem
          icon={<PersonOutlineIcon />}
          label=""
          onClick={() => navigate("/profile")}
          active={location.pathname == "/profile"}
        />
      </div>
    </nav>
  );
}

export default MobileNavbar;

