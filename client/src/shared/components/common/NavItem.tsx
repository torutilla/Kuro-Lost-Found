import { cn } from "@shared/index.ts";

type NavItemProps = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `lg:w-full justify-center lg:justify-start
        flex items-center gap-3 px-3 py-2 rounded-full lg:rounded-xl w-fit
        transition-all duration-300 ease-out group relative`,
        active
          ? "bg-white/15 text-white shadow-inner"
          : "text-white/70 hover:bg-white/10 hover:text-white lg:translate-x-0.5",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-r-full bg-white lg:block" />
      )}
      <span
        className={cn(
          "transition-transform duration-300 group-hover:scale-110",
          active ? "text-white" : "text-white/70 group-hover:text-white",
        )}
      >
        {icon}
      </span>

      <span className="text-sm font-medium hidden lg:block">{label}</span>
    </button>
  );
}

export default NavItem;

