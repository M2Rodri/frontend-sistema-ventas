'use client';

import { useRouter } from 'next/navigation'; // 
import { useEffect } from 'react'; // 
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { UserPlus, PackagePlus, Eye, FileText, TrendingUp, TrendingDown, Package } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter(); // ← AGREGAR

  // Proteger el dashboard - solo ADMIN y EMPLEADO
  useEffect(() => {
    if (user && user.role === 'CLIENTE') {
      router.replace('/tienda');
    }
  }, [user, router]); // ← AGREGAR TODO ESTE BLOQUE

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.nombre} {user?.apellido}
        </h1>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Totales */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90">Ventas Totales</h3>
          <p className="text-3xl font-bold mt-2">$250,000</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingUp size={16} />
            <span>+15%</span>
          </div>
        </div>

        {/* Productos en Inventario */}
        <div className="bg-gradient-to-br from-secondary-400 to-secondary-500 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90">Productos en Inventario</h3>
          <p className="text-3xl font-bold mt-2">1,200</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingDown size={16} />
            <span>-5%</span>
          </div>
        </div>

        {/* Usuarios Activos */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90">Usuarios Activos</h3>
          <p className="text-3xl font-bold mt-2">350</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingUp size={16} />
            <span>+10%</span>
          </div>
        </div>

        {/* Reseñas Recientes */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-sm font-medium opacity-90">Reseñas Recientes</h3>
          <p className="text-3xl font-bold mt-2">4.8/5</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span>+2%</span>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user?.role === 'ADMIN' && (
            <button className="bg-gray-900 text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm shadow-md">
              Añadir Producto Nuevo
            </button>
          )}
          
          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm">
            Ver Inventario Bajo
          </button>

          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm">
            Procesar Ventas
          </button>

          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm">
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Productos Destacados */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Producto 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Package size={64} className="text-gray-300" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Cama Ortopédica</h3>
              <p className="text-sm text-gray-500 mt-1">Categoría: Camas</p>
              <p className="text-lg font-bold text-primary-600 mt-2">$2,500</p>
            </div>
          </div>

          {/* Producto 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Package size={64} className="text-gray-300" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Cama de Lujo</h3>
              <p className="text-sm text-gray-500 mt-1">Categoría: Camas</p>
              <p className="text-lg font-bold text-primary-600 mt-2">$3,200</p>
            </div>
          </div>

          {/* Producto 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Package size={64} className="text-gray-300" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Almohada Premium</h3>
              <p className="text-sm text-gray-500 mt-1">Categoría: Almohadas</p>
              <p className="text-lg font-bold text-primary-600 mt-2">$180</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}