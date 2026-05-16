// types/venta.ts

export enum EstadoVenta {
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  QR = 'QR'
}

export interface ItemVentaRequest {
  idProducto: number;
  cantidad: number;
  precioUnitarioConDescuento?: number;
  descuentoPorcentaje?: number;
}

/**
 * Request para crear venta
 * Soporta dos modos:
 * 1. Cliente registrado: enviar idCliente
 * 2. Cliente rápido: enviar nombreClienteDirecto (y opcionalmente celularClienteDirecto)
 */
export interface VentaRequest {
  // MODO 1: Cliente registrado
  idCliente?: number;
  
  // MODO 2: Cliente rápido
  nombreClienteDirecto?: string;
  celularClienteDirecto?: string;
  
  // Datos comunes
  metodoPago: MetodoPago;
  referenciaPago?: string;
  items: ItemVentaRequest[];
}

export interface DetalleVenta {
  id: number;
  idProducto: number;
  nombreProducto: string;
  codigoProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pago {
  id: number;
  monto: number;
  metodoPago: MetodoPago;
  referencia?: string;
  estado: string;
  fechaPago: string;
}

export interface Venta {
  id: number;
  idCliente?: number;
  nombreCliente: string;
  celularCliente?: string;
  fechaVenta: string;
  montoTotal: number;
  estado: EstadoVenta;
  metodoPago: MetodoPago;
  idUsuario: number;
  nombreUsuario: string;
  detalles: DetalleVenta[];
  pagos: Pago[];
  fechaActualizacion: string;
  esClienteRegistrado: boolean;
}

export interface VentaEstadisticas {
  totalVentas: number;
  ventasCompletadas: number;
  ventasPendientes: number;
  ventasCanceladas: number;
  montoTotal: number;
  ventasDelDia: number;
  montoDelDia: number;
}