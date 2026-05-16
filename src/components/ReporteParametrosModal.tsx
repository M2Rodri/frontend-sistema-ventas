'use client';

import { useState } from 'react';
import { X, Calendar, Hash, FileText, Download, Eye, Loader2 } from 'lucide-react';
import { TipoReporte, ConfiguracionReporte, FormatoExportacion } from '@/types/reporte';
import ReporteVistaPrevia from './ReporteVistaPrevia';

interface ReporteParametrosModalProps {
  tipoReporte: TipoReporte;
  configuracion: ConfiguracionReporte;
  onClose: () => void;
}

export default function ReporteParametrosModal({ 
  tipoReporte, 
  configuracion, 
  onClose 
}: ReporteParametrosModalProps) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [limite, setLimite] = useState(10);
  const [formato, setFormato] = useState<FormatoExportacion>('PDF');
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVistaPrevia = () => {
    if (configuracion.requiereFechas && (!fechaInicio || !fechaFin)) {
      alert('Por favor, selecciona el rango de fechas');
      return;
    }
    setMostrarVistaPrevia(true);
  };

  const handleGenerarYDescargar = async () => {
    if (configuracion.requiereFechas && (!fechaInicio || !fechaFin)) {
      alert('Por favor, selecciona el rango de fechas');
      return;
    }

    setLoading(true);
    
    // Simular descarga (aquí iría la llamada al backend para generar PDF/Excel/CSV)
    setTimeout(() => {
      alert(`Reporte "${configuracion.titulo}" generado en formato ${formato} ✅`);
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{configuracion.titulo}</h2>
            <p className="text-sm text-gray-600 mt-1">{configuracion.descripcion}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {!mostrarVistaPrevia ? (
            <>
              {/* Parámetros */}
              <div className="space-y-6">
                {/* Rango de Fechas */}
                {configuracion.requiereFechas && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <Calendar size={18} className="text-primary-600" />
                      Rango de Fechas
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fecha Inicio</label>
                        <input
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fecha Fin</label>
                        <input
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Límite */}
                {configuracion.requiereLimite && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <Hash size={18} className="text-primary-600" />
                      Límite de Resultados
                    </label>
                    <select
                      value={limite}
                      onChange={(e) => setLimite(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={5}>Top 5</option>
                      <option value={10}>Top 10</option>
                      <option value={20}>Top 20</option>
                      <option value={50}>Top 50</option>
                    </select>
                  </div>
                )}

                {/* Formato de Exportación */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <FileText size={18} className="text-primary-600" />
                    Formato de Exportación
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setFormato('PDF')}
                      className={`p-4 border-2 rounded-lg font-medium transition-all ${
                        formato === 'PDF'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">📄</div>
                      PDF
                    </button>
                    <button
                      onClick={() => setFormato('EXCEL')}
                      className={`p-4 border-2 rounded-lg font-medium transition-all ${
                        formato === 'EXCEL'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">📊</div>
                      Excel
                    </button>
                    <button
                      onClick={() => setFormato('CSV')}
                      className={`p-4 border-2 rounded-lg font-medium transition-all ${
                        formato === 'CSV'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">📋</div>
                      CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVistaPrevia}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
                >
                  <Eye size={20} />
                  Vista Previa
                </button>
                <button
                  onClick={handleGenerarYDescargar}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Generar y Descargar
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <ReporteVistaPrevia
              tipoReporte={tipoReporte}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              limite={limite}
              onVolver={() => setMostrarVistaPrevia(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}