// Vitest global setup for the dev-only structural regression tests
// (flower-animation-performance spec). Adds jest-dom matchers and the
// browser API polyfills jsdom lacks but the components rely on
// (matchMedia, IntersectionObserver, ResizeObserver). Shared by all
// sibling test tasks (2.3, 3.4, 9.1, 9.2).
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees between tests to keep counts isolated.
afterEach(() => {
  cleanup();
});

// jsdom has no matchMedia. Components query
// "(prefers-reduced-motion: reduce)"; default to "no preference"
// (matches: false) so the normal animated branches render.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList;
}

// jsdom has no IntersectionObserver (used by LoveLetter typing effect).
if (!window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

// jsdom has no ResizeObserver.
if (!window.ResizeObserver) {
  class MockResizeObserver implements ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  window.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
}
