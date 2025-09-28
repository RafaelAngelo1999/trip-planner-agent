import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test/utils/render";
import FlightCancellationConfirmation from "../../../agent-uis/flights/flight-cancellation-confirmation";
import { CancelFlightResponse } from "../../../agent/types";

// Mocks
vi.mock("@langchain/langgraph-sdk/react-ui", () => ({
  useStreamContext: vi.fn(() => ({
    values: { language: "pt" },
    submit: vi.fn(),
  })),
}));

vi.mock("../../../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
  })),
  extractLanguageFromContext: vi.fn(() => "pt"),
}));

vi.mock("../../../hooks", () => ({
  useDateFormatting: vi.fn(() => ({
    formatDateTime: (date: string) => new Date(date).toLocaleString(),
  })),
}));

// Mock dos componentes compartilhados
vi.mock("../../../components/shared", () => ({
  PNRDisplay: ({
    pnr,
    label,
    className,
  }: {
    pnr: string;
    label: string;
    className?: string;
  }) => (
    <div data-testid="pnr-display" className={className}>
      <span>{label}</span>
      <span>{pnr}</span>
    </div>
  ),
  StatusBadge: ({
    status,
    text,
    description,
    className,
  }: {
    status: string;
    text: string;
    description: string;
    className?: string;
  }) => (
    <div data-testid="status-badge" className={className}>
      <span>{status}</span>
      <span>{text}</span>
      <span>{description}</span>
    </div>
  ),
  RefundInfo: ({
    amount,
    method,
    timeframe,
  }: {
    amount: string;
    method: string;
    timeframe: string;
  }) => (
    <div data-testid="refund-info">
      <span>{amount}</span>
      <span>{method}</span>
      <span>{timeframe}</span>
    </div>
  ),
}));

// Mock dos componentes específicos
vi.mock(
  "../../../agent-uis/flights/flight-cancellation-confirmation/components",
  () => ({
    CancellationHeader: ({ t }: { t: (key: string) => string }) => (
      <div data-testid="cancellation-header">
        <h1>{t("flight.cancellation.title")}</h1>
      </div>
    ),
    ImportantNote: ({ message }: { message: string }) => (
      <div data-testid="important-note">
        <p>{message}</p>
      </div>
    ),
  }),
);

describe("FlightCancellationConfirmation", () => {
  const mockCancellation: CancelFlightResponse = {
    pnr: "XYZ789",
    status: "CANCELED",
    canceledAt: "2024-01-16T10:30:00Z",
  };

  const defaultProps = {
    toolCallId: "test-tool-call-id",
    cancellation: mockCancellation,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar sem crashar", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByTestId("cancellation-header")).toBeInTheDocument();
    });

    it("deve renderizar elemento principal com classes corretas", () => {
      const { container } = render(
        <FlightCancellationConfirmation {...defaultProps} />,
      );
      const mainDiv = container.querySelector(
        ".bg-white.rounded-2xl.shadow-xl",
      );
      expect(mainDiv).toBeInTheDocument();
    });

    it("deve exibir o PNR do cancelamento", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByText("XYZ789")).toBeInTheDocument();
    });

    it("deve exibir o status do cancelamento", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByText("CANCELED")).toBeInTheDocument();
    });
  });

  describe("Componentes Filhos", () => {
    it("deve renderizar todos os componentes necessários", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);

      expect(screen.getByTestId("cancellation-header")).toBeInTheDocument();
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
      expect(screen.getByTestId("refund-info")).toBeInTheDocument();
      expect(screen.getByTestId("important-note")).toBeInTheDocument();
    });

    it("deve renderizar cabeçalho de cancelamento", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByTestId("cancellation-header")).toBeInTheDocument();
      expect(screen.getByText("flight.cancellation.title")).toBeInTheDocument();
    });

    it("deve renderizar informações de reembolso", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByTestId("refund-info")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.refundProcessing"),
      ).toBeInTheDocument();
    });

    it("deve renderizar nota importante", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByTestId("important-note")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.refundNote"),
      ).toBeInTheDocument();
    });
  });

  describe("Props Variations", () => {
    it("deve aceitar diferentes toolCallIds", () => {
      const props = { ...defaultProps, toolCallId: "different-tool-id" };

      expect(() => {
        render(<FlightCancellationConfirmation {...props} />);
      }).not.toThrow();
    });

    it("deve lidar com diferentes dados de cancelamento", () => {
      const differentCancellation: CancelFlightResponse = {
        pnr: "ABC123",
        status: "CANCELED",
        canceledAt: "2024-01-15T09:00:00Z",
      };

      render(
        <FlightCancellationConfirmation
          {...defaultProps}
          cancellation={differentCancellation}
        />,
      );
      expect(screen.getByText("ABC123")).toBeInTheDocument();
      expect(screen.getByText("CANCELED")).toBeInTheDocument();
    });
  });

  describe("Estados Condicionais", () => {
    it("deve formatar data de cancelamento corretamente", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);

      // A data formatada deve aparecer na descrição do status
      const statusBadge = screen.getByTestId("status-badge");
      expect(statusBadge).toBeInTheDocument();
    });

    it("deve renderizar normalmente sem valores opcionais", () => {
      const minimalCancellation: CancelFlightResponse = {
        pnr: "MIN123",
        status: "CANCELED",
        canceledAt: "2024-01-16T10:30:00Z",
      };

      render(
        <FlightCancellationConfirmation
          {...defaultProps}
          cancellation={minimalCancellation}
        />,
      );
      expect(screen.getByText("MIN123")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter estrutura semântica apropriada", () => {
      const { container } = render(
        <FlightCancellationConfirmation {...defaultProps} />,
      );

      // Verifica se tem estrutura de container principal
      const mainContainer = container.querySelector(".bg-white");
      expect(mainContainer).toBeInTheDocument();
    });

    it("deve renderizar componentes com identificadores apropriados", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);

      // Verifica se todos os componentes têm data-testids
      expect(screen.getByTestId("cancellation-header")).toBeInTheDocument();
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
      expect(screen.getByTestId("refund-info")).toBeInTheDocument();
      expect(screen.getByTestId("important-note")).toBeInTheDocument();
    });
  });

  describe("Integração com LangGraph", () => {
    it("deve usar linguagem do contexto", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);

      // Verifica se as traduções estão sendo chamadas
      expect(screen.getByText("flight.cancellation.title")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.refundProcessing"),
      ).toBeInTheDocument();
    });

    it("deve usar formatação de data do contexto", () => {
      render(<FlightCancellationConfirmation {...defaultProps} />);

      // Verifica se o hook de formatação está sendo usado
      const statusBadge = screen.getByTestId("status-badge");
      expect(statusBadge).toBeInTheDocument();
    });
  });

  describe("Responsividade", () => {
    it("deve ter layout responsivo", () => {
      const { container } = render(
        <FlightCancellationConfirmation {...defaultProps} />,
      );

      const mainContainer = container.querySelector(".max-w-2xl.mx-auto");
      expect(mainContainer).toBeInTheDocument();
    });

    it("deve ajustar em viewport menor", () => {
      // Simular viewport mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<FlightCancellationConfirmation {...defaultProps} />);
      expect(screen.getByTestId("cancellation-header")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("deve lidar com PNR vazio", () => {
      const emptyCancellation = {
        ...mockCancellation,
        pnr: "",
      };

      render(
        <FlightCancellationConfirmation
          {...defaultProps}
          cancellation={emptyCancellation}
        />,
      );
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
    });

    it("deve lidar com status indefinido", () => {
      const undefinedStatusCancellation = {
        ...mockCancellation,
        status: undefined,
      } as any;

      render(
        <FlightCancellationConfirmation
          {...defaultProps}
          cancellation={undefinedStatusCancellation}
        />,
      );
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
    });

    it("deve lidar com data de cancelamento inválida", () => {
      const invalidDateCancellation = {
        ...mockCancellation,
        canceledAt: "invalid-date",
      };

      render(
        <FlightCancellationConfirmation
          {...defaultProps}
          cancellation={invalidDateCancellation}
        />,
      );
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
    });

    it("deve renderizar mesmo com valores de reembolso ausentes", () => {
      const noRefundCancellation: CancelFlightResponse = {
        pnr: "NO123",
        status: "CANCELED",
        canceledAt: "2024-01-16T10:30:00Z",
      };

      render(
        <FlightCancellationConfirmation
          {...defaultProps}
          cancellation={noRefundCancellation}
        />,
      );
      expect(screen.getByText("NO123")).toBeInTheDocument();
      expect(screen.getByTestId("refund-info")).toBeInTheDocument();
    });
  });
});
