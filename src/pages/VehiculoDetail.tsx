import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';
import ImageZoomEcommerce from '../components/ImageZoomEcommerce';
import {
  ChevronLeft, ChevronRight, ArrowLeft,
  CheckCircle2, MessageCircle, Gauge,
  Palette, Settings2, Hash, MapPin, Info,
} from 'lucide-react';
import clsx from 'clsx';

export default function VehiculoDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const found = mockVehiculos.find((v) => v.id === id) ?? null;
    setVehiculo(found);
    setImgIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!vehiculo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-lg">Cargando vehículo…</p>
      </div>
    );
  }

  const formatPrecio = (n: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);

  const whatsappMsg = encodeURIComponent(
    `Hola, estoy interesado en el ${vehiculo.marca} ${vehiculo.modelo} año ${vehiculo.año} que vi en su página por ${formatPrecio(vehiculo.precio)}. Me gustaría agendar una cita para verlo.`
  );
  const whatsappUrl = `https://wa.me/573137148566?text=${whatsappMsg}`;

  const total = vehiculo.urls_imagenes.length;
  const prev = () => setImgIdx((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setImgIdx((i) => (i === total - 1 ? 0 : i + 1));

  const specs = [
    { icon: Gauge,    label: 'Kilometraje',    value: `${vehiculo.kilometraje.toLocaleString('es-CO')} km` },
    { icon: Settings2,label: 'Transmisión',    value: vehiculo.transmision },
    { icon: Palette,  label: 'Color',          value: vehiculo.color },
    { icon: Hash,     label: 'Placa termina en', value: vehiculo.placa_final },
    { icon: MapPin,   label: 'Ciudad',         value: 'Cali, Valle' },
  ];

  return (
    <div className="bg-surface-alt min-h-screen pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Volver */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6"
          aria-label="Volver al catálogo"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna izquierda: galería + descripción ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Carrusel */}
            <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="relative aspect-video bg-surface-alt group">
                <ImageZoomEcommerce
                  src={vehiculo.urls_imagenes[imgIdx]}
                  alt={`Vista ${imgIdx + 1} de ${total} del ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`}
                />

                {total > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface backdrop-blur-sm text-text-main p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface backdrop-blur-sm text-text-main p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist" aria-label="Navegación de imágenes">
                  {vehiculo.urls_imagenes.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={imgIdx === i}
                      aria-label={`Ver imagen ${i + 1}`}
                      onClick={() => setImgIdx(i)}
                      className={clsx(
                        'h-1.5 rounded-full transition-all',
                        imgIdx === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      )}
                    />
                  ))}
                </div>

                {/* Contador */}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {imgIdx + 1} / {total}
                </span>
              </div>

              {/* Miniaturas */}
              {total > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {vehiculo.urls_imagenes.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      aria-label={`Miniatura imagen ${i + 1}`}
                      className={clsx(
                        'flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                        imgIdx === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-90'
                      )}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="bg-surface rounded-2xl shadow-card border border-border p-6">
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
                <Info size={20} className="text-primary" aria-hidden="true" />
                Descripción del Vehículo
              </h2>
              <p className="text-text-muted leading-relaxed whitespace-pre-line">
                {vehiculo.descripcion_marketing}
              </p>
            </div>
          </div>

          {/* ── Columna derecha: precio + ficha + CTA ── */}
          <aside className="space-y-5" aria-label="Información del vehículo y contacto">
            <div className="bg-surface rounded-2xl shadow-card border border-border p-6 sticky top-24">

              {/* Encabezado precio */}
              <div className="pb-5 border-b border-border">
                <h1 className="text-2xl font-bold text-text-main leading-snug">
                  {vehiculo.marca} {vehiculo.modelo}
                </h1>
                <p className="text-text-muted text-sm mt-0.5">
                  {vehiculo.año} &bull; {vehiculo.kilometraje.toLocaleString('es-CO')} km
                </p>
                <p className="text-4xl font-black text-text-main mt-4 tracking-tight">
                  {formatPrecio(vehiculo.precio)}
                </p>
              </div>

              {/* Ficha técnica */}
              <div className="py-5 border-b border-border">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Ficha Técnica
                </h3>
                <dl className="divide-y divide-border">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="spec-row">
                      <dt className="spec-label flex items-center gap-2">
                        <Icon size={14} className="text-primary" aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="spec-value">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Garantías */}
              <ul className="py-5 space-y-2.5 border-b border-border" aria-label="Garantías del servicio">
                {[
                  'Inspección técnica de 150 puntos superada',
                  'Documentos al día, listo para traspaso',
                  'Asesoría gratuita durante toda la compra',
                ].map((g) => (
                  <li key={g} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>

              {/* CTA escritorio */}
              <div className="pt-5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full hidden lg:inline-flex"
                  aria-label={`Contactar asesor por WhatsApp sobre el ${vehiculo.marca} ${vehiculo.modelo}`}
                >
                  <MessageCircle size={22} aria-hidden="true" />
                  Contactar Asesor por WhatsApp
                </a>
                <p className="text-center text-xs text-text-muted mt-3 hidden lg:block">
                  Te respondemos en menos de 5 minutos
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── CTA Flotante Móvil ── */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border lg:hidden z-50 shadow-[0_-4px_20px_hsl(0_0%_0%/0.08)]"
        role="complementary"
        aria-label="Botón de contacto fijo"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full"
          aria-label={`Contactar por WhatsApp sobre ${vehiculo.marca} ${vehiculo.modelo}`}
        >
          <MessageCircle size={22} aria-hidden="true" />
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
