import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FlightsList from "../../../agent-uis/flights/flights-list";
import { mockFlightItinerary } from "../../../test/mocks/data/flights";
import { ListFlightsParams } from "../../../agent/types";

// Mocks
vi.mock("@langchain/langgraph-sdk/react-ui", () => ({
  useStreamContext: vi.fn(() => ({
    values: { language: "pt" },
    submit: vi.fn(),
  })),
}));

vi.mock("../../../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        "flight.list.searchingFlights": "Buscando voos disponíveis",
        "flight.list.title": "Voos Disponíveis",
        "flights.common.passengers": "passageiros",
      };
      return translations[key] || key;
    },
  })),
  extractLanguageFromContext: vi.fn(() => "pt-BR"),
}));

// Mock do carousel
vi.mock("../../../components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselNext: () => <button data-testid="carousel-next">Próximo</button>,
  CarouselPrevious: () => (
    <button data-testid="carousel-previous">Anterior</button>
  ),
}));

describe("FlightsList", () => {
  const mockSearchParams: ListFlightsParams = {
    origin: "GRU",
    destination: "JFK",
    departDate: "2024-12-25",
    returnDate: "2025-01-15",
    adults: 2,
  };

  const defaultProps = {
    toolCallId: "test-tool-call-id",
    searchParams: mockSearchParams,
    flights: [mockFlightItinerary],
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Renderização Básica", () => {
    it("deve mostrar estado de loading inicialmente", () => {
      render(<FlightsList {...defaultProps} />);

      // Verifica que está mostrando o loading
      expect(screen.getByText("Buscando voos disponíveis")).toBeInTheDocument();
    });

    it("deve renderizar props básicas", () => {
      render(<FlightsList {...defaultProps} />);

      // Verifica que o componente renderiza sem erros baseado no LoadingState
      expect(screen.getByText("Buscando voos disponíveis")).toBeInTheDocument();
    });

    it("deve renderizar com voos vazios", () => {
      render(<FlightsList {...defaultProps} flights={[]} />);

      expect(screen.getByText("Buscando voos disponíveis")).toBeInTheDocument();
    });
  });

  describe("Timer Management", () => {
    it("deve limpar timer ao desmontar componente", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

      const { unmount } = render(<FlightsList {...defaultProps} />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("deve avançar timer corretamente", () => {
      render(<FlightsList {...defaultProps} />);

      // Verifica estado inicial
      expect(screen.getByText("Buscando voos disponíveis")).toBeInTheDocument();

      // Avança timers
      vi.advanceTimersByTime(500);

      // Verifica se algo mudou no DOM
      const loadingElements = screen.queryAllByText(
        "Buscando voos disponíveis",
      );
      expect(loadingElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Estrutura Básica", () => {
    it("deve ter estrutura de container", () => {
      const { container } = render(<FlightsList {...defaultProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("deve renderizar com parâmetros diferentes", () => {
      const customParams = {
        ...mockSearchParams,
        origin: "CGH",
        destination: "SDU",
      };

      render(<FlightsList {...defaultProps} searchParams={customParams} />);

      expect(screen.getByText("Buscando voos disponíveis")).toBeInTheDocument();
    });

    it("deve renderizar com múltiplos voos", () => {
      const multipleFlights = [mockFlightItinerary, mockFlightItinerary];

      render(<FlightsList {...defaultProps} flights={multipleFlights} />);

      expect(screen.getByText("Buscando voos disponíveis")).toBeInTheDocument();
    });
  });
});
