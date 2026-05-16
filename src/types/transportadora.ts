// types/transportadora.ts

export interface Transportadora {
  id: number;
  nombre: string;
  telefono: string | null;
  correo: string | null;
  tarifaBase: number;
  tiempoEstimadoDias: number;
  activo: boolean;
  fechaRegistro: string; // LocalDateTime
  fechaActualizacion: string; // LocalDateTime
}

export interface TransportadoraRequest {
  nombre: string;
  telefono?: string;
  correo?: string;
  tarifaBase: number;
  tiempoEstimadoDias: number;
  activo: boolean;
}