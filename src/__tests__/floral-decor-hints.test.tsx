/**
 * Task 2.3 — Structural regression assertions for FloralDecor paint hints.
 *
 * Spec: flower-animation-performance (Requirements 1.4, 4.1, 6.1, 6.3)
 *
 * This is a DEV-ONLY structural regression test (Vitest + Testing Library,
 * devDependencies only — no runtime/bundle impact, AGENTS.md §9). It guards the
 * paint-hint optimization of the decorative floral layer:
 *
 *  - The DOM shape must stay byte-identical: `FloralDecor` renders four
 *    `CornerSpray` compositions, each containing exactly six `DecorImage`
 *    (`<img>`) children — leaf_2, leaf_1, leaf_3, flower_medium_1,
 *    flower_medium_2, petal_3. (Req 1.4 — no asset removed.)
 *  - Every decorative `<img>` carries `decoding="async"` and the shared
 *    `decor-paint` class, so paint hints live in CSS, not per-element inline
 *    styles. (Req 4.1, 6.1.)
 *  - No decorative `<img>` carries inline `will-change` / `backface-visibility`;
 *    those promotion hints must not be applied per-element. (Req 6.3.)
 *
 * `CornerSpray` instances are identified by their root container's `aspect-5/6`
 * class (the `<div className="relative aspect-5/6 ...">` wrapper). FloralDecor
 * imports only React state and renders plain <img> elements, but GSAP is mocked
 * to no-ops to match the established test convention and stay robust to future
 * imports.
 */
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// --- GSAP: render-only, no animation in jsdom (convention; FloralDecor is static) ---
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

import FloralDecor from "@/components/FloralDecor";

const CORNER_SPRAY_COUNT = 4;
const DECOR_IMAGES_PER_SPRAY = 6;

/** `CornerSpray` roots are the `<div className="relative aspect-5/6 ...">` wrappers. */
function cornerSprays(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("div")).filter(
    (el) => el.classList.contains("aspect-5/6")
  );
}

function decorativeImgs(): HTMLImageElement[] {
  return Array.from(document.querySelectorAll<HTMLImageElement>("img"));
}

describe("FloralDecor structural paint-hint regression", () => {
  it("renders four CornerSpray compositions, each with exactly six DecorImage children", () => {
    render(<FloralDecor />);

    const sprays = cornerSprays();
    expect(sprays).toHaveLength(CORNER_SPRAY_COUNT);

    for (const spray of sprays) {
      const imgs = spray.querySelectorAll("img");
      expect(imgs).toHaveLength(DECOR_IMAGES_PER_SPRAY);
    }
  });

  it("gives every decorative <img> decoding=\"async\" and the decor-paint class", () => {
    render(<FloralDecor />);

    const imgs = decorativeImgs();
    // 4 sprays × 6 + 3 floating accents = 27 decorative images.
    expect(imgs.length).toBe(CORNER_SPRAY_COUNT * DECOR_IMAGES_PER_SPRAY + 3);

    for (const img of imgs) {
      expect(img.getAttribute("decoding")).toBe("async");
      expect(img.classList.contains("decor-paint")).toBe(true);
    }
  });

  it("does not apply inline will-change or backface-visibility to any decorative <img>", () => {
    render(<FloralDecor />);

    for (const img of decorativeImgs()) {
      expect(img.style.willChange).toBe("");
      expect(img.style.backfaceVisibility).toBe("");

      const inlineStyle = (img.getAttribute("style") ?? "").toLowerCase();
      expect(inlineStyle).not.toContain("will-change");
      expect(inlineStyle).not.toContain("backface-visibility");
    }
  });
});
