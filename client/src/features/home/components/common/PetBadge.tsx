import { cn } from "@shared/index.ts";

type PetBadgeProps = {
  status: "lost" | "found" | "sighted";
};

/** Status pill shown over pet imagery. Kept high-contrast for legibility. */
function PetBadge({ status }: PetBadgeProps) {
  const colors = {
    lost: "bg-error",
    found: "bg-success",
    sighted: "bg-amber-400",
  }[status];
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
        tracking-wide text-white uppercase shadow-sm ring-1 ring-white/25 backdrop-blur-sm`,
        colors,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {label}
    </span>
  );
}

export default PetBadge;

