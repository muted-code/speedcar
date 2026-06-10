import { useState } from 'react';
import { Upload, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Vehiculo } from '../types';

export default function AdminUpload() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    precio: '',
    kilometraje: '',
    placa_final: '',
    transmision: 'Automático',
    color: '',
    descripcion_marketing: '', // Si se deja en blanco, la IA lo genera en el BE
    notas_vendedor: '',
    destacado: false,
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Configura aquí la URL de tu backend en Render cuando lo despliegues
  // Ej: https://speedcar-backend.onrender.com
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = imagenes.length + files.length;
      
      if (totalImages > 10) {
        setError('Puedes subir un máximo de 10 imágenes por vehículo.');
        return;
      }
      
      setError('');
      setImagenes((prev) => [...prev, ...files]);
      
      // Crear URLs para previsualización
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      // Liberar memoria del object URL
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (imagenes.length === 0) {
      setError('Debes subir al menos una imagen del vehículo.');
      return;
    }

    // Validación estricta de datos obligatorios
    if (!formData.marca.trim() || !formData.modelo.trim() || !formData.color.trim() || !formData.transmision) {
      setError('Faltan datos obligatorios: Asegúrate de llenar Marca, Modelo, Color y Transmisión.');
      return;
    }

    const precioNum = Number(formData.precio);
    const kmNum = Number(formData.kilometraje);
    const añoNum = Number(formData.año);
    const placaNum = Number(formData.placa_final);

    if (!formData.precio || isNaN(precioNum) || precioNum <= 0) {
      setError('El Precio es inválido. Debe ser un número mayor a 0 sin puntos ni comas.');
      return;
    }
    
    if (formData.kilometraje === '' || isNaN(kmNum) || kmNum < 0) {
      setError('El Kilometraje es inválido. Debe ser un número mayor o igual a 0.');
      return;
    }

    if (!formData.año || isNaN(añoNum) || añoNum < 1900 || añoNum > 2050) {
      setError('El Año es inválido.');
      return;
    }

    if (formData.placa_final === '' || isNaN(placaNum) || placaNum < 0 || placaNum > 9) {
      setError('La Placa Final debe ser un número del 0 al 9.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Crear el vehículo (Datos JSON)
      const vehiculoPayload = {
        ...formData,
        año: Number(formData.año),
        precio: Number(formData.precio),
        kilometraje: Number(formData.kilometraje),
        placa_final: Number(formData.placa_final),
      };

      const vehiculoRes = await fetch(`${BACKEND_URL}/api/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoPayload),
      });

      if (!vehiculoRes.ok) {
        const errorData = await vehiculoRes.json();
        throw new Error(errorData.detail || 'Error al crear el vehículo.');
      }

      const vehiculoCreado: Vehiculo = await vehiculoRes.json();

      // 2. Subir las imágenes
      const formDataImages = new FormData();
      imagenes.forEach((file) => {
        formDataImages.append('files', file);
      });

      const uploadRes = await fetch(`${BACKEND_URL}/api/vehiculos/${vehiculoCreado.id}/imagenes`, {
        method: 'POST',
        body: formDataImages, // No setear Content-Type, fetch lo hace automático con form-data
      });

      if (!uploadRes.ok) {
        throw new Error('Vehículo creado, pero hubo un error al subir las imágenes.');
      }

      setSuccess(true);
      // Resetear form (opcional)
      setImagenes([]);
      setPreviewUrls([]);
      setFormData({
        marca: '', modelo: '', año: new Date().getFullYear(),
        precio: '', kilometraje: '', placa_final: '', transmision: 'Automático',
        color: '', descripcion_marketing: '', notas_vendedor: '', destacado: false,
      });

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
          
          <div className="px-6 py-8 border-b border-border/80 bg-surface-inset">
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Upload className="text-primary" />
              Subir Nuevo Vehículo
            </h1>
            <p className="text-sm text-text-muted mt-2">
              Ingresa los detalles. Si dejas la "Descripción de Marketing" vacía, nuestra IA la redactará automáticamente al guardar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Mensajes de Estado */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex gap-2 items-center">
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium flex gap-2 items-center">
                  <CheckCircle size={18} /> ¡Vehículo publicado exitosamente con sus imágenes comprimidas y descripción (IA)!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Datos Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Marca *</label>
                <input required name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Ej: Mazda" className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Modelo *</label>
                <input required name="modelo" value={formData.modelo} onChange={handleInputChange} placeholder="Ej: CX-30 Grand Touring" className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Año *</label>
                <input required type="number" name="año" value={formData.año} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Precio (COP) *</label>
                <input required type="number" name="precio" value={formData.precio} onChange={handleInputChange} placeholder="Ej: 115000000" className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Kilometraje *</label>
                <input required type="number" name="kilometraje" value={formData.kilometraje} onChange={handleInputChange} placeholder="Ej: 25000" className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Color *</label>
                <input required name="color" value={formData.color} onChange={handleInputChange} placeholder="Ej: Rojo Diamante" className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Transmisión *</label>
                <select name="transmision" value={formData.transmision} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none">
                  <option value="Automático">Automático</option>
                  <option value="Mecánico">Mecánico</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Placa Final (0-9) *</label>
                <input required type="number" min="0" max="9" name="placa_final" value={formData.placa_final} onChange={handleInputChange} placeholder="Ej: 4" className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
            </div>

            {/* Descripciones e IA */}
            <div className="space-y-5 border-t border-border/80 pt-6">
              <h3 className="font-bold text-text-main">Detalles de Marketing (Opcional - IA)</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Notas para la IA (Opcional)</label>
                <textarea name="notas_vendedor" value={formData.notas_vendedor} onChange={handleInputChange} rows={2} placeholder="Ej: Tiene llantas nuevas, mantenimientos solo en concesionario, único dueño..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm" />
                <p className="text-[11px] text-text-muted">Si no escribes una descripción abajo, la IA usará estas notas para redactar un texto vendedor increíble.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Descripción Manual (Opcional)</label>
                <textarea name="descripcion_marketing" value={formData.descripcion_marketing} onChange={handleInputChange} rows={4} placeholder="Deja esto en blanco para que Gemini (IA) redacte la descripción por ti." className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-alt focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-semibold text-text-main">Marcar como Destacado (Aparece primero en el Home)</span>
              </label>
            </div>

            {/* Subida de Imágenes */}
            <div className="space-y-5 border-t border-border/80 pt-6">
              <h3 className="font-bold text-text-main">Imágenes del Vehículo (Obligatorio)</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {previewUrls.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer bg-surface-alt">
                    <Plus size={24} />
                    <span className="text-xs font-bold mt-2">Añadir Foto</span>
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-text-muted">Las imágenes se comprimirán automáticamente a máxima calidad antes de subirse. (Máx 10 fotos).</p>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-border/80">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-primary py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Subiendo Vehículo e Imágenes...
                  </>
                ) : (
                  <>Publicar Vehículo en Inventario</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
