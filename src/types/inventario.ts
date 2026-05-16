// types/inventario.ts

export type TipoAjuste = 'ENTRADA' | 'SALIDA';
export type EstadoAlerta = 'PENDIENTE' | 'ATENDIDA';

export interface Inventario {
  id: number;
  idProducto: number;
  nombreProducto: string;
  skuProducto: string;
  cantidadDisponible: number;
  stockMinimo: number;
  ubicacion: string | null;
  bajoStockMinimo: boolean;
  fechaActualizacion: string;
}

export interface InventarioRequest {
  idProducto: number;
  cantidadDisponible: number;
  ubicacion?: string;
}

export interface AlertaInventario {
  id: number;
  idProducto: number;
  nombreProducto: string;
  skuProducto: string;
  cantidadActual: number;
  cantidadMinima: number;
  fechaAlerta: string;
  estado: EstadoAlerta;
}

export interface AjusteInventario {
  id: number;
  idProducto: number;
  nombreProducto: string;
  skuProducto: string;
  cantidadAnterior: number;
  cantidadNueva: number;
  diferencia: number;
  tipoAjuste: TipoAjuste;
  motivo: string;
  idUsuario: number | null;
  nombreUsuario: string;
  fecha: string;
}

export interface AjusteInventarioRequest {
  idProducto: number;
  cantidad: number;
  tipoAjuste: 'ENTRADA' | 'SALIDA';
  motivo: string;
}