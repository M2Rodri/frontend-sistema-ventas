// src/app/tienda/perfil/page.tsx
'use client'; // Porque usaremos useAuth

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const PerfilPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login si no hay usuario autenticado
    // O mostrar un mensaje
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p>Necesitas iniciar sesión para ver tu perfil.</p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // NO accedemos a user.celular ni user.direccion directamente para evitar errores de tipo
  // Mostramos solo la información disponible en AuthResponse (id, nombre, apellido, email, role)

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="font-medium">{user.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Apellido</p>
              <p className="font-medium">{user.apellido}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Correo Electrónico</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {/* 
              OCULTAMOS celular y direccion para evitar errores de tipo TS2339
              Estas propiedades no están definidas en el tipo AuthResponse devuelto por useAuth.
              Se pueden mostrar una vez que se actualice el tipo AuthResponse o se acceda de forma segura.
            */}
            {/* 
            <div>
              <p className="text-sm text-gray-600">Celular</p>
              <p className="font-medium">{user.celular || 'No especificado'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Dirección</p>
              <p className="font-medium">{user.direccion || 'No especificada'}</p>
            </div> 
            */}
          </div>
          {/* Botón para editar perfil si fuera necesario */}
          {/* <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Editar Perfil
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/tienda/lista-deseos" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">Lista de Deseos</h3>
                  <p className="text-sm text-gray-600">Tus productos favoritos</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="#" className="block opacity-50 cursor-not-allowed"> {/* Placeholder para futuras secciones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">Reseñas</h3>
                  <p className="text-sm text-gray-600">Tus opiniones sobre productos</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
