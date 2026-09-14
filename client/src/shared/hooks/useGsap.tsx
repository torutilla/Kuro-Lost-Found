import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

/**
 * Shared entrance animation used across the app.
 * Elements marked with `data-reveal` are hidden via CSS until they
 * are tweened in, which prevents a flash of un-animated content.
 */
export function revealIn(
  targets: gsap.TweenTarget,
  options: gsap.TweenVars = {},
  stagger = 0.08,
) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger,
      clearProps: "transform",
      ...options,
    },
  );
}

/**
 * Scopes GSAP animations to a single element and reverts every tween
 * on unmount, which keeps animations StrictMode-safe. Animation code is
 * skipped entirely when the user prefers reduced motion; in that case any
 * `[data-reveal]` element (including the root itself) is simply shown.
 *
 * @example
 * const ref = useGsapContext<HTMLDivElement>(({ gsap, root }) => {
 *   revealIn(root.querySelectorAll("[data-reveal]"));
 * });
 * return <div ref={ref}>…</div>;
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  factory: (context: { gsap: typeof gsap; root: T }) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const root = useRef<T>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (reducedMotion) {
        const reveals = element.matches("[data-reveal]")
          ? [element, ...element.querySelectorAll<HTMLElement>("[data-reveal]")]
          : element.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.set(reveals, { opacity: 1, clearProps: "transform" });
        return;
      }
      factory({ gsap, root: element });
    }, element);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}

export default useGsapContext;

