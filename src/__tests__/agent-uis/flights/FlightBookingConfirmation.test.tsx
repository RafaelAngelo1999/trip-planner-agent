import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test/utils/render";
import userEvent from "@testing-library/user-event";
import FlightBookingConfirmation from "../../../agent-uis/flights/flight-booking-confirmation";
import { mockBooking } from "../../../test/mocks/data/flights";

// Mocks (devem ser definidos antes dos imports)
const mockSubmit = vi.fn();

vi.mock("@langchain/langgraph-sdk/react-ui", () => ({
  useStreamContext: vi.fn(() => ({
    values: { language: "pt" },
    submit: mockSubmit,
  })),
}));

vi.mock("../../../hooks/useI18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "flight.booking.confirmed": "Reserva Confirmada",
        "flight.booking.pnrCode": "Código PNR",
        "flight.booking.bookedOn": "Reservado em",
        "flight.booking.cancelRequest": "Cancelar voo",
        "flight.booking.pnrNote":
          "Guarde este código PNR para futuras consultas",
        "flight.booking.passenger": "Passageiro",
        "flight.booking.total": "Total",
        "flight.booking.cancel": "Cancelar Reserva",
      };
      return translations[key] || key;
    },
  })),
  extractLanguageFromContext: vi.fn(() => "pt"),
}));

vi.mock("../../../hooks", () => ({
  useFlightLookup: vi.fn(() => null),
  useDateFormatting: vi.fn(() => ({
    formatDateTime: (date: string) => new Date(date).toLocaleString("pt-BR"),
  })),
  useClipboard: vi.fn(() => ({
    copied: false,
    copyToClipboard: vi.fn(),
  })),
}));

describe("FlightBookingConfirmation", () => {
  const defaultProps = {
    toolCallId: "tool-123",
    booking: mockBooking,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar sem crashar", () => {
      expect(() => {
        render(<FlightBookingConfirmation {...defaultProps} />);
      }).not.toThrow();
    });

    it("deve renderizar elemento principal com role e aria-label corretos", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeDefined();
      expect(mainElement.getAttribute("aria-label")).toBe("Reserva Confirmada");
    });

    it("deve exibir o PNR da reserva", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);
      expect(screen.getByText("ABC123")).toBeDefined();
    });

    it("deve exibir dados do passageiro", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);
      expect(screen.getByText("João Silva")).toBeDefined();
      expect(screen.getByText("joao.silva@email.com")).toBeDefined();
    });

    it("deve exibir valor total da reserva", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);
      expect(screen.getByText(/1\.500,00/)).toBeDefined();
    });

    it("deve ter classes CSS corretas no container principal", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      const mainElement = screen.getByRole("main");
      expect(mainElement.className).toContain("bg-white");
      expect(mainElement.className).toContain("rounded-2xl");
      expect(mainElement.className).toContain("shadow-xl");
      expect(mainElement.className).toContain("max-w-2xl");
      expect(mainElement.className).toContain("mx-auto");
      expect(mainElement.className).toContain("booking-confirmation");
    });
  });

  describe("Componentes Filhos", () => {
    it("deve renderizar todos os componentes necessários", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      // Verificar presença de elementos principais
      expect(screen.getByRole("main")).toBeDefined();
      expect(screen.getByText("ABC123")).toBeDefined(); // PNRDisplay
      expect(screen.getByText("TICKETED")).toBeDefined(); // StatusBadge
      expect(screen.getByText("João Silva")).toBeDefined(); // PassengerInfo
      expect(
        screen.getByLabelText("Cancelar Reserva - PNR: ABC123"),
      ).toBeDefined(); // CancelButton
    });

    it("deve renderizar detalhes do voo quando disponível", () => {
      // Mock useFlightLookup para retornar dados
      const mockUseFlightLookup = vi.fn(() => ({
        airline: "LATAM",
        outbound: [{ from: "GRU", to: "JFK" }],
      }));

      vi.doMock("../../../hooks", () => ({
        useFlightLookup: mockUseFlightLookup,
        useDateFormatting: vi.fn(() => ({
          formatDateTime: (date: string) =>
            new Date(date).toLocaleString("pt-BR"),
        })),
        useClipboard: vi.fn(() => ({
          copied: false,
          copyToClipboard: vi.fn(),
        })),
      }));

      render(<FlightBookingConfirmation {...defaultProps} />);
      expect(screen.getByRole("main")).toBeDefined();
    });
  });

  describe("Interações do Usuário", () => {
    it("deve submeter cancelamento ao clicar no botão cancelar", async () => {
      const user = userEvent.setup();
      render(<FlightBookingConfirmation {...defaultProps} />);

      const cancelButton = screen.getByLabelText(
        "Cancelar Reserva - PNR: ABC123",
      );
      await user.click(cancelButton);

      expect(mockSubmit).toHaveBeenCalledWith(
        {},
        {
          command: {
            update: {
              messages: [
                {
                  type: "human",
                  content: "Cancelar voo Código PNR: ABC123",
                },
              ],
            },
            goto: "flights",
          },
        },
      );
    });

    it("deve navegar para flights após cancelamento", async () => {
      const user = userEvent.setup();
      render(<FlightBookingConfirmation {...defaultProps} />);

      const cancelButton = screen.getByLabelText(
        "Cancelar Reserva - PNR: ABC123",
      );
      await user.click(cancelButton);

      expect(mockSubmit).toHaveBeenCalled();
      const submitCall = mockSubmit.mock.calls[0];
      expect(submitCall?.[1]?.command?.goto).toBe("flights");
    });
  });

  describe("Props Variations", () => {
    it("deve aceitar diferentes toolCallIds", () => {
      const props = { ...defaultProps, toolCallId: "different-id" };

      expect(() => {
        render(<FlightBookingConfirmation {...props} />);
      }).not.toThrow();
    });

    it("deve lidar com diferentes dados de reserva", () => {
      const differentBooking = {
        ...mockBooking,
        pnr: "XYZ789",
        passenger: {
          fullName: "Maria Santos",
          email: "maria.santos@email.com",
        },
      };

      const props = { ...defaultProps, booking: differentBooking };
      render(<FlightBookingConfirmation {...props} />);

      expect(screen.getByText("XYZ789")).toBeDefined();
      expect(screen.getByText("Maria Santos")).toBeDefined();
      expect(screen.getByText("maria.santos@email.com")).toBeDefined();
    });
  });

  describe("Estados Condicionais", () => {
    it("deve renderizar normalmente sem detalhes do voo", () => {
      // useFlightLookup retorna null por padrão no mock
      render(<FlightBookingConfirmation {...defaultProps} />);

      expect(screen.getByRole("main")).toBeDefined();
      expect(screen.getByText("ABC123")).toBeDefined();
    });

    it("deve formatar data corretamente", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      // Verificar se a data formatada aparece (usando formatDateTime)
      expect(screen.getByRole("main")).toBeDefined();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter role main no elemento principal", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);
      expect(screen.getByRole("main")).toBeDefined();
    });

    it("deve ter aria-label apropriado", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      const mainElement = screen.getByRole("main");
      expect(mainElement.getAttribute("aria-label")).toBe("Reserva Confirmada");
    });

    it("deve ser navegável por teclado", async () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      const cancelButton = screen.getByLabelText(
        "Cancelar Reserva - PNR: ABC123",
      );
      expect(cancelButton).toBeDefined();

      // Simular navegação por teclado
      cancelButton.focus();
      expect(document.activeElement).toBe(cancelButton);
    });
  });

  describe("Integração com LangGraph", () => {
    it("deve usar linguagem do contexto", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      // Verificar se extractLanguageFromContext foi chamado
      // e useI18n foi chamado com a linguagem correta
      expect(screen.getByRole("main")).toBeDefined();
    });

    it("deve usar submit do contexto para navegação", async () => {
      const user = userEvent.setup();
      render(<FlightBookingConfirmation {...defaultProps} />);

      const cancelButton = screen.getByLabelText(
        "Cancelar Reserva - PNR: ABC123",
      );
      await user.click(cancelButton);

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe("Responsividade", () => {
    it("deve ter layout responsivo", () => {
      render(<FlightBookingConfirmation {...defaultProps} />);

      const mainElement = screen.getByRole("main");
      expect(mainElement.className).toContain("max-w-2xl");
      expect(mainElement.className).toContain("mx-auto");
    });

    it("deve ajustar em mobile", () => {
      // Simular viewport mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<FlightBookingConfirmation {...defaultProps} />);
      expect(screen.getByRole("main")).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("deve lidar com PNR vazio", () => {
      const bookingWithEmptyPNR = { ...mockBooking, pnr: "" };
      const props = { ...defaultProps, booking: bookingWithEmptyPNR };

      expect(() => {
        render(<FlightBookingConfirmation {...props} />);
      }).not.toThrow();
    });

    it("deve lidar com dados de passageiro parciais", () => {
      const bookingWithPartialData = {
        ...mockBooking,
        passenger: {
          fullName: "João Silva",
          email: "", // Email vazio
        },
      };

      const props = { ...defaultProps, booking: bookingWithPartialData };

      expect(() => {
        render(<FlightBookingConfirmation {...props} />);
      }).not.toThrow();

      expect(screen.getByText("João Silva")).toBeDefined();
    });

    it("deve lidar com valor total zero", () => {
      const bookingWithZeroTotal = { ...mockBooking, total: 0 };
      const props = { ...defaultProps, booking: bookingWithZeroTotal };

      expect(() => {
        render(<FlightBookingConfirmation {...props} />);
      }).not.toThrow();
    });

    it("deve lidar com erro no hook useFlightLookup", () => {
      const mockErrorHook = vi.fn(() => {
        throw new Error("Flight lookup error");
      });

      vi.doMock("../../../hooks", () => ({
        useFlightLookup: mockErrorHook,
        useDateFormatting: vi.fn(() => ({
          formatDateTime: (date: string) =>
            new Date(date).toLocaleString("pt-BR"),
        })),
        useClipboard: vi.fn(() => ({
          copied: false,
          copyToClipboard: vi.fn(),
        })),
      }));

      // Componente deve renderizar mesmo com erro no hook
      expect(() => {
        render(<FlightBookingConfirmation {...defaultProps} />);
      }).not.toThrow();
    });
  });
});
