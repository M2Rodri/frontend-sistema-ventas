// frontend/src/components/ImageGalleryManager.tsx
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ImagenProducto } from '@/types/imagenProducto';
import { getImagenesProducto, addImagenProducto, deleteImagenProducto, setImagenPrincipal } from '@/lib/api';
import { TrashIcon, StarIcon } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

interface ImageGalleryManagerProps {
  productId: number;
  initialImages: ImagenProducto[];
  onImagesChange: (newImages: ImagenProducto[]) => void; // Callback para notificar cambios al padre
}

const ImageGalleryManager = ({ productId, initialImages, onImagesChange }: ImageGalleryManagerProps) => {
  const [images, setImages] = useState<ImagenProducto[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      // Subir la imagen
      const newImage = await addImagenProducto(productId, file, images.length === 0); // Marcar como principal si es la primera
      // Actualizar estado local
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      // Notificar al componente padre
      onImagesChange(updatedImages);
      // Limpiar input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (idImagen: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      return;
    }
    try {
      await deleteImagenProducto(idImagen);
      const updatedImages = images.filter(img => img.id !== idImagen);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (err) {
      console.error('Error eliminando imagen:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar la imagen.');
    }
  };

  const handleSetAsPrimary = async (idImagen: number) => {
    try {
      await setImagenPrincipal(idImagen, productId);
      const updatedImages = images.map(img => ({
        ...img,
        esPrincipal: img.id === idImagen
      }));
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (err) {
      console.error('Error marcando como principal:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al marcar como principal.');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Imágenes del Producto</h3>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploading}
          className="hidden" // Oculto, se activa con un botón
          id={`file-upload-${productId}`} // ID único para el label
        />
        <label
          htmlFor={`file-upload-${productId}`}
          className={`px-4 py-2 rounded-md cursor-pointer ${
            uploading ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {uploading ? 'Subiendo...' : 'Agregar Imagen'}
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group border rounded-lg overflow-hidden">
            <img
              src={`${BACKEND_URL}${image.urlImagen}`}
              alt={`Imagen del producto ${productId}`}
              className="w-full h-32 object-contain bg-gray-100"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                onClick={() => handleSetAsPrimary(image.id)}
                className={`p-1 rounded-full ${image.esPrincipal ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                title={image.esPrincipal ? 'Imagen principal' : 'Marcar como principal'}
                disabled={image.esPrincipal}
              >
                <StarIcon size={16} />
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Eliminar imagen"
              >
                <TrashIcon size={16} />
              </button>
            </div>
            {image.esPrincipal && (
              <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                Principal
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryManager;
