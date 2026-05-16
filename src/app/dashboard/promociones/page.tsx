'use client';

import { useState, useEffect } from 'react';
import { 
  getAllOfertas, 
  deleteOferta, 
  toggleOfertaStatus,
  getAllResenias,
  aprobarResenia,
  rechazarResenia,
  deleteResenia,
  getActiveProductos
} from '@/lib/api';
import { Oferta, Resenia, EstadoOferta } from '@/types/promocion';
import { Producto } from '@/types/producto';
import { Search, Tag, Star, Edit, Trash2, Power, Plus, Check, X } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import OfertaModal from '@/components/OfertaModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function PromocionesPage() {
  const [activeTab, setActiveTab] = useState<'ofertas' | 'resenias'>('ofertas');
  
  // Estados para Ofertas
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<Oferta[]>([]);
  const [searchOferta, setSearchOferta] = useState('');
  const [estadoOfertaFilter, setEstadoOfertaFilter] = useState<string>('TODAS');
  
  // Estados para Reseñas
  const [resenias, setResenias] = useState<Resenia[]>([]);
  const [filteredResenias, setFilteredResenias] = useState<Resenia[]>([]);
  const [estadoReseniaFilter, setEstadoReseniaFilter] = useState<string>('PENDIENTES');
  
  // Estados generales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Modals
  const [isOfertaModalOpen, setIsOfertaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
  const [ofertaToDelete, setOfertaToDelete] = useState<Oferta | null>(null);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ofertasData, reseniasData, productosData] = await Promise.all([
        getAllOfertas(),
        getAllResenias(),
        getActiveProductos()
      ]);
      setOfertas(ofertasData);
      setFilteredOfertas(ofertasData);
      setResenias(reseniasData);
      setFilteredResenias(reseniasData.filter(r => !r.aprobado)); // Por defecto pendientes
      setProductos(productosData);
    } catch (error: any) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar Ofertas
  useEffect(() => {
    let filtered = ofertas;

    if (searchOferta) {
      filtered = filtered.filter(o =>
        o.descripcion.toLowerCase().includes(searchOferta.toLowerCase())
      );
    }

    if (estadoOfertaFilter !== 'TODAS') {
      filtered = filtered.filter(o => getEstadoOferta(o) === estadoOfertaFilter);
    }

    setFilteredOfertas(filtered);
  }, [searchOferta, estadoOfertaFilter, ofertas]);

  // Filtrar Reseñas
  useEffect(() => {
    let filtered = resenias;

    if (estadoReseniaFilter === 'PENDIENTES') {
      filtered = filtered.filter(r => !r.aprobado && r.aprobado !== false);
    } else if (estadoReseniaFilter === 'APROBADAS') {
      filtered = filtered.filter(r => r.aprobado === true);
    } else if (estadoReseniaFilter === 'RECHAZADAS') {
      filtered = filtered.filter(r => r.aprobado === false);
    }

    setFilteredResenias(filtered);
  }, [estadoReseniaFilter, resenias]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // ========== OFERTAS ==========
  const getEstadoOferta = (oferta: Oferta): EstadoOferta => {
    const hoy = new Date();
    const inicio = new Date(oferta.fechaInicio);
    const fin = new Date(oferta.fechaFin);

    if (!oferta.activo) return 'INACTIVA';
    if (hoy < inicio) return 'PROGRAMADA';
    if (hoy > fin) return 'VENCIDA';
    return 'ACTIVA';
  };

  const getEstadoBadge = (estado: EstadoOferta) => {
    const colors = {
      ACTIVA: 'bg-green-100 text-green-800',
      PROGRAMADA: 'bg-yellow-100 text-yellow-800',
      VENCIDA: 'bg-red-100 text-red-800',
      INACTIVA: 'bg-gray-100 text-gray-800',
    };
    const icons = {
      ACTIVA: '🟢',
      PROGRAMADA: '🟡',
      VENCIDA: '🔴',
      INACTIVA: '⚫',
    };
    return { color: colors[estado], icon: icons[estado] };
  };

  const handleCreateOferta = () => {
    setSelectedOferta(null);
    setIsOfertaModalOpen(true);
  };

  const handleEditOferta = (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setIsOfertaModalOpen(true);
  };

  const handleDeleteOfertaClick = (oferta: Oferta) => {
    setOfertaToDelete(oferta);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOfertaConfirm = async () => {
    if (!ofertaToDelete) return;

    try {
      await deleteOferta(ofertaToDelete.id);
      showMessage('success', 'Oferta eliminada correctamente');
      loadData();
      setIsDeleteModalOpen(false);
      setOfertaToDelete(null);
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const handleToggleOfertaStatus = async (oferta: Oferta) => {
    try {
      await toggleOfertaStatus(oferta.id);
      showMessage('success', `Oferta ${oferta.activo ? 'desactivada' : 'activada'} correctamente`);
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  // ========== RESEÑAS ==========
  const handleAprobarResenia = async (resenia: Resenia) => {
    try {
      await aprobarResenia(resenia.id);
      showMessage('success', 'Reseña aprobada correctamente');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const handleRechazarResenia = async (resenia: Resenia) => {
    try {
      await rechazarResenia(resenia.id);
      showMessage('success', 'Reseña rechazada correctamente');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const handleDeleteResenia = async (resenia: Resenia) => {
    if (!confirm(`¿Estás seguro de eliminar la reseña de ${resenia.nombreCliente}?`)) return;

    try {
      await deleteResenia(resenia.id);
      showMessage('success', 'Reseña eliminada correctamente');
      loadData();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  const renderStars = (calificacion: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= calificacion ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Promociones' }]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Promociones' }]} />

      {/* Header: Título a la izquierda, Filtros a la derecha en la misma línea */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Título y descripción */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="text-gray-600 mt-1">Gestiona ofertas y reseñas de productos</p>
        </div>
        
        {/* Filtros en una línea - wrap cuando sea necesario */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Búsqueda - Solo visible en tab Ofertas */}
          {activeTab === 'ofertas' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar oferta..."
                value={searchOferta}
                onChange={(e) => setSearchOferta(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Filtro por estado - Dinámico según el tab activo */}
          {activeTab === 'ofertas' ? (
            <select
              value={estadoOfertaFilter}
              onChange={(e) => setEstadoOfertaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="TODAS">Todos los estados</option>
              <option value="ACTIVA">Activas</option>
              <option value="PROGRAMADA">Programadas</option>
              <option value="VENCIDA">Vencidas</option>
              <option value="INACTIVA">Inactivas</option>
            </select>
          ) : (
            <select
              value={estadoReseniaFilter}
              onChange={(e) => setEstadoReseniaFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="TODAS">Todas</option>
              <option value="PENDIENTES">Pendientes</option>
              <option value="APROBADAS">Aprobadas</option>
              <option value="RECHAZADAS">Rechazadas</option>
            </select>
          )}

          {/* Botón Nueva Oferta - Solo visible en tab Ofertas */}
          {activeTab === 'ofertas' && (
            <button
              onClick={handleCreateOferta}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap"
            >
              <Plus size={20} />
              Nueva Oferta
            </button>
          )}
        </div>
      </div>

      {/* Pestañas - Segunda fila */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ofertas')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'ofertas'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag size={20} />
            Ofertas
          </div>
        </button>
        <button
          onClick={() => setActiveTab('resenias')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'resenias'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star size={20} />
            Reseñas
            {resenias.filter(r => !r.aprobado && r.aprobado !== false).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {resenias.filter(r => !r.aprobado && r.aprobado !== false).length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Mensaje de éxito/error */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* ========== CONTENIDO: OFERTAS ========== */}
      {activeTab === 'ofertas' && (
        <div>
          {/* Tabla de Ofertas */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Descuento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Inicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Productos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOfertas.map((oferta) => {
                    const estado = getEstadoOferta(oferta);
                    const badge = getEstadoBadge(estado);
                    return (
                      <tr key={oferta.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {oferta.descripcion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-primary-600">{oferta.descuento}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(oferta.fechaInicio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(oferta.fechaFin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {oferta.productos.length} productos
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.color}`}>
                            {badge.icon} {estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleOfertaStatus(oferta)}
                              className={`${
                                oferta.activo ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                              } transition-colors`}
                              title={oferta.activo ? 'Desactivar' : 'Activar'}
                            >
                              <Power size={18} />
                            </button>
                            <button
                              onClick={() => handleEditOferta(oferta)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteOfertaClick(oferta)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredOfertas.length === 0 && (
                <div className="text-center py-12">
                  <Tag size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No se encontraron ofertas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== CONTENIDO: RESEÑAS ========== */}
      {activeTab === 'resenias' && (
        <div>
          {/* Cards de Reseñas */}
          <div className="grid gap-4">
            {filteredResenias.map((resenia) => (
              <div
                key={resenia.id}
                className={`bg-white rounded-lg border-2 p-6 ${
                  resenia.aprobado === true
                    ? 'border-green-200'
                    : resenia.aprobado === false
                    ? 'border-red-200'
                    : 'border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {resenia.nombreProducto}
                      </h3>
                      <span className="text-sm text-gray-500">
                        por <span className="font-medium">{resenia.nombreCliente}</span>
                      </span>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(resenia.calificacion)}
                      <span className="text-sm font-semibold text-gray-700">
                        {resenia.calificacion}/5
                      </span>
                    </div>

                    {/* Comentario */}
                    {resenia.comentario && (
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        "{resenia.comentario}"
                      </p>
                    )}

                    {/* Fecha */}
                    <p className="text-xs text-gray-500">
                      {new Date(resenia.fecha).toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 ml-4">
                    {resenia.aprobado === null || resenia.aprobado === undefined || (!resenia.aprobado && resenia.aprobado !== false) ? (
                      <>
                        <button
                          onClick={() => handleAprobarResenia(resenia)}
                          className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium"
                        >
                          <Check size={18} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRechazarResenia(resenia)}
                          className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                          <X size={18} />
                          Rechazar
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-center font-medium ${
                            resenia.aprobado
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {resenia.aprobado ? '✅ Aprobada' : '❌ Rechazada'}
                        </span>
                        <button
                          onClick={() => handleDeleteResenia(resenia)}
                          className="text-red-600 hover:text-red-800 transition-colors text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredResenias.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Star size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay reseñas {estadoReseniaFilter.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {isOfertaModalOpen && (
        <OfertaModal
          oferta={selectedOferta}
          productos={productos}
          onClose={() => setIsOfertaModalOpen(false)}
          onSuccess={() => {
            loadData();
            setIsOfertaModalOpen(false);
            showMessage('success', selectedOferta ? 'Oferta actualizada correctamente' : 'Oferta creada correctamente');
          }}
        />
      )}

      {isDeleteModalOpen && ofertaToDelete && (
        <DeleteConfirmModal
          title="Eliminar Oferta"
          message={`¿Estás seguro de que deseas eliminar la oferta "${ofertaToDelete.descripcion}"?`}
          onConfirm={handleDeleteOfertaConfirm}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setOfertaToDelete(null);
          }}
        />
      )}
    </div>
  );
}