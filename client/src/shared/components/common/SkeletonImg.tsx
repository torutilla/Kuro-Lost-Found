import { useRef, type ImgHTMLAttributes, useState } from "react";
import { cn } from "@shared/index.ts";
import { BrokenImage as BrokenImageIcon } from "@mui/icons-material";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

/**
 * Image with a loading skeleton and a graceful placeholder when the source
 * (and any fallback) can't be loaded — instead of a broken-image glyph.
 */
export default function Image({
  src,
  fallback = "",
  className = "",
  ...props
}: ImageProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "broken">(
    "loading",
  );
  const usedFallback = useRef(false);

  return (
    // Stretch the wrapper to whatever container it sits in (`aspect-16/10`,
    // grid columns, etc.) so the absolute skeleton below always covers the
    // full image area — even before the <img> has dimensions to measure.
    <div className="relative h-full w-full overflow-hidden">
      {status !== "ready" && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 grid place-items-center",
            status === "loading"
              ? "animate-pulse bg-neutral-200"
              : "bg-gradient-to-br from-neutral-100 to-neutral-300",
          )}
        >
          {status === "broken" && (
            <div className="flex flex-col items-center gap-1.5 text-neutral-500">
              <BrokenImageIcon sx={{ fontSize: 28 }} />
              <span className="text-xs font-medium">No photo</span>
            </div>
          )}
        </div>
      )}
      <img
        {...props}
        src={src}
        className={cn(
          "transition-opacity duration-300",
          status === "ready" ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={() => setStatus("ready")}
        onError={(e) => {
          if (fallback && !usedFallback.current) {
            usedFallback.current = true;
            e.currentTarget.src = fallback;
            return;
          }
          setStatus("broken");
        }}
      />
    </div>
  );
}
