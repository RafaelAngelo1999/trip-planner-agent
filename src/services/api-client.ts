/**
 * API Client para Trip Planner Backend
 * Base URL configurada via variável de ambiente
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText,
            timestamp: new Date().toISOString(),
          },
        }));

        throw new Error(
          errorData.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro de rede desconhecido");
    }
  }

  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request(url.pathname + url.search);
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

// Instância singleton do cliente API
export const apiClient = new ApiClient();

// Função de health check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get("/health");
    return response.status === "OK";
  } catch {
    return false;
  }
}
