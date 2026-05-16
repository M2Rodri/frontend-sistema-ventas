'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { createCompra } from '@/lib/api';
import { CompraRequest } from '@/types/proveedor';

interface CompraModalProps {
  idProveedor: number;
  nombreProveedor: string;
  onClose: () => void;
  onSuccess: () => void;
  idUsuarioActual: number;
}

export default function CompraModal({ 
  idProveedor, 
  nombreProveedor, 
  onClose, 
  onSuccess, 
  idUsuarioActual 
}: CompraModalProps) {
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Se envía un array vacío de items (sin productos)
      const compraData: CompraRequest = {
        idProveedor,
        notas: notas.trim() || undefined,
        items: [] // Sin productos
      };

      await createCompra(compraData, idUsuarioActual);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registrar Compra</h2>
            <p className="text-sm text-gray-600 mt-1">Proveedor: <strong>{nombreProveedor}</strong></p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-lg">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Notas / Observaciones */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas / Observaciones
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Información adicional sobre esta compra..."
            />
            <p className="text-xs text-gray-500 mt-1">{notas.length}/500 caracteres</p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}