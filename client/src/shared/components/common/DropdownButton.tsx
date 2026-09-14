import { useEffect, useRef, useState } from "react";
import { cn } from "@shared/index.ts";

type DropdownProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  /** Which direction the menu opens away from the trigger. */
  placement?: "top" | "bottom";
};

function Dropdown({
  trigger,
  children,
  placement = "bottom",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "dropdown-in absolute z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-secondary/90 shadow-2xl backdrop-blur-md",
            placement === "top"
              ? "bottom-full right-0 mb-1 origin-bottom-right"
              : "mt-2 right-0 origin-top-right",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

