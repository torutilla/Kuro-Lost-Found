import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Marker } from "react-leaflet";
import { type Pet } from "../../schema/petSchema.ts";
import { fetchHandler } from "@shared/index.ts";
import PetBadge from "./PetBadge.tsx";
import { useAuth } from "@features/auth/hooks/useAuth.tsx";
import Button from "@shared/components/common/Button.tsx";
import LabeledIcon from "@shared/components/common/LabeledIcon.tsx";
import Image from "@shared/components/common/SkeletonImg.tsx";
import EmptyState from "@shared/components/common/EmptyState.tsx";
import LoadingScreen from "@shared/components/layout/LoadingScreen.tsx";
import BaseMap from "@features/map/components/BaseMap.tsx";
import { createIcon, statusMarker } from "@features/map/components/Markers.tsx";
import { formatTimeAgo } from "@shared/utils/datetime.ts";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import {
  AccessTime,
  ArrowBack,
  Category,
  ChatBubbleOutline,
  LocationOn,
  Palette,
  Pets,
  PetsOutlined,
} from "@mui/icons-material";
import type { LatLngTuple } from "leaflet";

/**
 * Full detail view for a single report, loaded directly from
 * `GET /api/v1/pets/:id` instead of only scanning the first feed page.
 * Archived or reunited reports that the viewer doesn't own surface a 404
 * and render the graceful "not found" state below.
 */
function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openingConversation, setOpeningConversation] = useState(false);

  const isOwner = pet && user && pet.user_id === user.userId 
    ? true 
    : pet && user && pet.user_id === user.id 
    ? true 
    : false;

  const handleOpenConversation = async () => {
    if (!user || isOwner || !pet) return;
    setOpeningConversation(true);
    try {
      const res = await fetchHandler<{ conversationId: string }>(
        `api/v1/messaging/conversations`,
        {
          method: "POST",
          body: JSON.stringify({ pet_id: pet.id }),
        }
      );
      navigate(`/inbox/${res.conversationId}`);
    } catch (err) {
      console.error("Failed to open conversation:", err);
    } finally {
      setOpeningConversation(false);
    }
  };

  const handleViewOnMap = () => {
    if (!pet?.location_point) return;
    navigate(`/home?flyTo=${pet.location_point.lat},${pet.location_point.lng}`);
  };

  useEffect(() => {
    let cancelled = false;
    async function loadPet() {
      try {
        setError(null);
        const data = await fetchHandler<Pet>(`api/v1/pets/${id}`);
        if (cancelled) return;
        setPet(data);
      } catch (err) {
        if (cancelled) return;
        setPet(null);
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPet();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const ref = useGsapContext<HTMLDivElement>(
    ({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".detail-back", { x: -14, opacity: 0, duration: 0.5 })
        .from(
          ".detail-media",
          { y: 26, opacity: 0, scale: 0.98, duration: 0.7 },
          "-=0.3",
        )
        .from(
          ".detail-block",
          { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 },
          "-=0.55",
        );
    },
    [pet?.id],
  );
  if (loading && !pet) return <LoadingScreen />;

  if (!pet) {
    return (
      <EmptyState
        icon={PetsOutlined}
        title="Report not found"
        description={
          error
            ? error
            : "This pet may have been reunited, archived, or the link is out of date."
        }
        action={
          <Link to="/home">
            <Button variant="outline" className="gap-1.5">
              <ArrowBack fontSize="small" />
              Back to the map
            </Button>
          </Link>
        }
      />
    );
  }
  const coords: LatLngTuple | null = pet.location_point
    ? [pet.location_point.lat, pet.location_point.lng]
    : null;

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-10 lg:py-12"
    >
      <Link
        to="/home"
        className="detail-back link-underline inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-primary"
      >
        <ArrowBack fontSize="small" />
        Back to the map
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div className="detail-media relative overflow-hidden rounded-3xl border border-neutral-200 bg-card shadow-sm">
          <Image
            alt={pet.name}
            src={pet.image_url}
            className="aspect-4/3 w-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <PetBadge status={pet.status} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="detail-block">
            <h1 className="text-4xl font-semibold text-secondary lg:text-5xl">
              {pet.name}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {pet.status === "lost"
                ? "Reported lost — please keep an eye out."
                : "Found and safe with a good samaritan."}
            </p>
          </div>

          <div className="detail-block mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200">
              <Category sx={{ fontSize: 15 }} />
              {pet.type}
            </span>
            {pet.breed && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200">
                <Pets sx={{ fontSize: 15 }} />
                {pet.breed}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200">
              <Palette sx={{ fontSize: 15 }} />
              {pet.color}
            </span>
          </div>

          <div className="detail-block mt-7 flex flex-col gap-2 text-sm text-neutral-600">
            <LabeledIcon icon={LocationOn} label={pet.location_description} />
            <LabeledIcon
              icon={AccessTime}
              label={`Seen ${formatTimeAgo(pet.observed_at)}`}
            />
          </div>

          <div className="detail-block mt-7 rounded-2xl border border-neutral-200 bg-card p-5">
            <h2 className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
              Description
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {pet.description}
            </p>
          </div>

          {coords && (
            <div className="detail-block mt-7">
              <h2 className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                Last seen here
              </h2>
              <div className="mt-3 h-56 w-full overflow-hidden rounded-2xl border border-neutral-200">
                <BaseMap center={coords} zoom={15}>
                  <Marker
                    position={coords}
                    icon={createIcon(statusMarker[pet.status])}
                  />
                </BaseMap>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
              </p>
            </div>
          )}

          <div className="detail-block mt-8 flex flex-wrap gap-3">
            <Button
              disabled={openingConversation || !pet || isOwner}
              className="group gap-2 px-6 py-3"
              onClick={handleOpenConversation}
            >
              <ChatBubbleOutline fontSize="small" />
              {isOwner ? "You are the owner" : openingConversation ? "Opening…" : "Message the reporter"}
            </Button>
            <Button
              variant="outline"
              className="gap-2 px-6 py-3"
              color="secondary"
              onClick={handleViewOnMap}
            >
              <LocationOn fontSize="small" />
              View on the map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetails;
