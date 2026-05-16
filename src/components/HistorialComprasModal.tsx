'use client';

import React, { useState, useEffect } from 'react';
import { X, User, ShoppingBag, AlertCircle } from 'lucide-react';
import { ClienteResponse } from '@/types/cliente';
import { getClienteById } from '@/lib/api';

interface HistorialComprasModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: number;
}

/**
 * Modal para Historial de Compras del Cliente
 * Funcionalidad en desarrollo
 */
export default function HistorialComprasModal({
  isOpen,
  onClose,
  clienteId,
}: HistorialComprasModalProps) {
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && clienteId) {
      loadCliente();
    }
  }, [isOpen, clienteId]);

  const loadCliente = async () => {
    setLoading(true);
    try {
      const data = await getClienteById(clienteId);
      setCliente(data);
    } catch (err) {
      console.error('Error al cargar cliente:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  if (loading || !cliente) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Cargando información del cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="text-blue-600" size={28} />
              Historial de Compras
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cliente: <span className="font-semibold">{cliente.nombreCompleto}</span> (ID: #{cliente.id})
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información del Cliente */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <User className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Información del Cliente
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                  <div>
                    <span className="font-medium">Teléfono:</span> {cliente.celular}
                  </div>
                  {cliente.correo && (
                    <div>
                      <span className="font-medium">Correo:</span> {cliente.correo}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Tipo:</span>{' '}
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        cliente.tipo === 'REGISTRADO'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cliente.tipo}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Registro:</span>{' '}
                    {new Date(cliente.fechaRegistro).toLocaleDateString('es-BO')}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Placeholder visual */}
            <div className="w-full max-w-2xl opacity-30">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botón cerrar */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
  );
}