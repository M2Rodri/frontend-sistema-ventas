'use client';

import { useState } from 'react';
import { X, Bell, Mail, Clock, AlertCircle } from 'lucide-react';

interface ConfigurarNotificacionesModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConfigurarNotificacionesModal({ onClose, onSuccess }: ConfigurarNotificacionesModalProps) {
  const [enviarCorreo, setEnviarCorreo] = useState(true);
  const [correos, setCorreos] = useState<string[]>(['admin@muebleriagalaxia.com']);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [frecuencia, setFrecuencia] = useState<'INMEDIATA' | 'DIARIA' | 'SEMANAL'>('INMEDIATA');
  const [error, setError] = useState<string | null>(null);

  const handleAgregarCorreo = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!nuevoCorreo.trim()) {
      setError('Ingrese una dirección de correo');
      return;
    }
    
    if (!emailRegex.test(nuevoCorreo)) {
      setError('Una o más direcciones de correo no son válidas');
      return;
    }
    
    if (correos.includes(nuevoCorreo)) {
      setError('Este correo ya está en la lista');
      return;
    }
    
    setCorreos([...correos, nuevoCorreo]);
    setNuevoCorreo('');
    setError(null);
  };

  const handleEliminarCorreo = (email: string) => {
    setCorreos(correos.filter(c => c !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enviarCorreo && correos.length === 0) {
      setError('Debe agregar al menos un correo destinatario');
      return;
    }
    
    // SIMULACIÓN - No hace nada real
    console.log('Notificaciones configuradas (simulado):', { enviarCorreo, correos, frecuencia });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50">
          <div className="flex items-center gap-3">
            <Bell className="text-purple-600" size={28} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configurar Notificaciones</h2>
              <p className="text-sm text-gray-600">Alertas automáticas de stock bajo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Activar/Desactivar Correos */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-600" size={24} />
              <div>
                <p className="font-medium text-gray-900">Enviar correo electrónico cuando hay alertas</p>
                <p className="text-sm text-gray-600">Recibe notificaciones por email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enviarCorreo}
                onChange={(e) => setEnviarCorreo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Correos Destinatarios */}
          {enviarCorreo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correos Destinatarios <span className="text-red-500">*</span>
              </label>
              
              {/* Lista de correos */}
              <div className="space-y-2 mb-3">
                {correos.map((email, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-700">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleEliminarCorreo(email)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Agregar nuevo correo */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAgregarCorreo())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ejemplo@correo.com"
                />
                <button
                  type="button"
                  onClick={handleAgregarCorreo}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          )}

          {/* Frecuencia de Notificación */}
          {enviarCorreo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Clock className="inline mr-2" size={18} />
                Frecuencia de Notificación <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFrecuencia('INMEDIATA')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    frecuencia === 'INMEDIATA'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="text-lg font-bold mb-1">⚡</p>
                  <p className="text-sm">Inmediata</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFrecuencia('DIARIA')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    frecuencia === 'DIARIA'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="text-lg font-bold mb-1">📅</p>
                  <p className="text-sm">Diaria</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFrecuencia('SEMANAL')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    frecuencia === 'SEMANAL'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="text-lg font-bold mb-1">📆</p>
                  <p className="text-sm">Semanal</p>
                </button>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}