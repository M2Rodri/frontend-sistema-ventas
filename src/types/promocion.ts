// types/promocion.ts
export interface Oferta {
  id: number;
  descripcion: string;
  descuento: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  vigente: boolean;
  productos: ProductoSimple[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProductoSimple {
  id: number;
  nombre: string;
  sku: string;
}

export interface OfertaRequest {
  descripcion: string;
  descuento: number;
  fechaInicio: string;
  fechaFin: string;
  idsProductos: number[];
  activo: boolean;
}

export interface Resenia {
  id: number;
  idProducto: number;
  nombreProducto: string;
  idCliente: number;
  nombreCliente: string;
  calificacion: number;
  comentario?: string;
  aprobado: boolean;
  fecha: string;
}

export interface ReseniaRequest {
  idProducto: number;
  idCliente: number;
  calificacion: number;
  comentario?: string;
}

export type EstadoOferta = 'ACTIVA' | 'PROGRAMADA' | 'VENCIDA' | 'INACTIVA';
export type EstadoResenia = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';