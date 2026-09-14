import { useGsapContext } from "@shared/hooks/useGsap.tsx";

type BrandProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const sizeMap = {
  sm: "h-7 w-7 text-sm",
  md: "h-9 w-9 text-base",
  lg: "h-14 w-14 text-2xl",
} as const;

/**
 * The Kuro mark: a paw print inside a rounded tile.
 * On mount the paw springs in and the ring draws itself, giving the
 * brand a small signature moment on every page.
 */
function BrandLogo({
  size = "md",
  showWordmark = false,
  className = "",
}: BrandProps) {
  const ref = useGsapContext<HTMLDivElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".brand-tile", { scale: 0.7, rotate: -12, duration: 0.6 })
      .from(".brand-ring", { opacity: 0, scale: 0.6, duration: 0.5 }, "-=0.35")
      .from(
        ".brand-toe",
        { y: 6, opacity: 0, duration: 0.4, stagger: 0.05 },
        "-=0.4",
      );
    if (showWordmark) {
      tl.from(".brand-word", { y: 10, opacity: 0, duration: 0.5 }, "-=0.3");
    }
  }, [showWordmark]);

  return (
    <div ref={ref} className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`brand-tile relative grid place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 ${sizeMap[size]}`}
      >
        <span className="brand-ring absolute inset-0 rounded-2xl ring-1 ring-white/25" />
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[62%] w-[62%]"
          aria-hidden="true"
        >
          <ellipse className="brand-toe" cx="7" cy="8" rx="2.2" ry="2.8" />
          <ellipse className="brand-toe" cx="17" cy="8" rx="2.2" ry="2.8" />
          <ellipse className="brand-toe" cx="11" cy="5" rx="2" ry="2.5" />
          <ellipse className="brand-toe" cx="15.4" cy="12.2" rx="1.9" ry="2.2" />
          <ellipse className="brand-toe" cx="8.6" cy="12.2" rx="1.9" ry="2.2" />
          <path
            className="brand-pad"
            d="M12 11c3.4 0 6 2.3 6 5.2 0 2-1.6 3.3-3.6 2.7-1.6-.5-3.2-.5-4.8 0C7.6 19.5 6 18.2 6 16.2 6 13.3 8.6 11 12 11Z"
          />
        </svg>
      </div>
      {showWordmark && (
        <span className="brand-word font-display text-xl font-semibold tracking-tight text-white">
          Kuro
        </span>
      )}
    </div>
  );
}

export default BrandLogo;
