// src/app/tienda/page.tsx
import React from 'react';
import Link from 'next/link';

// Componente para las categorías
const CategoriaCard = ({ nombre, imagenUrl, href }: { nombre: string; imagenUrl: string; href: string }) => {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="h-40 bg-gray-200 flex items-center justify-center">
          {/* Placeholder para imagen de categoría */}
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">{nombre}</h3>
        </div>
      </div>
    </Link>
  );
};

// Componente para los productos destacados
const ProductoCard = ({ nombre, precio, categoria, imagenUrl, href }: { nombre: string; precio: string; categoria: string; imagenUrl: string; href: string }) => {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-transform duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {/* Placeholder para imagen de producto */}
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
        </div>
        <div className="p-4">
          <span className="text-sm text-gray-500">{categoria}</span>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{nombre}</h3>
          <p className="text-lg font-bold text-primary-600 mt-1">{precio}</p>
        </div>
      </div>
    </Link>
  );
};

const TiendaHomePage = () => {
  // Datos de ejemplo - estos vendrán del backend en el futuro
  const categorias = [
    { id: 1, nombre: "Camas", imagenUrl: "", href: "/tienda/productos?categoria=camas" },
    { id: 2, nombre: "Colchones", imagenUrl: "", href: "/tienda/productos?categoria=colchones" },
    { id: 3, nombre: "Almohadas", imagenUrl: "", href: "/tienda/productos?categoria=almohadas" },
  ];

  const productosDestacados = [
    { id: 1, nombre: "Cama King Size Premium", precio: "Bs. 4,500", categoria: "Camas", imagenUrl: "", href: "/tienda/producto/1" },
    { id: 2, nombre: "Colchón Ortopédico Lux", precio: "Bs. 3,200", categoria: "Colchones", imagenUrl: "", href: "/tienda/producto/2" },
    { id: 3, nombre: "Almohada de Espuma Viscoelástica", precio: "Bs. 250", categoria: "Almohadas", imagenUrl: "", href: "/tienda/producto/3" },
    { id: 4, nombre: "Cama Plegable Confort", precio: "Bs. 1,800", categoria: "Camas", imagenUrl: "", href: "/tienda/producto/4" },
  ];

  return (
    <div className="space-y-12 py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-16rem)]">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl overflow-hidden shadow-xl pt-16"> {/* <--- Añadido pt-16 aquí */}
                  <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl"></div> {/* <-- NUEVO DIV CON EFECTO ESMERILADO */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center text-center"> {/* Este div ya tenía padding vertical */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Descansa Mejor con Nuestras Camas Premium</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">Entrega en toda Bolivia - Tecnología 3D y AR</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tienda/productos" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Ver Catálogo
            </Link>
            <Link href="/tienda/promociones" className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
              Ofertas Especiales
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">Explora por Categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              nombre={categoria.nombre}
              imagenUrl={categoria.imagenUrl}
              href={categoria.href}
            />
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productosDestacados.map((producto) => (
            <ProductoCard
              key={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              categoria={producto.categoria}
              imagenUrl={producto.imagenUrl}
              href={producto.href}
            />
          ))}
        </div>
      </section>

      {/* Sección de Ofertas (ejemplo futuro) */}
      {/* <section className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-bold">🎉 ¡OFERTA ACTIVA! - Hasta 30% OFF en Colchones seleccionados</p>
      </section> */}
    </div>
  );
};

export default TiendaHomePage;