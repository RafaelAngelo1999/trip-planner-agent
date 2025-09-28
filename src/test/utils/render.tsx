import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

// Interface para as opções customizadas
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  wrapper?: ({ children }: { children: ReactNode }) => ReactElement;
}

// Wrapper customizado para testes
function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  return rtlRender(ui, {
    // Adicionar providers se necessário no futuro
    ...options,
  });
}

// Re-exportar tudo do testing-library
export * from "@testing-library/react";
export { customRender as render };
