'use client';

import { useState, useEffect } from 'react';
import { 
  getAllConfiguraciones, 
  updateValorByClave,
  getUltimasAuditorias,
  getAllAuditorias,
  getAuditoriasByUsuario,
  getAuditoriasByTabla,
  getAuditoriasByAccion,
  getAllUsers
} from '@/lib/api';
import { Configuracion, Auditoria } from '@/types/configuracion';
import { User } from '@/lib/api';
import { Settings, Building2, Mail, Shield, Search, Eye } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuditoriaDetalleModal from '@/components/AuditoriaDetalleModal';

type TabType = 'general' | 'empresa' | 'email' | 'auditoria';

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estados para formularios
  const [configGeneral, setConfigGeneral] = useState({
    nombre_sistema: '',
    zona_horaria: 'America/La_Paz',
    moneda: 'BOB',
    stock_minimo_defecto: '5',
    modo_mantenimiento: 'false',
    permitir_registro: 'true',
    mostrar_precios_sin_login: 'true',
  });

  const [configEmpresa, setConfigEmpresa] = useState({
    empresa_razon_social: '',
    empresa_nit: '',
    empresa_direccion: '',
    empresa_telefono: '',
    empresa_email: '',
    empresa_sitio_web: '',
  });

  const [configEmail, setConfigEmail] = useState({
    smtp_servidor: 'smtp.gmail.com',
    smtp_puerto: '587',
    smtp_usuario: '',
    smtp_password: '',
    email_remitente: '',
    email_nombre_remitente: '',
    email_enviar_bienvenida: 'true',
    email_enviar_notificacion_envio: 'true',
  });

  // Filtros de auditoría
  const [searchAuditoria, setSearchAuditoria] = useState('');
  const [usuarioFilter, setUsuarioFilter] = useState<string>('TODOS');
  const [accionFilter, setAccionFilter] = useState<string>('TODAS');
  const [tablaFilter, setTablaFilter] = useState<string>('TODAS');

  // Modal
  const [selectedAuditoria, setSelectedAuditoria] = useState<Auditoria | null>(null);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configsData, auditoriasData, usuariosData] = await Promise.all([
        getAllConfiguraciones(),
        getUltimasAuditorias(),
        getAllUsers()
      ]);
      
      setConfiguraciones(configsData);
      setAuditorias(auditoriasData);
      setFilteredAuditorias(auditoriasData);
      setUsuarios(usuariosData);
      
      // Mapear configuraciones a estados
      mapConfiguraciones(configsData);
    } catch (error: any) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const mapConfiguraciones = (configs: Configuracion[]) => {
    const configMap: { [key: string]: string } = {};
    configs.forEach(c => {
      configMap[c.clave] = c.valor;
    });

    // General
    setConfigGeneral({
      nombre_sistema: configMap['nombre_sistema'] || 'Mueblería Edén',
      zona_horaria: configMap['zona_horaria'] || 'America/La_Paz',
      moneda: configMap['moneda'] || 'BOB',
      stock_minimo_defecto: configMap['stock_minimo_defecto'] || '5',
      modo_mantenimiento: configMap['modo_mantenimiento'] || 'false',
      permitir_registro: configMap['permitir_registro'] || 'true',
      mostrar_precios_sin_login: configMap['mostrar_precios_sin_login'] || 'true',
    });

    // Empresa
    setConfigEmpresa({
      empresa_razon_social: configMap['empresa_razon_social'] || '',
      empresa_nit: configMap['empresa_nit'] || '',
      empresa_direccion: configMap['empresa_direccion'] || '',
      empresa_telefono: configMap['empresa_telefono'] || '',
      empresa_email: configMap['empresa_email'] || '',
      empresa_sitio_web: configMap['empresa_sitio_web'] || '',
    });

    // Email
    setConfigEmail({
      smtp_servidor: configMap['smtp_servidor'] || 'smtp.gmail.com',
      smtp_puerto: configMap['smtp_puerto'] || '587',
      smtp_usuario: configMap['smtp_usuario'] || '',
      smtp_password: configMap['smtp_password'] || '',
      email_remitente: configMap['email_remitente'] || '',
      email_nombre_remitente: configMap['email_nombre_remitente'] || '',
      email_enviar_bienvenida: configMap['email_enviar_bienvenida'] || 'true',
      email_enviar_notificacion_envio: configMap['email_enviar_notificacion_envio'] || 'true',
    });
  };

  // Filtrar auditorías
  useEffect(() => {
    let filtered = auditorias;

    if (searchAuditoria) {
      filtered = filtered.filter(a =>
        a.nombreUsuario.toLowerCase().includes(searchAuditoria.toLowerCase()) ||
        a.accion.toLowerCase().includes(searchAuditoria.toLowerCase()) ||
        a.tablaAfectada.toLowerCase().includes(searchAuditoria.toLowerCase())
      );
    }

    if (usuarioFilter !== 'TODOS') {
      filtered = filtered.filter(a => a.idUsuario === parseInt(usuarioFilter));
    }

    if (accionFilter !== 'TODAS') {
      filtered = filtered.filter(a => a.accion === accionFilter);
    }

    if (tablaFilter !== 'TODAS') {
      filtered = filtered.filter(a => a.tablaAfectada === tablaFilter);
    }

    setFilteredAuditorias(filtered);
  }, [searchAuditoria, usuarioFilter, accionFilter, tablaFilter, auditorias]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Actualizar cada configuración
      for (const [clave, valor] of Object.entries(configGeneral)) {
        await updateValorByClave(clave, valor);
      }
      showMessage('success', 'Configuraciones generales guardadas correctamente');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const [clave, valor] of Object.entries(configEmpresa)) {
        await updateValorByClave(clave, valor);
      }
      showMessage('success', 'Datos de empresa guardados correctamente');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const [clave, valor] of Object.entries(configEmail)) {
        await updateValorByClave(clave, valor);
      }
      showMessage('success', 'Configuración de email guardada correctamente');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = () => {
    showMessage('success', '✉️ Email de prueba enviado correctamente (simulado)');
  };

  const handleVerDetalle = (auditoria: Auditoria) => {
    setSelectedAuditoria(auditoria);
    setIsDetalleModalOpen(true);
  };

  const getAccionBadge = (accion: string) => {
    const colors: { [key: string]: string } = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
    };
    return colors[accion] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtener tablas únicas
  const tablasUnicas = Array.from(new Set(auditorias.map(a => a.tablaAfectada))).sort();
  const accionesUnicas = Array.from(new Set(auditorias.map(a => a.accion))).sort();

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Configuración' }]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Configuración' }]} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-1">Ajustes generales y mantenimiento</p>
      </div>

      {/* Mensaje de éxito/error */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Pestañas */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'general'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={20} />
            General
          </div>
        </button>
        <button
          onClick={() => setActiveTab('empresa')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'empresa'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 size={20} />
            Tienda
          </div>
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'email'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail size={20} />
            Email
          </div>
        </button>
        <button
          onClick={() => setActiveTab('auditoria')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'auditoria'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield size={20} />
            Auditoría
          </div>
        </button>
      </div>

      {/* ========== PESTAÑA: GENERAL ========== */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sistema
              </label>
              <input
                type="text"
                value={configGeneral.nombre_sistema}
                onChange={(e) => setConfigGeneral({ ...configGeneral, nombre_sistema: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona Horaria
                </label>
                <select
                  value={configGeneral.zona_horaria}
                  onChange={(e) => setConfigGeneral({ ...configGeneral, zona_horaria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="America/La_Paz">América/La Paz (BOT)</option>
                  <option value="America/Buenos_Aires">América/Buenos Aires</option>
                  <option value="America/Lima">América/Lima</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  value={configGeneral.moneda}
                  onChange={(e) => setConfigGeneral({ ...configGeneral, moneda: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="BOB">Bs. - Bolivianos</option>
                  <option value="USD">$ - Dólares</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo por Defecto
              </label>
              <input
                type="number"
                min="0"
                value={configGeneral.stock_minimo_defecto}
                onChange={(e) => setConfigGeneral({ ...configGeneral, stock_minimo_defecto: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-3 border-t pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configGeneral.modo_mantenimiento === 'true'}
                  onChange={(e) => setConfigGeneral({ ...configGeneral, modo_mantenimiento: e.target.checked ? 'true' : 'false' })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Modo Mantenimiento</span>
                  <p className="text-xs text-gray-500">Desactiva temporalmente la tienda virtual</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configGeneral.permitir_registro === 'true'}
                  onChange={(e) => setConfigGeneral({ ...configGeneral, permitir_registro: e.target.checked ? 'true' : 'false' })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-900">Permitir registro de clientes</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configGeneral.mostrar_precios_sin_login === 'true'}
                  onChange={(e) => setConfigGeneral({ ...configGeneral, mostrar_precios_sin_login: e.target.checked ? 'true' : 'false' })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-900">Mostrar precios sin iniciar sesión</span>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== PESTAÑA: EMPRESA ========== */}
      {activeTab === 'empresa' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSaveEmpresa} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón Social
                </label>
                <input
                  type="text"
                  value={configEmpresa.empresa_razon_social}
                  onChange={(e) => setConfigEmpresa({ ...configEmpresa, empresa_razon_social: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIT
                </label>
                <input
                  type="text"
                  value={configEmpresa.empresa_nit}
                    onChange={(e) => setConfigEmpresa({ ...configEmpresa, empresa_nit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={configEmpresa.empresa_direccion}
                onChange={(e) => setConfigEmpresa({ ...configEmpresa, empresa_direccion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={configEmpresa.empresa_telefono}
                  onChange={(e) => setConfigEmpresa({ ...configEmpresa, empresa_telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={configEmpresa.empresa_email}
                  onChange={(e) => setConfigEmpresa({ ...configEmpresa, empresa_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                value={configEmpresa.empresa_sitio_web}
                onChange={(e) => setConfigEmpresa({ ...configEmpresa, empresa_sitio_web: e.target.value })}
                placeholder="https://www.ejemplo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== PESTAÑA: EMAIL ========== */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSaveEmail} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración SMTP</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={configEmail.smtp_servidor}
                  onChange={(e) => setConfigEmail({ ...configEmail, smtp_servidor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puerto
                </label>
                <input
                  type="text"
                  value={configEmail.smtp_puerto}
                  onChange={(e) => setConfigEmail({ ...configEmail, smtp_puerto: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario SMTP
                </label>
                <input
                  type="text"
                  value={configEmail.smtp_usuario}
                  onChange={(e) => setConfigEmail({ ...configEmail, smtp_usuario: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña SMTP
                </label>
                <input
                  type="password"
                  value={configEmail.smtp_password}
                  onChange={(e) => setConfigEmail({ ...configEmail, smtp_password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Remitente</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Remitente
                  </label>
                  <input
                    type="email"
                    value={configEmail.email_remitente}
                    onChange={(e) => setConfigEmail({ ...configEmail, email_remitente: e.target.value })}
                    placeholder="noreply@tucamas.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de Remitente
                  </label>
                  <input
                    type="text"
                    value={configEmail.email_nombre_remitente}
                    onChange={(e) => setConfigEmail({ ...configEmail, email_nombre_remitente: e.target.value })}
                    placeholder="Mueblería Edén"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Envío</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configEmail.email_enviar_bienvenida === 'true'}
                    onChange={(e) => setConfigEmail({ ...configEmail, email_enviar_bienvenida: e.target.checked ? 'true' : 'false' })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Enviar email de bienvenida</span>
                    <p className="text-xs text-gray-500">A nuevos clientes registrados</p>
                  </div>
                </label>


                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configEmail.email_enviar_notificacion_envio === 'true'}
                    onChange={(e) => setConfigEmail({ ...configEmail, email_enviar_notificacion_envio: e.target.checked ? 'true' : 'false' })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Enviar notificación de envío</span>
                    <p className="text-xs text-gray-500">Con información de seguimiento</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={handleTestEmail}
                className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                🧪 Enviar Email de Prueba
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== PESTAÑA: AUDITORÍA ========== */}
      {activeTab === 'auditoria' && (
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro de Actividades del Sistema</h3>
            
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchAuditoria}
                  onChange={(e) => setSearchAuditoria(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Filtro por usuario */}
              <select
                value={usuarioFilter}
                onChange={(e) => setUsuarioFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="TODOS">Todos los usuarios</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombreCompleto}</option>
                ))}
              </select>

              {/* Filtro por acción */}
              <select
                value={accionFilter}
                onChange={(e) => setAccionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="TODAS">Todas las acciones</option>
                {accionesUnicas.map(accion => (
                  <option key={accion} value={accion}>{accion}</option>
                ))}
              </select>

              {/* Filtro por tabla */}
              <select
                value={tablaFilter}
                onChange={(e) => setTablaFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="TODAS">Todas las tablas</option>
                {tablasUnicas.map(tabla => (
                  <option key={tabla} value={tabla}>{tabla}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de Auditoría */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tabla</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAuditorias.map((auditoria) => (
                    <tr key={auditoria.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{auditoria.nombreUsuario}</div>
                        {auditoria.idUsuario && (
                          <div className="text-xs text-gray-500">ID: {auditoria.idUsuario}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAccionBadge(auditoria.accion)}`}>
                          {auditoria.accion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {auditoria.tablaAfectada}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(auditoria.fechaHora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {auditoria.ipDispositivo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleVerDetalle(auditoria)}
                          className="text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-1"
                        >
                          <Eye size={18} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAuditorias.length === 0 && (
                <div className="text-center py-12">
                  <Shield size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No se encontraron registros de auditoría</p>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Nota:</strong> Los registros de auditoría son inmutables y no se pueden eliminar. 
              Se muestran las últimas 100 actividades.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Detalle */}
      {isDetalleModalOpen && selectedAuditoria && (
        <AuditoriaDetalleModal
          auditoria={selectedAuditoria}
          onClose={() => {
            setIsDetalleModalOpen(false);
            setSelectedAuditoria(null);
          }}
        />
      )}
    </div>
  );
}