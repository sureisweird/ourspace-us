/**
 * Task 9.2 — Asset-count preservation assertion for the main stage.
 *
 * Spec: flower-animation-performance (Requirements 1.1, 1.2)
 *
 * This is a DEV-ONLY structural regression test (Vitest + Testing Library,
 * devDependencies only — no runtime/bundle impact, AGENTS.md §9). It guards
 * the four-pillar performance optimization against accidentally removing any
 * decorative flower asset: the optimization must keep the DOM byte-identical,
 * so the total count of decorative `<img>` elements on the main stage must
 * stay equal to the pre-optimization baseline (`Asset_Baseline_Count`).
 *
 * A `Decorative_Asset` is a flower/petal/leaf/stamen `<img>` whose `src`
 * points at `/assets/hibiscus_flower/` (these are the `aria-hidden`,
 * `pointer-events-none`, `alt=""` decorative images). We count by `src`
 * rather than by class so the assertion is robust to styling changes.
 *
 * Reaching the main stage: `Home` starts at the "pin" stage and only renders
 * the main content after PIN unlock + gift open. We drive it to "main" by
 * mocking `PinGate` and `GiftBoxHero` (both explicitly out of scope for the
 * decorative-asset count — `GiftBoxHero` is preserved untouched and its
 * explosion/wash petals are NOT part of `Asset_Baseline_Count`) so they
 * immediately fire their completion callbacks. This renders the REAL inline
 * header/hero/footer decor plus the real `FloralDecor`, `MemoryLane`,
 * `SplitContent`, `MusicLetterFooter`, and three `AmbientPetals` instances.
 *
 * Async petals: each `AmbientPetals` instance mounts its 18 petals
 * asynchronously (setState inside a `setTimeout(0)` in `useEffect`). We
 * `waitFor` the petal count to reach the expected total (3 × 18 = 54) before
 * asserting, so the measured baseline includes them deterministically.
 *
 * GSAP: `useGSAP`/`gsap`/`ScrollTrigger` are mocked to no-ops so the
 * components render in jsdom (which has no layout engine) without animation
 * errors. The decorative `<img>` elements render independently of GSAP, so
 * the count is unaffected.
 */
import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    return <img src={src} alt={alt} {...rest} />;
  },
}));

vi.mock("@/components/PinGate", () => ({
  default: function MockPinGate({ onUnlocked }: { onUnlocked: () => void }) {
    useEffect(() => {
      onUnlocked();
    }, [onUnlocked]);
    return null;
  },
}));

vi.mock("@/components/GiftBoxHero", () => ({
  default: function MockGiftBoxHero({
    onOpenComplete,
    onTransitionComplete,
  }: {
    onOpenComplete: () => void;
    onTransitionComplete: () => void;
    isTransitioning: boolean;
  }) {
    useEffect(() => {
      onOpenComplete();
      onTransitionComplete();
    }, [onOpenComplete, onTransitionComplete]);
    return null;
  },
}));

import Home from "@/app/page";
import { CONFIG_PAGE } from "@/config/textConfig";

const HIBISCUS = "/assets/hibiscus_flower/";
const PETALS_PER_INSTANCE = 18;
const AMBIENT_INSTANCES = 3; // page + MemoryLane + SplitContent
const EXPECTED_AMBIENT_PETALS = PETALS_PER_INSTANCE * AMBIENT_INSTANCES; // 54
const ASSET_BASELINE_COUNT = 213;

function decorativeImgs(): HTMLImageElement[] {
  return Array.from(
    document.querySelectorAll<HTMLImageElement>("img")
  ).filter((img) => (img.getAttribute("src") ?? "").includes(HIBISCUS));
}

function ambientPetals(): Element[] {
  return Array.from(document.querySelectorAll(".ambient-particle"));
}

describe("main stage decorative asset count (Asset_Baseline_Count)", () => {
  it("renders exactly the baseline number of decorative flower <img> elements", async () => {
    render(<Home />);
    await screen.findByText(CONFIG_PAGE.brandName);
    await waitFor(() => {
      expect(ambientPetals()).toHaveLength(EXPECTED_AMBIENT_PETALS);
    });

    const total = decorativeImgs().length;

    // Helpful breakdown if the count ever drifts.
    console.log(
      `[asset-count] total decorative <img>=${total}, ` +
        `ambient petals=${ambientPetals().length}, ` +
        `static (non-petal)=${total - ambientPetals().length}`
    );

    expect(total).toBe(ASSET_BASELINE_COUNT);
  });
});
