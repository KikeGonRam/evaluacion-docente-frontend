import type {
  ApiErrorResponse,
  CuestionarioDTO,
  CuestionarioRequestDTO,
  DocenteDTO,
  DocenteRequestDTO,
  EstudianteDTO,
  EstudianteRequestDTO,
  EvaluacionDTO,
  EvaluacionRequestDTO,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/backend";

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function friendlyStatusMessage(status: number) {
  if (status === 400) return "La solicitud es inválida. Revisa los datos enviados.";
  if (status === 404) return "El recurso solicitado no existe o fue eliminado.";
  if (status === 409) return "La operación entra en conflicto con el estado actual.";
  if (status >= 500) return "El backend falló al procesar la solicitud.";
  return "No fue posible completar la operación.";
}

function extractErrorMessage(payload: ApiErrorResponse | null, status: number) {
  const parts = [payload?.message, payload?.error, ...(payload?.details ?? [])]
    .filter(Boolean)
    .map((item) => item?.trim())
    .filter(Boolean) as string[];

  return {
    message: parts[0] ?? friendlyStatusMessage(status),
    details: parts.slice(1),
  };
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let parsedPayload: ApiErrorResponse | null = null;

    try {
      parsedPayload = (await response.json()) as ApiErrorResponse;
    } catch {}

    const parsed = extractErrorMessage(parsedPayload, response.status);
    throw new ApiError(parsed.message, response.status, parsed.details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function withPost(body: unknown): RequestInit {
  return {
    method: "POST",
    body: JSON.stringify(body),
  };
}

function withPut(body: unknown): RequestInit {
  return {
    method: "PUT",
    body: JSON.stringify(body),
  };
}

export const api = {
  docentes: {
    getAll: () => request<DocenteDTO[]>("/docentes"),
    create: (data: DocenteRequestDTO) =>
      request<DocenteDTO>("/docentes", withPost(data)),
    update: (id: number, data: DocenteRequestDTO) =>
      request<DocenteDTO>(`/docentes/${id}`, withPut(data)),
    remove: (id: number) => request<void>(`/docentes/${id}`, { method: "DELETE" }),
  },
  cuestionarios: {
    getAll: () => request<CuestionarioDTO[]>("/cuestionarios"),
    create: (data: CuestionarioRequestDTO) =>
      request<CuestionarioDTO>("/cuestionarios", withPost(data)),
    update: (id: number, data: CuestionarioRequestDTO) =>
      request<CuestionarioDTO>(`/cuestionarios/${id}`, withPut(data)),
    remove: (id: number) =>
      request<void>(`/cuestionarios/${id}`, { method: "DELETE" }),
  },
  estudiantes: {
    getAll: () => request<EstudianteDTO[]>("/estudiantes"),
    create: (data: EstudianteRequestDTO) =>
      request<EstudianteDTO>("/estudiantes", withPost(data)),
    update: (id: number, data: EstudianteRequestDTO) =>
      request<EstudianteDTO>(`/estudiantes/${id}`, withPut(data)),
    remove: (id: number) =>
      request<void>(`/estudiantes/${id}`, { method: "DELETE" }),
  },
  evaluaciones: {
    getAll: () => request<EvaluacionDTO[]>("/evaluaciones"),
    create: (data: EvaluacionRequestDTO) =>
      request<EvaluacionDTO>("/evaluaciones", withPost(data)),
    remove: (id: number) =>
      request<void>(`/evaluaciones/${id}`, { method: "DELETE" }),
  },
};
