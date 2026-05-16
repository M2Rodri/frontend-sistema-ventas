// types/cliente.ts

export enum TipoCliente {
  REGISTRADO = 'REGISTRADO',
  INVITADO = 'INVITADO'
}

export interface ClienteRequest {
  nombre: string;
  apellido: string;
  nitCi?: string;
  celular: string;
  correo?: string;
  direccion?: string;
  tipo?: TipoCliente;
  activo?: boolean;
}

export interface ClienteResponse {
  id: number;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  nitCi?: string;
  celular: string;
  correo?: string;
  direccion?: string;
  tipo: TipoCliente;
  activo: boolean;
  fechaRegistro: string;
  fechaActualizacion: string;
}

/**
 * Estadísticas generales de clientes
 * Para Interfaz P6.1 - Indicadores superiores
 */
export interface ClienteEstadisticas {
  totalClientes: number;
  clientesConComprasEsteMes: number;
  clienteTopNombre?: string;
  clienteTopMonto?: number;
}

/**
 * Historial de compras de un cliente
 * Para Interfaz P6.3
 */
export interface HistorialComprasResponse {
  cliente: ClienteResponse;
  ventas: VentaCliente[];
  estadisticas: EstadisticasCompra;
}

export interface VentaCliente {
  id: number;
  fechaVenta: string;
  productosResumen: string;
  cantidadTotalProductos: number;
  montoTotal: number;
  metodoPago: string;
  nombreUsuario: string;
  detalles: DetalleVentaCliente[];
}

export interface DetalleVentaCliente {
  id: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface EstadisticasCompra {
  totalCompras: number;
  montoTotal: number;
  ticketPromedio: number;
  ultimaCompra?: string;
  productoMasComprado?: string;
  cantidadProductoMasComprado?: number;
}

/**
 * Cliente con estadísticas para tabla P6.1
 */
export interface ClienteConEstadisticas extends ClienteResponse {
  numeroCompras: number;
  montoTotalComprado: number;
  ultimaFechaCompra?: string;
}