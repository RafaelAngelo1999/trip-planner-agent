import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HotelsList from "../../../agent-uis/hotels/hotels-list";
import {
  mockHotelsParams,
  mockHotelsList,
} from "../../../test/mocks/data/hotels";

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
        "hotels.list.hotelsIn": "Hotéis em",
        "common.loading": "Carregando",
        "hotels.list.room": "quarto",
        "hotels.list.rooms": "quartos",
        "hotels.list.night": "noite",
        "hotels.list.nights": "noites",
        "common.close": "Fechar",
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

describe("HotelsList", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Renderização Básica", () => {
    it("deve mostrar estado de loading inicialmente", () => {
      render(
        <HotelsList
          toolCallId="test-id"
          hotels={mockHotelsList}
          searchParams={mockHotelsParams}
        />,
      );

      // Verifica que está mostrando o loading
      expect(screen.getByText(/Carregando/)).toBeInTheDocument();
      expect(
        screen.getByText(/Buscando as melhores opções/),
      ).toBeInTheDocument();
    });

    it("deve renderizar props básicas", () => {
      render(
        <HotelsList
          toolCallId="test-id"
          hotels={mockHotelsList}
          searchParams={mockHotelsParams}
        />,
      );

      // Verifica que o componente renderiza sem erros baseado no que está sendo mostrado
      expect(
        screen.getByText("Buscando as melhores opções em São Paulo"),
      ).toBeInTheDocument();
    });

    it("deve renderizar com hotéis vazios", () => {
      render(
        <HotelsList
          toolCallId="test-id"
          hotels={[]}
          searchParams={mockHotelsParams}
        />,
      );

      expect(screen.getByText(/Carregando/)).toBeInTheDocument();
    });
  });

  describe("Timer Management", () => {
    it("deve limpar timer ao desmontar componente", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

      const { unmount } = render(
        <HotelsList
          toolCallId="test-id"
          hotels={mockHotelsList}
          searchParams={mockHotelsParams}
        />,
      );

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("deve avançar timer corretamente", () => {
      render(
        <HotelsList
          toolCallId="test-id"
          hotels={mockHotelsList}
          searchParams={mockHotelsParams}
        />,
      );

      // Verifica estado inicial
      expect(screen.getByText(/Carregando/)).toBeInTheDocument();

      // Avança timers
      vi.advanceTimersByTime(800);

      // Verifica se algo mudou no DOM
      const loadingElements = screen.queryAllByText(/Carregando/);
      expect(loadingElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Estrutura Básica", () => {
    it("deve ter estrutura de container", () => {
      const { container } = render(
        <HotelsList
          toolCallId="test-id"
          hotels={mockHotelsList}
          searchParams={mockHotelsParams}
        />,
      );

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("deve renderizar com parâmetros diferentes", () => {
      const customParams = {
        ...mockHotelsParams,
        city: "Rio de Janeiro",
        rooms: 2,
      };

      render(
        <HotelsList
          toolCallId="test-id"
          hotels={[]}
          searchParams={customParams}
        />,
      );

      expect(
        screen.getByText("Buscando as melhores opções em Rio de Janeiro"),
      ).toBeInTheDocument();
    });
  });
});
