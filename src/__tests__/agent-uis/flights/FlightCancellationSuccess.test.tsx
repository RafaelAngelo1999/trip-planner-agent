import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test/utils/render";
import userEvent from "@testing-library/user-event";
import FlightCancellationSuccess from "../../../agent-uis/flights/flight-cancellation-success";
import { CancelFlightResponse } from "../../../agent/types";

// Mocks
const mockSubmit = vi.fn();

vi.mock("@langchain/langgraph-sdk/react-ui", () => ({
  useStreamContext: vi.fn(() => ({
    values: { language: "pt" },
    submit: mockSubmit,
  })),
}));

vi.mock("../../../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
  })),
  extractLanguageFromContext: vi.fn(() => "pt"),
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
}));

// Mock dos componentes específicos
vi.mock(
  "../../../agent-uis/flights/flight-cancellation-confirmation/components",
  () => ({
    ImportantNote: ({ message }: { message: string }) => (
      <div data-testid="important-note">
        <p>{message}</p>
      </div>
    ),
  }),
);

vi.mock(
  "../../../agent-uis/flights/flight-cancellation-success/components",
  () => ({
    ActionButtons: ({
      onContinue,
      onClose,
      t,
    }: {
      onContinue: () => void;
      onClose: () => void;
      t: (key: string) => string;
    }) => (
      <div data-testid="action-buttons">
        <button onClick={onContinue}>
          {t("flight.cancellation.continue")}
        </button>
        <button onClick={onClose}>{t("flight.cancellation.close")}</button>
      </div>
    ),
    MinimalSuccessState: ({ t }: { t: (key: string) => string }) => (
      <div data-testid="minimal-success-state">
        <p>{t("flight.cancellation.success")}</p>
      </div>
    ),
    SuccessHeader: ({
      onClose,
      t,
    }: {
      onClose: () => void;
      t: (key: string) => string;
    }) => (
      <div data-testid="success-header">
        <h1>{t("flight.cancellation.successTitle")}</h1>
        <button onClick={onClose}>{t("common.close")}</button>
      </div>
    ),
  }),
);

describe("FlightCancellationSuccess", () => {
  const mockCancellation: CancelFlightResponse = {
    pnr: "ABC123",
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
      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByTestId("success-header")).toBeInTheDocument();
    });

    it("deve renderizar elemento principal com classes corretas", () => {
      const { container } = render(
        <FlightCancellationSuccess {...defaultProps} />,
      );
      const mainDiv = container.querySelector(
        ".bg-white.rounded-3xl.shadow-2xl",
      );
      expect(mainDiv).toBeInTheDocument();
    });

    it("deve exibir o PNR do cancelamento", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByText("ABC123")).toBeInTheDocument();
    });

    it("deve exibir status de sucesso", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.cancelled"),
      ).toBeInTheDocument();
    });
  });

  describe("Componentes Filhos", () => {
    it("deve renderizar todos os componentes necessários", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);

      expect(screen.getByTestId("success-header")).toBeInTheDocument();
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
      expect(screen.getByTestId("important-note")).toBeInTheDocument();
      expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
    });

    it("deve renderizar cabeçalho de sucesso", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByTestId("success-header")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.successTitle"),
      ).toBeInTheDocument();
    });

    it("deve renderizar botões de ação", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.continue"),
      ).toBeInTheDocument();
      expect(screen.getByText("flight.cancellation.close")).toBeInTheDocument();
    });

    it("deve renderizar nota importante com PNR", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByTestId("important-note")).toBeInTheDocument();

      const noteText = screen.getByTestId("important-note").textContent;
      expect(noteText).toContain("ABC123");
    });
  });

  describe("Interações do Usuário", () => {
    it("deve permitir continuar navegação", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const continueButton = screen.getByText("flight.cancellation.continue");
      await user.click(continueButton);

      expect(mockSubmit).toHaveBeenCalledWith(
        {},
        {
          command: {
            update: {
              messages: [
                {
                  type: "human",
                  content: "flight.cancellation.thankYou",
                },
              ],
            },
            goto: "generalInput",
          },
        },
      );
    });

    it("deve permitir fechar o componente", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const closeButton = screen.getByText("flight.cancellation.close");
      await user.click(closeButton);

      // Após fechar, deve mostrar estado mínimo
      expect(screen.getByTestId("minimal-success-state")).toBeInTheDocument();
    });

    it("deve permitir fechar pelo botão do header", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const headerCloseButton = screen.getByText("common.close");
      await user.click(headerCloseButton);

      // Após fechar, deve mostrar estado mínimo
      expect(screen.getByTestId("minimal-success-state")).toBeInTheDocument();
    });
  });

  describe("Estados Visuais", () => {
    it("deve mostrar detalhes completos inicialmente", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);

      expect(screen.getByTestId("success-header")).toBeInTheDocument();
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
      expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
    });

    it("deve mostrar estado mínimo após fechar", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const closeButton = screen.getByText("flight.cancellation.close");
      await user.click(closeButton);

      expect(screen.getByTestId("minimal-success-state")).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.success"),
      ).toBeInTheDocument();
    });
  });

  describe("Props Variations", () => {
    it("deve aceitar diferentes toolCallIds", () => {
      const props = { ...defaultProps, toolCallId: "different-tool-id" };

      expect(() => {
        render(<FlightCancellationSuccess {...props} />);
      }).not.toThrow();
    });

    it("deve lidar com diferentes dados de cancelamento", () => {
      const differentCancellation: CancelFlightResponse = {
        pnr: "XYZ789",
        status: "CANCELED",
        canceledAt: "2024-01-15T09:00:00Z",
      };

      render(
        <FlightCancellationSuccess
          {...defaultProps}
          cancellation={differentCancellation}
        />,
      );
      expect(screen.getByText("XYZ789")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter estrutura semântica apropriada", () => {
      const { container } = render(
        <FlightCancellationSuccess {...defaultProps} />,
      );

      // Verifica se tem estrutura de container principal
      const mainContainer = container.querySelector(".bg-white");
      expect(mainContainer).toBeInTheDocument();
    });

    it("deve renderizar botões funcionais", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);

      const continueButton = screen.getByText("flight.cancellation.continue");
      const closeButton = screen.getByText("flight.cancellation.close");

      expect(continueButton).toBeDefined();
      expect(closeButton).toBeDefined();

      // Simular navegação por teclado
      continueButton.focus();
      expect(document.activeElement).toBe(continueButton);
    });

    it("deve renderizar componentes com identificadores apropriados", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);

      // Verifica se todos os componentes têm data-testids
      expect(screen.getByTestId("success-header")).toBeInTheDocument();
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
      expect(screen.getByTestId("status-badge")).toBeInTheDocument();
      expect(screen.getByTestId("important-note")).toBeInTheDocument();
      expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
    });
  });

  describe("Integração com LangGraph", () => {
    it("deve usar linguagem do contexto", () => {
      render(<FlightCancellationSuccess {...defaultProps} />);

      // Verifica se as traduções estão sendo chamadas
      expect(
        screen.getByText("flight.cancellation.successTitle"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("flight.cancellation.cancelled"),
      ).toBeInTheDocument();
    });

    it("deve usar submit do contexto para navegação", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const continueButton = screen.getByText("flight.cancellation.continue");
      await user.click(continueButton);

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe("Responsividade", () => {
    it("deve ter layout responsivo", () => {
      const { container } = render(
        <FlightCancellationSuccess {...defaultProps} />,
      );

      const mainContainer = container.querySelector(".max-w-6xl.mx-auto");
      expect(mainContainer).toBeInTheDocument();
    });

    it("deve ajustar em viewport menor", () => {
      // Simular viewport mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<FlightCancellationSuccess {...defaultProps} />);
      expect(screen.getByTestId("success-header")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("deve lidar com PNR vazio", () => {
      const emptyCancellation = {
        ...mockCancellation,
        pnr: "",
      };

      render(
        <FlightCancellationSuccess
          {...defaultProps}
          cancellation={emptyCancellation}
        />,
      );
      expect(screen.getByTestId("pnr-display")).toBeInTheDocument();
    });

    it("deve lidar com dados de cancelamento mínimos", () => {
      const minimalCancellation: CancelFlightResponse = {
        pnr: "MIN123",
        status: "CANCELED",
        canceledAt: "2024-01-16T10:30:00Z",
      };

      render(
        <FlightCancellationSuccess
          {...defaultProps}
          cancellation={minimalCancellation}
        />,
      );
      expect(screen.getByText("MIN123")).toBeInTheDocument();
      expect(screen.getByTestId("success-header")).toBeInTheDocument();
    });

    it("deve lidar com múltiplos cliques no botão", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const continueButton = screen.getByText("flight.cancellation.continue");

      // Clicar múltiplas vezes rapidamente
      await user.click(continueButton);
      await user.click(continueButton);

      // Deve ter sido chamado pelo menos uma vez
      expect(mockSubmit).toHaveBeenCalled();
    });

    it("deve renderizar estado mínimo mesmo sem dados completos", async () => {
      const user = userEvent.setup();
      render(<FlightCancellationSuccess {...defaultProps} />);

      const closeButton = screen.getByText("flight.cancellation.close");
      await user.click(closeButton);

      // Estado mínimo deve sempre renderizar
      expect(screen.getByTestId("minimal-success-state")).toBeInTheDocument();
    });
  });
});
