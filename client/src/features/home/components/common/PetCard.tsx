import { cn } from "@shared/index.ts";
import Button from "@shared/components/common/Button.tsx";
import LabeledIcon from "@shared/components/common/LabeledIcon.tsx";
import { AccessTime, LocationOn, Place } from "@mui/icons-material";
import type { Pet } from "../../schema/petSchema.ts";
import PetBadge from "./PetBadge.tsx";
import Image from "@shared/components/common/SkeletonImg.tsx";
import Divider from "@shared/components/common/Divider.tsx";
import { Link } from "react-router-dom";
import { useMapProvider } from "@features/map/components/MapProvider.tsx";
import { formatTimeAgo } from "@shared/utils/datetime.ts";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";

type PetCardProps = {
  pet: Pet;
};

function PetCard({ pet }: PetCardProps) {
  const { setFlyToTarget } = useMapProvider();

  // Each card fades up as it mounts, so both the initial load and pets
  // arriving over the socket feel alive.
  const ref = useGsapContext<HTMLAnchorElement>(({ gsap, root }) => {
    gsap.from(root, {
      opacity: 0,
      y: 18,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "transform",
    });
  }, [pet.id]);

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pet.location_point) {
      setFlyToTarget([pet.location_point.lat, pet.location_point.lng]);
    }
  };

  const meta = pet.breed ? `${pet.type} · ${pet.breed}` : pet.type;

  return (
    <Link
      ref={ref}
      to={`/pets/${pet.id}`}
      className="group block"
      aria-label={`View details for ${pet.name}`}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
          "border-neutral-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-primary/10",
        )}
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            alt={pet.name}
            src={pet.image_url}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 right-3">
            <PetBadge status={pet.status} />
          </div>
          <p className="absolute bottom-2.5 left-3 text-xs font-medium text-white/85">
            {meta}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-lg font-semibold tracking-tight text-secondary">
            {pet.name}
          </h3>

          <div className="mt-2 flex flex-col gap-1 text-sm text-neutral-500">
            <LabeledIcon icon={LocationOn} label={pet.location_description} />
            <LabeledIcon
              icon={AccessTime}
              label={formatTimeAgo(pet.observed_at)}
            />
          </div>

          <div className="py-3">
            <Divider />
          </div>

          <p className="line-clamp-2 min-h-12 text-sm leading-relaxed text-neutral-600">
            {pet.description}
          </p>

          <div className="mt-3">
            <Button
              variant="outline"
              className="w-full gap-1.5 text-xs"
              onClick={handleMapClick}
            >
              <Place fontSize="small" />
              Locate on map
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PetCard;

