import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "@shared/components/common/BrandLogo.tsx";
import Button from "@shared/components/common/Button.tsx";
import Image from "@shared/components/common/SkeletonImg.tsx";
import PetBadge from "@features/home/components/common/PetBadge.tsx";
import { useGsapContext } from "@shared/hooks/useGsap.tsx";
import { ArrowForward, LocationOn, Search } from "@mui/icons-material";
import sample from "@assets/sample.jpg";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "12k+", label: "Pets reported" },
  { value: "8.4k", label: "Reunited" },
  { value: "120", label: "Cities covered" },
];

const steps = [
  {
    index: "01",
    title: "Report in a minute",
    body: "Describe the pet, drop a pin on the last known location, and publish instantly.",
  },
  {
    index: "02",
    title: "Neighbours get alerted",
    body: "Sightings appear live on the map and ping everyone searching nearby.",
  },
  {
    index: "03",
    title: "Reunite",
    body: "Message the finder directly and bring them home — no middlemen, no fees.",
  },
];

/**
 * Public landing page. Dark editorial hero with a live "sighting card",
 * followed by a light feature section and closing call to action.
 */
function Hero() {
  const ref = useGsapContext<HTMLDivElement>(({ gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-nav", { y: -24, opacity: 0, duration: 0.6 })
      .from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.55 }, "-=0.3")
      .from(
        ".hero-line > span",
        { yPercent: 110, duration: 0.9, stagger: 0.12, ease: "power4.out" },
        "-=0.35",
      )
      .from(".hero-copy", { y: 20, opacity: 0, duration: 0.6 }, "-=0.6")
      .from(
        ".hero-cta",
        { y: 18, opacity: 0, duration: 0.5, stagger: 0.08 },
        "-=0.45",
      )
      .from(
        ".hero-stat",
        { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
        "-=0.35",
      )
      .from(
        ".hero-card",
        { y: 44, opacity: 0, scale: 0.96, duration: 0.9 },
        "-=0.95",
      )
      .from(
        ".hero-float",
        { opacity: 0, y: 14, duration: 0.5, stagger: 0.12 },
        "-=0.5",
      );

    // Gentle idle float on the floating chips, started after the entrance
    // timeline finishes so the two tweens never fight over `y`.
    gsap.to(".hero-float", {
      y: -8,
      duration: 2.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.4,
      delay: tl.duration() - 0.4,
    });

    // Scroll-triggered reveals for everything below the fold. Each element
    // gets its own trigger with `once: true` so a reveal can never get
    // "stuck" halfway or fail to fire.
    const fromScroll = (selector: string, y = 40, start = "top 88%") =>
      gsap.utils.toArray<HTMLElement>(selector).forEach((el, i) => {
        gsap.fromTo(
          el,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });

    fromScroll(".steps-head", 34, "top 85%");
    fromScroll(".step-card", 48);
    fromScroll(".cta-band", 40, "top 85%");
  }, []);

  useEffect(() => {
    document.title = "Kuro — Reunite lost pets, together";
    return () => {
      document.title = "Kuro — Reunite lost pets";
    };
  }, []);

  // Trigger positions are measured when the page mounts — before fonts and
  // the hero image finish loading. Re-measuring on `load` keeps the scroll
  // reveals from ending up stuck below the maximum scroll amount.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <div ref={ref} className="flex flex-col bg-white">
      {/* ================= HERO ================= */}
      <section className="grain relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary px-6 pb-24 pt-6 text-white lg:px-12">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
        <nav className="hero-nav relative z-2 mx-auto flex max-w-7xl items-center justify-between py-4">
          <BrandLogo size="md" showWordmark />
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/login"
              className="link-underline rounded-lg px-4 py-2 text-white/80 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button
                variant="solid"
                className="border border-white/15 bg-white/10 px-5 text-white shadow-none backdrop-blur-sm hover:bg-white/20"
              >
                Get started
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-2 mx-auto mt-16 grid max-w-7xl items-center gap-16 lg:mt-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="hero-eyebrow mb-6 w-fit rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-white/60 uppercase backdrop-blur-sm">
              Community pet recovery
            </p>

            <h1 className="text-[clamp(2.6rem,7vw,4.6rem)] leading-[0.98] font-semibold">
              <span className="reveal-line">
                <span className="block">Lost pets find</span>
              </span>
              <span className="reveal-line">
                <span className="block text-white/55 italic">their way</span>
              </span>
              <span className="reveal-line">
                <span className="block">
                  home <span className="text-amber-300">— faster</span>
                </span>
              </span>
            </h1>

            <p className="hero-copy mt-7 max-w-lg text-base leading-relaxed text-white/60">
              Kuro turns your neighbourhood into a search party. Report a
              missing pet, watch sightings land on a live map, and message the
              person who found them.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="hero-cta">
                <Button className="group gap-2 bg-white px-6 py-3 text-secondary hover:bg-white/90">
                  <Search fontSize="small" />
                  Report a lost pet
                  <ArrowForward
                    fontSize="small"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              <Link to="/login" className="hero-cta">
                <Button
                  variant="outline"
                  className="border-white/25 px-6 py-3 text-white hover:bg-white/10"
                >
                  <LocationOn fontSize="small" />
                  Browse the map
                </Button>
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <p className="font-display text-3xl font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs tracking-wider text-white/45 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <SightingCard />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <div className="steps-head flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-secondary lg:text-5xl">
              Three steps, one happy ending
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
            No paperwork, no waiting rooms. Just neighbours helping neighbours
            get their companions back where they belong.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.index}
              className="step-card group relative overflow-hidden rounded-3xl border border-neutral-200 bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
            >
              <span className="font-display text-6xl font-semibold text-neutral-200 transition-colors duration-500 group-hover:text-primary/25">
                {step.index}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-secondary">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {step.body}
              </p>
              <span className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-primary/0 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
            </article>
          ))}
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="cta-band mx-6 mb-16 lg:mx-12">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-secondary px-8 py-16 text-center lg:px-16">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative z-1 mx-auto max-w-2xl text-3xl font-semibold text-white lg:text-5xl">
            Someone out there already knows where they are.
          </h2>
          <p className="relative z-1 mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60">
            Join Kuro and put the whole neighbourhood on the search.
          </p>
          <div className="relative z-1 mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/signup">
              <Button className="group gap-2 bg-white px-7 py-3 text-secondary hover:bg-white/90">
                Create your account
                <ArrowForward
                  fontSize="small"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-white/25 px-7 py-3 text-white hover:bg-white/10"
              >
                I already have one
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-2 pb-12 text-center text-xs text-neutral-400">
        <span className="font-display text-base font-semibold text-secondary">
          Kuro
        </span>
        <p>Built with care for the ones who can't ask for help.</p>
      </footer>
    </div>
  );
}

/**
 * Floating "live sighting" card used in the hero. Extracted so the layout
 * code above stays readable.
 */
function SightingCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="hero-card relative rotate-1 rounded-3xl border border-white/15 bg-white/8 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-500 hover:rotate-0">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={sample}
            alt="Lost pet"
            className="aspect-4/3 w-full object-cover"
          />
        </div>

        <div className="flex items-start justify-between gap-3 px-2 pt-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">
              Mochi
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
              <LocationOn sx={{ fontSize: 14 }} />
              Riverside Park · 2 km away
            </p>
          </div>
          <PetBadge status="lost" />
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 px-1 pb-1">
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5">
            <p className="text-[0.7rem] tracking-wider text-white/40 uppercase">
              Sighted
            </p>
            <p className="text-sm font-medium text-white">18 minutes ago</p>
          </div>
          <Button className="px-5">Message</Button>
        </div>
      </div>

      <div className="hero-float absolute -left-6 top-10 hidden items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md sm:flex">
        <span className="pulse-ring relative grid h-2.5 w-2.5 place-items-center rounded-full text-red-400">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        </span>
        <div>
          <p className="text-xs font-semibold text-white">New sighting</p>
          <p className="text-[0.65rem] text-white/50">0.8 km from you</p>
        </div>
      </div>

      <div className="hero-float absolute -right-4 bottom-16 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md sm:block">
        <p className="font-display text-2xl font-semibold text-success">
          Reunited
        </p>
        <p className="text-[0.65rem] text-white/50">Buddy &amp; Ana · today</p>
      </div>
    </div>
  );
}

export default Hero;
