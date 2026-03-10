export interface EvaluacionDTO {
  id: number;
  evaluadorId: number;
  evaluadoId: number;
  cuestionarioId: number;
  respuestas: number[];
  comentarioGeneral: string;
  puntajeFinal: number;
  fechaEvaluacion: string;
}

export interface EvaluacionRequestDTO {
  evaluadorId: number;
  evaluadoId: number;
  cuestionarioId: number;
  respuestas: number[];
  comentarioGeneral: string;
}

export interface DocenteDTO {
  id: number;
  nombre: string;
  materia: string;
  email: string;
}

export interface DocenteRequestDTO {
  nombre: string;
  materia: string;
  email: string;
}

export interface CuestionarioDTO {
  id: number;
  titulo: string;
  preguntas: string[];
}

export interface CuestionarioRequestDTO {
  titulo: string;
  preguntas: string[];
}

export interface EstudianteDTO {
  id: number;
  nombre: string;
  matricula: string;
  email: string;
}

export interface EstudianteRequestDTO {
  nombre: string;
  matricula: string;
  email: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string[];
  timestamp?: string;
  path?: string;
  status?: number;
}
