import PetGrid from "./PetGrid.tsx";
import type { Pet } from "../../schema/petSchema.ts";
import Button from "@shared/components/common/Button.tsx";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import { useState } from "react";
import { cn } from "@shared/index.ts";

type PetDrawerProps = {
  pets: Pet[];
};

/**
 * Slide-in sheet listing every pet currently on the map.
 * On desktop it tucks against the right edge with a handle tab;
 * on mobile it covers the map and can be dismissed with a scrim.
 */
function PetDrawer({ pets }: PetDrawerProps) {
  const [isOpen, setOpen] = useState(false);
  const onButtonClick = () => setOpen((o) => !o);

  return (
    <>
      {/* Scrim — mobile only, and only while the sheet is open. */}
      <div
        onClick={onButtonClick}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-secondary/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          `fixed top-0 right-0 z-50 flex h-full w-full flex-col bg-white
          transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:w-[26rem] lg:shadow-2xl`,
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Toggle tab that peeks from the panel's edge on every breakpoint. On
        mobile the sheet starts fully off-screen to the right, so this tab —
        visible at the screen edge — is the way in; the header ✕ closes it. */}
        <button
          onClick={onButtonClick}
          aria-label={isOpen ? "Hide pet list" : "Show pet list"}
          className="absolute top-1/2 -left-9 block -translate-y-1/2 rounded-l-xl bg-primary p-3 text-white shadow-lg transition-transform duration-300 hover:-translate-x-0.5"
        >
          {isOpen ? (
            <ChevronRight fontSize="small" />
          ) : (
            <ChevronLeft fontSize="small" />
          )}
        </button>

        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-neutral-100 bg-white/95 p-4 backdrop-blur-sm">
          <div>
            <h2 className="font-display text-lg font-semibold text-secondary">
              Nearby pets
            </h2>
            <p className="text-xs text-neutral-400">
              {pets.length} report{pets.length === 1 ? "" : "s"} on the map
            </p>
          </div>
          <Button
            variant="outline"
            color="grayscale"
            className="p-1.5 lg:hidden"
            onClick={onButtonClick}
            aria-label="Close pet list"
          >
            <Close fontSize="small" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {pets.length === 0 ? (
            <p className="px-2 py-10 text-center text-sm text-neutral-400">
              No pet reports nearby yet.
            </p>
          ) : (
            <PetGrid pets={pets} />
          )}
        </div>
      </aside>
    </>
  );
}

export default PetDrawer;

