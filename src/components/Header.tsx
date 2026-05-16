'use client';

import { Search, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
      {/* Buscador */}
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg w-96 border border-gray-200">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Usuario y acciones */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md">
            {user?.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          title="Cerrar sesión"
        >
          <LogOut size={20} className="text-gray-600 group-hover:text-red-600" />
        </button>
      </div>
    </header>
  );
}