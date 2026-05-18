import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2, MessageCircle, Info } from 'lucide-react';
import clsx from 'clsx';

export default function VehiculoDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Aquí iría la llamada real a Firebase
    const found = mockVehiculos.find(v => v.id === id);
    setVehiculo(found || null);
    window.scrollTo(0, 0);
  }, [id]);

  if (!vehiculo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Cargando vehículo o no encontrado...</p>
      </div>
    );
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(precio);
  };

  const whatsappMessage = `Hola, estoy interesado en el ${vehiculo.marca} ${vehiculo.modelo} año ${vehiculo.año} que vi en su página por ${formatPrecio(vehiculo.precio)}. Me gustaría agendar una cita para verlo.`;
  const whatsappUrl = `https://wa.me/573137148566?text=${encodeURIComponent(whatsappMessage)}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === vehiculo.urls_imagenes.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? vehiculo.urls_imagenes.length - 1 : prev - 1));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Volver al inventario
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Galería y Descripción */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carrusel */}
            <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100">
              <div className="relative aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden group">
                <img 
                  src={vehiculo.urls_imagenes[currentImageIndex]} 
                  alt={`${vehiculo.marca} ${vehiculo.modelo} - Vista ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {vehiculo.urls_imagenes.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehiculo.urls_imagenes.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={clsx(
                        "w-2.5 h-2.5 rounded-full transition-all",
                        currentImageIndex === idx ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Descripción del Vendedor/Marketing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Info size={24} className="mr-2 text-brand-500" />
                Descripción del Vehículo
              </h2>
              <div className="prose text-gray-600 max-w-none">
                <p className="whitespace-pre-line leading-relaxed text-lg">
                  {vehiculo.descripcion_marketing}
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalles y CTA */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                  {vehiculo.marca} {vehiculo.modelo}
                </h1>
                <p className="text-gray-500 text-lg">
                  {vehiculo.año} • {vehiculo.kilometraje.toLocaleString('es-CO')} km
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-black text-gray-900">
                    {formatPrecio(vehiculo.precio)}
                  </span>
                </div>
              </div>

              {/* Ficha Técnica */}
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Ficha Técnica</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Transmisión</p>
                    <p className="font-semibold text-gray-900">{vehiculo.transmision}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-semibold text-gray-900">{vehiculo.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Placa termina en</p>
                    <p className="font-semibold text-gray-900">{vehiculo.placa_final}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ciudad</p>
                    <p className="font-semibold text-gray-900">Cali</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <CheckCircle2 size={20} className="text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">Inspección técnica de 150 puntos superada.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 size={20} className="text-brand-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">Papeles al día, listo para traspaso.</p>
                </div>
              </div>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-[#25D366]/20 hidden lg:flex"
              >
                <MessageCircle size={24} />
                Contactar Asesor por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Botón CTA Flotante en Celular */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:hidden z-40">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] active:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          <MessageCircle size={24} />
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
