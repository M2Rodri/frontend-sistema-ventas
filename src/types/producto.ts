// frontend/src/types/producto.ts
export type TipoProducto = 'CAMA' | 'COLCHON' | 'ALMOHADA' | 'ACCESORIO';

export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  modelo?: string;
  idCategoria: number;
  nombreCategoria: string;
  calidad?: string;
  precioUnitario: number;
  precioVenta: number;
  peso?: number;
  dimensiones?: string;
  stockMinimo: number;
  tipoProducto: TipoProducto;
  activo: boolean;
  
  // ✅ NUEVOS CAMPOS CONDICIONALES
  firmeza?: 'suave' | 'media' | 'firme'; // Solo COLCHON
  tipoCama?: 'individual' | 'matrimonial' | 'queen' | 'king'; // Solo CAMA
  materialNucleo?: 'espuma' | 'latex' | 'muelle'; // Solo COLCHON
  
  imagenes: ImagenProducto[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProductoRequest {
  sku: string;
  nombre: string;
  descripcion?: string;
  modelo?: string;
  idCategoria: number;
  calidad?: string;
  precioUnitario: number;
  precioVenta: number;
  peso?: number;
  dimensiones?: string;
  stockMinimo: number;
  tipoProducto: TipoProducto;
  activo: boolean;
  
  // ✅ NUEVOS CAMPOS CONDICIONALES
  firmeza?: 'suave' | 'media' | 'firme';
  tipoCama?: 'individual' | 'matrimonial' | 'queen' | 'king';
  materialNucleo?: 'espuma' | 'latex' | 'muelle';
}

export interface ImagenProducto {
  id: number;
  urlImagen: string;
  esPrincipal: boolean;
  orden: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  cantidadProductos: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// frontend/src/types/producto.ts (agregar al final)

export interface MultimediaProducto {
  id: number;
  productoId: number;
  urlModelo3d: string;
  urlVistaPrevia?: string;
  habilitadoRa: boolean;
  activo: boolean;
}