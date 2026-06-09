import { useEffect } from "react";

/**
 * Replicates the scroll-reveal + counter animations from the original main.js,
 * but driven by React. Re-runs whenever `deps` change (e.g. after async data
 * has rendered) so freshly-mounted elements get observed.
 */
export function usePageEffects(deps = []) {
  useEffect(() => {
    // --- Scroll reveal ---
    const revealEls = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right"
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = e.target.dataset.delay || 0;
            setTimeout(() => e.target.classList.add("visible"), delay);
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    // --- Counters ---
    const counters = document.querySelectorAll(".counter");
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const target = +e.target.dataset.target;
          const suffix = e.target.dataset.suffix || "";
          const step = target / (1800 / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            e.target.textContent = Math.floor(current) + suffix;
          }, 16);
          countObserver.unobserve(e.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => countObserver.observe(c));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
