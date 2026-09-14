import { Link } from "react-router-dom";
import PetBadge from "@features/home/components/common/PetBadge.tsx";
import type { Pet } from "../../home/schema/petSchema.ts";
import { ArrowForward } from "@mui/icons-material";

/** Compact pet preview rendered inside a Leaflet popup marker. */
function PetPopup({ pet }: { pet: Pet }) {
  return (
    <div className="w-56">
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <img
          src={pet.image_url}
          alt={pet.name}
          className="h-28 w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <PetBadge status={pet.status} />
        </div>
      </div>

      <h3 className="font-display text-sm font-semibold text-secondary">
        {pet.name}
      </h3>
      <p className="text-xs text-neutral-500">{pet.type}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
        {pet.description}
      </p>

      <Link
        to={`/pets/${pet.id}`}
        className="group mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
      >
        View details
        <ArrowForward
          sx={{ fontSize: 14 }}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}

export default PetPopup;

