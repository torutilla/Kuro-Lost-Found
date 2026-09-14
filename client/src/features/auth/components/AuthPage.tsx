import BrandLogo from "@shared/components/common/BrandLogo.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";

type AuthPageProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  variant: "login" | "signup";
};

const highlights = [
  "Report a lost pet in under a minute",
  "Live map of sightings near you",
  "Direct messages when there's a match",
];

/**
 * Auth shell split into two panels: a branded editorial panel that always
 * carries the product story, and a focused form panel. The brand panel is
 * hidden on small screens so the form keeps the full viewport.
 */
function AuthPage({ title, subtitle, children, variant }: AuthPageProps) {
  const ref = useGsapContext<HTMLElement>(
    ({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".auth-aside", { xPercent: -8, duration: 0.9 })
        .from(
          ".auth-aside .aside-item",
          { y: 22, opacity: 0, duration: 0.6, stagger: 0.09 },
          "-=0.6",
        )
        .from(
          ".auth-card",
          { y: 34, opacity: 0, scale: 0.98, duration: 0.75 },
          "-=0.85",
        )
        .from(
          ".auth-card > *",
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 },
          "-=0.5",
        );
    },
    [variant],
  );

  return (
    <main ref={ref} className="auth-page bg-white">
      <aside className="auth-aside grain relative hidden flex-1 overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-6rem] bottom-[-4rem] h-96 w-96 rounded-full bg-black/20 blur-3xl" />

        <div className="aside-item relative z-1">
          <BrandLogo size="lg" showWordmark />
        </div>

        <div className="relative z-1 max-w-md">
          <p className="aside-item mb-3 font-sans text-xs font-medium tracking-[0.35em] text-white/50 uppercase">
            Reuniting pets &amp; people
          </p>
          <h2 className="aside-item text-5xl leading-[1.05] font-semibold text-white">
            Every sighting brings them
            <em className="text-white/70"> home.</em>
          </h2>
          <p className="aside-item mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Kuro connects neighbours, shelters and owners so lost pets are
            found faster — together.
          </p>

          <ul className="mt-10 flex flex-col gap-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="aside-item flex items-center gap-3 text-sm text-white/70"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="aside-item relative z-1 text-xs text-white/40">
          © {new Date().getFullYear()} Kuro. Built for the community.
        </p>
      </aside>

      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div
          className={`auth-card ${variant} relative overflow-hidden bg-white`}
        >
          <div className="card-item grid gap-1.5 text-center">
            <h1 className="text-3xl font-semibold text-secondary">{title}</h1>
            <p className="text-sm text-accent">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthPage;

