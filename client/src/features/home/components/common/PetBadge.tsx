import { cn } from "@shared/index.ts";
import type { Pet } from "../../schema/petSchema.ts";

type PetBadgeProps = {
  status: Pet["status"];
};

/** Status pill shown over pet imagery. Kept high-contrast for legibility. */
function PetBadge({ status }: PetBadgeProps) {
  const colors: Record<Pet["status"], string> = {
    draft: "bg-amber-400",
    lost: "bg-error",
    found: "bg-success",
    reunited: "bg-emerald-600",
    archived: "bg-neutral-500",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
        tracking-wide text-white uppercase shadow-sm ring-1 ring-white/25 backdrop-blur-sm`,
        colors[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {label}
    </span>
  );
}

export default PetBadge;
