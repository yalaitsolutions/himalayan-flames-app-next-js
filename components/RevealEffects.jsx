"use client";
import { useEffect } from "react";

/**
 * Drop-in client component that powers the scroll-reveal animations
 * and the animated stat counters (ported from the original
 * usePageEffects hook / main.js). Renders nothing.
 *
 * Place it once near the bottom of any page that uses `.reveal`,
 * `.reveal-left`, `.reveal-right`, or `.counter` elements.
 */
export default function RevealEffects() {
  useEffect(() => {
    // --- Scroll reveal ---
    const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
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
  }, []);

  return null;
}
