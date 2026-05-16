'use client';

import { useState } from 'react';
import { X, History, Filter, Calendar, Download, AlertCircle } from 'lucide-react';
import { Inventario } from '@/types/inventario';
import React from 'react';

interface HistorialProductoModalProps {
  inventario: Inventario;
  onClose: () => void;
}

export default function HistorialProductoModal({ inventario, onClose }: HistorialProductoModalProps) {
  const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Datos simulados
  const movimientos = [
    {
      id: 1,
      fecha: '2024-01-15 14:30:25',
      tipo: 'ENTRADA',
      motivo: 'Compra a proveedor',
      cantidad: 10,
      stockAnterior: 5,
      stockNuevo: 15,
      usuario: 'Juan Pérez',
      observaciones: 'Compra de emergencia por alta demanda',
      ip: '192.168.1.100',
      referencia: 'COMPRA-2024-001'
    },
    {
      id: 2,
      fecha: '2024-01-14 10:15:40',
      tipo: 'SALIDA',
      motivo: 'Venta',
      cantidad: 5,
      stockAnterior: 15,
      stockNuevo: 10,
      usuario: 'María López',
      observaciones: 'Venta a cliente mayorista',
      ip: '192.168.1.105',
      referencia: 'VENTA-2024-0045'
    },
    {
      id: 3,
      fecha: '2024-01-13 16:45:10',
      tipo: 'ENTRADA',
      motivo: 'Devolución de cliente',
      cantidad: 2,
      stockAnterior: 10,
      stockNuevo: 12,
      usuario: 'Carlos Ruiz',
      observaciones: 'Cliente devolvió producto por cambio de modelo',
      ip: '192.168.1.102',
      referencia: 'DEVOL-2024-003'
    },
    {
      id: 4,
      fecha: '2024-01-12 09:00:55',
      tipo: 'SALIDA',
      motivo: 'Ajuste por inventario físico',
      cantidad: 3,
      stockAnterior: 12,
      stockNuevo: 9,
      usuario: 'Admin Sistema',
      observaciones: 'Diferencia encontrada en conteo físico',
      ip: '192.168.1.1',
      referencia: 'AJUSTE-2024-007'
    },
    {
      id: 5,
      fecha: '2024-01-11 11:20:30',
      tipo: 'ENTRADA',
      motivo: 'Compra a proveedor',
      cantidad: 20,
      stockAnterior: 9,
      stockNuevo: 29,
      usuario: 'Juan Pérez',
      ip: '192.168.1.100',
      referencia: 'COMPRA-2024-002'
    },
  ];

  const filteredMovimientos = movimientos.filter(mov => {
    // Filtro por tipo
    if (tipoFiltro !== 'TODOS' && mov.tipo !== tipoFiltro) return false;
    
    // Filtro por fechas
    if (fechaDesde && fechaHasta) {
      const fechaMov = new Date(mov.fecha);
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      
      if (desde > hasta) {
        setError('La fecha inicial no puede ser posterior a la fecha final');
        return true;}
  
  if (fechaMov < desde || fechaMov > hasta) return false;
}

return true; });
// Estadísticas
const totalEntradas = movimientos.filter(m => m.tipo === 'ENTRADA').reduce((sum, m) => sum + m.cantidad, 0);
const totalSalidas = movimientos.filter(m => m.tipo === 'SALIDA').reduce((sum, m) => sum + m.cantidad, 0);
const ultimoMovimiento = movimientos[0]?.fecha || 'N/A';
const handleLimpiarFiltros = () => {
setTipoFiltro('TODOS');
setFechaDesde('');
setFechaHasta('');
setError(null);
};
const handleExportar = () => {
// SIMULACIÓN - Solo muestra mensaje
alert('Archivo exportado: Historial_Inventario_' + inventario.skuProducto + '_' + new Date().toISOString().split('T')[0] + '.xlsx');
};
return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
{/* Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
<div className="flex items-center gap-3">
<History className="text-gray-600" size={28} />
<div>
<h2 className="text-xl font-bold text-gray-900">Historial de Inventario</h2>
<p className="text-sm text-gray-600">
{inventario.nombreProducto} <span className="text-gray-400">({inventario.skuProducto})</span>
</p>
<p className="text-sm text-gray-600 mt-1">
<strong>Stock actual:</strong> {inventario.cantidadDisponible} unidades
</p>
</div>
</div>
<button
         onClick={onClose}
         className="text-gray-400 hover:text-gray-600 transition-colors"
       >
<X size={24} />
</button>
</div>
    {/* Estadísticas */}
    <div className="p-6 bg-blue-50 border-b border-blue-200">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total de Entradas</p>
          <p className="text-2xl font-bold text-green-600">+{totalEntradas}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total de Salidas</p>
          <p className="text-2xl font-bold text-red-600">-{totalSalidas}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Último Movimiento</p>
          <p className="text-lg font-semibold text-gray-900">{new Date(ultimoMovimiento).toLocaleDateString('es-BO')}</p>
        </div>
      </div>
    </div>

    {/* Filtros */}
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros de Búsqueda</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tipo de Movimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Movimiento
          </label>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="TODOS">Todos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SALIDA">Salidas</option>
          </select>
        </div>

        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Desde
          </label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => {
              setFechaDesde(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Hasta
          </label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => {
              setFechaHasta(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleLimpiarFiltros}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={handleExportar}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>
    </div>

    {/* Tabla de Historial */}
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Anterior</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Después</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            // ✅ CORRECTO
            {filteredMovimientos.map((mov) => (
            <React.Fragment key={mov.id}>
                <tr
                onClick={() => setExpandedRow(expandedRow === mov.id ? null : mov.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {mov.fecha}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {mov.tipo}
                    </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mov.motivo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}>
                    {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                    </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {mov.stockAnterior}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                    {mov.stockNuevo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {mov.usuario}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                    <span className="line-clamp-1">{mov.observaciones || '-'}</span>
                </td>
                </tr>

                {/* Fila expandida */}
                {expandedRow === mov.id && (
                <tr className="bg-blue-50">
                    <td colSpan={8} className="px-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                        <p className="font-semibold text-gray-700 mb-1">Datos del Usuario:</p>
                        <p className="text-gray-600">Usuario: <strong>{mov.usuario}</strong></p>
                        <p className="text-gray-600">Dirección IP: <strong>{mov.ip}</strong></p>
                        </div>
                        <div>
                        <p className="font-semibold text-gray-700 mb-1">Detalles Completos:</p>
                        <p className="text-gray-600">Motivo: <strong>{mov.motivo}</strong></p>
                        <p className="text-gray-600">Observaciones: <strong>{mov.observaciones}</strong></p>
                        <p className="text-gray-600">Referencia: <strong>{mov.referencia}</strong></p>
                        </div>
                    </div>
                    </td>
                </tr>
                )}
            </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredMovimientos.length === 0 && (
          <div className="text-center py-12 border border-gray-200 rounded-lg mt-4">
            <History size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {tipoFiltro !== 'TODOS' || fechaDesde || fechaHasta
                ? 'No hay movimientos con los filtros seleccionados'
                : 'Este producto no tiene movimientos en el historial'}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <button
        onClick={onClose}
        className="w-full px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        Cerrar
      </button>
    </div>
  </div>
</div>
);
}