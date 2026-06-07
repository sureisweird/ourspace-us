/**
 * Task 3.4 — Structural assertions for AmbientPetals.
 *
 * Spec: flower-animation-performance (Requirements 1.3, 6.1, 6.2)
 *
 * This is a DEV-ONLY structural regression test (Vitest + Testing Library,
 * devDependencies only — no runtime/bundle impact, AGENTS.md §9). It guards
 * the per-instance petal contract of `AmbientPetals` against accidental
 * change during the performance optimization:
 *
 *   - Each instance renders exactly 18 `.ambient-particle` elements
 *     (Req 1.3 — petal count preserved per instance).
 *   - Every petal `<img>` carries `decoding="async"` (Req 6.1 — async decode
 *     so petal decoding never blocks the main thread).
 *   - Every petal `<img>` carries the `decor-paint` class (Req 6.2 — the
 *     shared GPU-paint optimization hook is applied to every petal).
 *
 * Async petals: `AmbientPetals` generates its 18 petals in a side effect and
 * commits them via `setState` inside a `setTimeout(0)` in `useEffect`, so the
 * petals are NOT present on first render. We `findBy`/`waitFor` the petals to
 * mount before asserting.
 *
 * GSAP: `useGSAP`/`gsap`/`ScrollTrigger` are mocked to no-ops so the component
 * renders in jsdom (which has no layout engine) without animation errors. The
 * decorative `<img>` elements render independently of GSAP, so the structure
 * is unaffected.
 */
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// --- GSAP: render-only, no animation in jsdom ---
vi.mock("@gsap/react", () => ({
  useGSAP: () => {},
}));

vi.mock("gsap", () => {
  const tween = { pause: vi.fn(), resume: vi.fn(), kill: vi.fn() };
  const gsap = {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(() => tween),
    fromTo: vi.fn(() => tween),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      play: vi.fn(),
      add: vi.fn().mockReturnThis(),
    })),
    matchMedia: vi.fn(() => ({ add: vi.fn() })),
    utils: {
      toArray: <T,>(): T[] => [],
      random: () => 0,
    },
  };
  return { default: gsap, gsap };
});

vi.mock("gsap/ScrollTrigger", () => {
  const ScrollTrigger = {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
    killAll: vi.fn(),
  };
  return { ScrollTrigger, default: ScrollTrigger };
});

import AmbientPetals from "@/components/AmbientPetals";

const PETALS_PER_INSTANCE = 18;

function ambientPetals(): HTMLImageElement[] {
  return Array.from(
    document.querySelectorAll<HTMLImageElement>("img.ambient-particle")
  );
}

describe("AmbientPetals structural contract", () => {
  it("renders exactly 18 .ambient-particle elements per instance", async () => {
    render(<AmbientPetals />);

    // Petals mount asynchronously (setTimeout(0) in useEffect).
    await waitFor(() => {
      expect(
        document.querySelectorAll(".ambient-particle")
      ).toHaveLength(PETALS_PER_INSTANCE);
    });
  });

  it("renders petal <img> elements with decoding=\"async\" and the decor-paint class", async () => {
    render(<AmbientPetals />);

    await waitFor(() => {
      expect(ambientPetals()).toHaveLength(PETALS_PER_INSTANCE);
    });

    const petals = ambientPetals();
    expect(petals).toHaveLength(PETALS_PER_INSTANCE);

    for (const petal of petals) {
      expect(petal.getAttribute("decoding")).toBe("async");
      expect(petal.classList.contains("decor-paint")).toBe(true);
    }
  });
});
