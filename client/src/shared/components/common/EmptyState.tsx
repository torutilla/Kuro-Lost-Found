import type { SvgIconComponent } from "@mui/icons-material";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { cn } from "@shared/index.ts";

type EmptyStateProps = {
  icon: SvgIconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/**
 * Consistent "nothing here yet" panel used by the quieter routes so the app
 * never shows a blank screen. The icon springs in on mount.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const ref = useGsapContext<HTMLDivElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".empty-icon", { scale: 0.6, opacity: 0, duration: 0.6 })
      .from(".empty-ring", { scale: 0.5, opacity: 0, duration: 0.6 }, "-=0.45")
      .from(
        ".empty-text > *",
        { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
        "-=0.4",
      );
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="relative mb-6 grid h-20 w-20 place-items-center">
        <span className="empty-ring absolute inset-0 rounded-full bg-primary/10" />
        <span className="empty-icon relative grid h-16 w-16 place-items-center rounded-full bg-white text-primary shadow-sm ring-1 ring-primary/10">
          <Icon fontSize="inherit" sx={{ fontSize: 30 }} />
        </span>
      </div>

      <div className="empty-text flex max-w-sm flex-col items-center">
        <h2 className="text-2xl font-semibold text-secondary">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
