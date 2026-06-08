/**
 * Task 9.1 — Gating-application assertions.
 *
 * Spec: flower-animation-performance (Requirements 3.1, 7.4)
 *
 * This is a DEV-ONLY structural regression test (Vitest + Testing Library,
 * devDependencies only — no runtime/bundle impact, AGENTS.md §9). It guards
 * Pillar 1 (viewport gating) so the three long offscreen sections stay gated
 * and `GiftBoxHero` stays explicitly out of the gating scope.
 *
 * Positive (R3.1, R3.2): the `#memories` section, the `#milestones` section,
 * and the page `<footer>` must each carry the `cv-gate` utility class
 * (`content-visibility: auto`) and an inline `contain-intrinsic-size` style
 * (rendered from React's `containIntrinsicSize` style key) so scroll position
 * and scrollbar length stay stable while the section is offscreen.
 *
 * Negative (R7.4): `GiftBoxHero` and its descendants must NOT be gated — no
 * element inside the rendered `GiftBoxHero` tree may carry `cv-gate`.
 *
 * Reaching the main stage: `Home` starts at the "pin" stage and only renders
 * the main content after PIN unlock + gift open. We drive it to "main" by
 * mocking `PinGate` and `GiftBoxHero` so they immediately fire their
 * completion callbacks (same pattern as main-stage-asset-count.test.tsx).
 * Because the main-stage render mocks `GiftBoxHero` away, the negative
 * assertion renders the REAL `GiftBoxHero` separately via `vi.importActual`.
 *
 * GSAP: `useGSAP`/`gsap`/`ScrollTrigger` are mocked to no-ops so the
 * components render in jsdom (which has no layout engine) without animation
 * errors. The gating classes/styles render independently of GSAP.
 */
import { useEffect } from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

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

// --- next/image: passthrough <img> ---
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

// --- Stage drivers: skip PIN + gift to reach the main stage ---
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

/**
 * A Gated_Section must carry the `cv-gate` class AND an inline
 * `contain-intrinsic-size` style. React renders the `containIntrinsicSize`
 * style key as the `contain-intrinsic-size` CSS property. We check the
 * serialized `style` attribute first (robust across jsdom's CSS support) and
 * fall back to the parsed inline `style.containIntrinsicSize` property.
 */
function hasContainIntrinsicSize(el: Element): boolean {
  const styleAttr = el.getAttribute("style") ?? "";
  if (styleAttr.includes("contain-intrinsic-size")) return true;
  const inline = (el as HTMLElement).style as CSSStyleDeclaration & {
    containIntrinsicSize?: string;
  };
  return typeof inline.containIntrinsicSize === "string" &&
    inline.containIntrinsicSize.length > 0;
}

afterEach(() => {
  cleanup();
});

describe("gating application (Requirement 3.1, 3.2)", () => {
  it("gates #memories, #milestones, and the <footer> with cv-gate + contain-intrinsic-size", async () => {
    const { container } = render(<Home />);

    // The main stage is reached once PinGate/GiftBoxHero (mocked) complete.
    await screen.findByText(CONFIG_PAGE.brandName);

    const memories = await waitFor(() => {
      const el = container.querySelector("#memories");
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    const milestones = container.querySelector("#milestones");
    // Two <footer> elements exist: MusicLetterFooter (`#letter`) and the page
    // footer (no id). The Gated_Section is the page footer — the one that is
    // not the letter section.
    const footer = Array.from(container.querySelectorAll("footer")).find(
      (f) => f.id !== "letter"
    );

    expect(milestones).not.toBeNull();
    expect(footer).toBeDefined();

    // #memories
    expect(memories.classList.contains("cv-gate")).toBe(true);
    expect(hasContainIntrinsicSize(memories)).toBe(true);

    // #milestones
    expect((milestones as HTMLElement).classList.contains("cv-gate")).toBe(true);
    expect(hasContainIntrinsicSize(milestones as HTMLElement)).toBe(true);

    // <footer>
    expect((footer as HTMLElement).classList.contains("cv-gate")).toBe(true);
    expect(hasContainIntrinsicSize(footer as HTMLElement)).toBe(true);
  });
});

describe("gift transition is never gated (Requirement 7.4)", () => {
  it("renders no cv-gate element anywhere inside the real GiftBoxHero", async () => {
    // The main-stage render above mocks GiftBoxHero, so load the REAL one here.
    const actual = await vi.importActual<
      typeof import("@/components/GiftBoxHero")
    >("@/components/GiftBoxHero");
    const GiftBoxHero = actual.default;

    const audioRef = { current: null } as React.RefObject<HTMLAudioElement | null>;

    const { container } = render(
      <GiftBoxHero
        onOpenComplete={() => {}}
        onTransitionComplete={() => {}}
        isTransitioning={false}
        audioRef={audioRef}
      />
    );

    // Wait for the async petal mount (setTimeout(0) in useEffect) so the full
    // GiftBoxHero subtree is present before we assert.
    await waitFor(() => {
      expect(container.querySelectorAll(".petal-particle").length).toBeGreaterThan(0);
    });

    const gated = container.querySelectorAll(".cv-gate");
    expect(gated.length).toBe(0);
  });
});
