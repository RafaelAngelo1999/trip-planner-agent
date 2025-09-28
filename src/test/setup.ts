import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock global ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock LangGraph SDK
vi.mock("@langchain/langgraph-sdk/react-ui", () => ({
  useStreamContext: vi.fn(() => ({
    values: { language: "pt" },
    submit: vi.fn(),
  })),
}));

// Mock hooks globalmente
vi.mock("./hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    language: "pt",
  })),
  extractLanguageFromContext: vi.fn(() => "pt"),
}));

vi.mock("./hooks", () => ({
  useFlightLookup: vi.fn(() => null),
  useDateFormatting: vi.fn(() => ({
    formatDateTime: (date: string) => new Date(date).toLocaleString(),
    formatDate: (date: string) => new Date(date).toLocaleDateString(),
  })),
}));

// Mock CSS modules
vi.mock("./**/*.css", () => ({}));
vi.mock("./**/*.scss", () => ({}));
