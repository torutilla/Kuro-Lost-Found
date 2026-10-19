import TextField from "@shared/components/common/TextField.tsx";
import usePostPet from "../../hooks/usePostPet.tsx";
import { PetRequestSchema } from "../../schema/petSchema.ts";
import { z } from "zod/v3";
import Button from "@shared/components/common/Button.tsx";
import MapPicker from "@features/map/components/MapPicker.tsx";
import { useState } from "react";
import type { LatLngTuple } from "leaflet";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { Pets, Schedule, Image as ImageIcon } from "@mui/icons-material";

const selectClass =
  "w-full rounded-lg p-2 bg-neutral-200 border border-neutral-300 focus:ring-1 focus:ring-primary outline-none transition-colors";

const FIELD_LABELS: Record<string, string> = {
  name: "Pet name",
  status: "Status",
  type: "Species",
  breed: "Breed",
  color: "Color",
  description: "Description",
  image_url: "Photo URL",
  location_description: "Last seen location",
  observed_at: "Date last seen",
  location_point: "Map location",
};

/** Turn a Zod issue from the shared report schema into a readable form message. */
function issueToMessage(issue: z.ZodIssue): string {
  const label = FIELD_LABELS[String(issue.path[0] ?? "")] ?? "Form";
  if (issue.code === "invalid_type" && (issue.received === "null" || issue.received === "undefined")) {
    return `${label} is required.`;
  }
  return `${label}: ${issue.message}`;
}

function PostPetForm({
  onSuccess,
}: {
  onSuccess?: (id: string) => void;
}) {
  const { postPet, loading, error } = usePostPet();
  const [coords, setCoords] = useState<LatLngTuple | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const handleCoordsChange = (next: LatLngTuple) => {
    setCoords(next);
    setLocationError(null);
  };

  const ref = useGsapContext<HTMLFormElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".post-head > *", { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 })
      .from(
        ".post-section",
        { y: 26, opacity: 0, duration: 0.6, stagger: 0.12 },
        "-=0.3",
      );
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors([]);

    // A report is meaningless without a map location — reject early with a
    // readable message instead of a silent console log.
    if (!coords) {
      setLocationError(
        "Please pin the exact spot on the map — tap the map to select where the pet was seen.",
      );
      return;
    }

    const formData = new FormData(e.currentTarget);

    const observedAtRaw = String(formData.get("observed_at") ?? "");
    if (!observedAtRaw || Number.isNaN(new Date(observedAtRaw).getTime())) {
      setFieldErrors(["Date last seen: please choose a valid date and time."]);
      return;
    }

    // Note: no `user_id` here. The server derives the owner from the
    // authenticated session.
    const payload = {
      name: formData.get("name"),
      type: formData.get("type"),
      breed: formData.get("breed") || undefined,
      color: formData.get("color"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
      status: formData.get("status"),
      location_description: formData.get("location_description"),
      location_point: {
        lat: coords[0],
        lng: coords[1],
      },
      observed_at: new Date(observedAtRaw).toISOString(),
    };

    const res = PetRequestSchema.safeParse(payload);

    if (!res.success) {
      setFieldErrors(res.error.issues.map(issueToMessage));
      return;
    }

    try {
      const id = await postPet(res.data);
      onSuccess?.(id);
    } catch {
      // Server/network failures are surfaced through `error` from usePostPet
      // and rendered below.
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-10 lg:py-12"
    >
      <header className="post-head mb-8">
        <p className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
          New report
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-secondary">
          Help them get home
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
          The more detail you add, the easier it is for someone to spot them.
          All fields marked below are required.
        </p>
      </header>

      {/* ---------- The pet ---------- */}
      <section className="post-section rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-5 flex items-center gap-2 text-secondary">
          <Pets fontSize="small" />
          <h2 className="text-lg font-semibold">The pet</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <TextField
            label="Pet Name"
            name="name"
            placeholder="e.g. Buddy"
            required
          />

          <div className="grid items-start w-full">
            <label className="text-accent" htmlFor="status-field">
              Status
            </label>
            <select id="status-field" name="status" className={selectClass}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <p className="text-xs text-transparent">&nbsp;</p>
          </div>

          <TextField
            label="Species"
            name="type"
            placeholder="e.g. Dog, Cat, Bird"
            required
          />
          <TextField
            label="Breed"
            name="breed"
            placeholder="e.g. Golden Retriever (Optional)"
          />
          <TextField
            label="Color"
            name="color"
            placeholder="e.g. Brown and White"
            required
          />
        </div>
      </section>

      {/* ---------- When & where ---------- */}
      <section className="post-section mt-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-5 flex items-center gap-2 text-secondary">
          <Schedule fontSize="small" />
          <h2 className="text-lg font-semibold">When &amp; where</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <TextField
            label="Date Last Seen"
            name="observed_at"
            type="datetime-local"
            required
          />
          <TextField
            label="Last Seen Location"
            name="location_description"
            placeholder="e.g. Central Park, NY"
            required
          />
        </div>

        <div className="mt-2">
          <p className="mb-2 text-sm text-accent">Pin the exact spot</p>
          <MapPicker value={coords} onChange={handleCoordsChange} />
          {locationError && (
            <p
              role="alert"
              className="mt-2 rounded-lg bg-error/10 px-3 py-2 text-sm text-error"
            >
              {locationError}
            </p>
          )}
        </div>
      </section>

      {/* ---------- Details ---------- */}
      <section className="post-section mt-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-5 flex items-center gap-2 text-secondary">
          <ImageIcon fontSize="small" />
          <h2 className="text-lg font-semibold">Photo &amp; description</h2>
        </div>

        <TextField
          label="Photo URL"
          name="image_url"
          placeholder="Paste an image link from the web"
          required
        />

        <div className="grid items-start w-full pb-3">
          <label className="text-accent" htmlFor="description-field">
            Description
          </label>
          <textarea
            id="description-field"
            name="description"
            rows={4}
            className="w-full rounded-lg p-2 bg-neutral-200 border border-neutral-300 focus:ring-1 focus:ring-primary outline-none placeholder:text-neutral-400 transition-colors"
            placeholder="Any distinguishing marks, collar color, etc."
            required
          ></textarea>
        </div>
      </section>

      {(fieldErrors.length > 0 || error) && (
        <div className="mt-4 space-y-2" role="alert">
          {fieldErrors.map((message) => (
            <p
              key={message}
              className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error"
            >
              {message}
            </p>
          ))}
          {error && (
            <p className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
              {error}
            </p>
          )}
        </div>
      )}

      <div className="post-section mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 sm:w-auto"
        >
          Submit report
        </Button>
      </div>
    </form>
  );
}
export default PostPetForm;
