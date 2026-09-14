import TextField from "@shared/components/common/TextField.tsx";
import usePostPet from "../../hooks/usePostPet.tsx";
import { PetRequestSchema } from "../../schema/petSchema.ts";
import Button from "@shared/components/common/Button.tsx";
import MapPicker from "@features/map/components/MapPicker.tsx";
import { useState } from "react";
import type { LatLngTuple } from "leaflet";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { Pets, Schedule, Image as ImageIcon } from "@mui/icons-material";

const selectClass =
  "w-full rounded-lg p-2 bg-neutral-200 border border-neutral-300 focus:ring-1 focus:ring-primary outline-none transition-colors";

function PostPetForm({
  authUserId,
  onSuccess,
}: {
  authUserId: string;
  onSuccess?: (id: string) => void;
}) {
  const { postPet, loading, error } = usePostPet();
  const [coords, setCoords] = useState<LatLngTuple | null>(null);

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

    const formData = new FormData(e.currentTarget);

    const payload = {
      user_id: authUserId,
      name: formData.get("name"),
      type: formData.get("type"),
      breed: formData.get("breed") || undefined,
      color: formData.get("color"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
      status: formData.get("status"),
      last_seen_location: formData.get("last_seen_location"),
      location_point: coords
        ? {
            lat: coords[0],
            lng: coords[1],
          }
        : null,
      date_lost: new Date(formData.get("date_lost") as string).toISOString(),
    };

    const res = PetRequestSchema.safeParse(payload);

    if (!res.success) {
      console.log(res.error.issues);
      return;
    }

    try {
      const id = await postPet(res.data);
      onSuccess?.(id);
    } catch (error) {
      console.error(error);
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
            name="date_lost"
            type="datetime-local"
            required
          />
          <TextField
            label="Last Seen Location"
            name="last_seen_location"
            placeholder="e.g. Central Park, NY"
            required
          />
        </div>

        <div className="mt-2">
          <p className="mb-2 text-sm text-accent">Pin the exact spot</p>
          <MapPicker value={coords} onChange={setCoords} />
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

      {error && (
        <p className="mt-4 rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
          {error}
        </p>
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
