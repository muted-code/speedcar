import { Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { Gauge, MessageCircle, MapPin, Zap } from 'lucide-react';
import clsx from 'clsx';
import MicroScaleFade from './animations/MicroScaleFade';

interface Props {
  vehiculo: Vehiculo;
  /** Índice para animación escalonada */
  index?: number;
}

export default function TarjetaVehiculo({ vehiculo, index = 0 }: Props) {
  const formatPrecio = (precio: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(precio);

  const whatsappMsg = encodeURIComponent(
    `Hola, estoy interesado en el ${vehiculo.marca} ${vehiculo.modelo} año ${vehiculo.año} que vi en su página por ${formatPrecio(vehiculo.precio)}. Me gustaría agendar una cita para verlo.`
  );
  const whatsappUrl = `https://wa.me/573137148566?text=${whatsappMsg}`;

  const imagenPrincipal = vehiculo.urls_imagenes[0] ?? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      className="card flex flex-col h-full animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-label={`Vehículo: ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`}
    >
      {/* ── Imagen ── */}
      <Link
        to={`/vehiculo/${vehiculo.id}`}
        className="relative block aspect-video overflow-hidden bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Ver detalle de ${vehiculo.marca} ${vehiculo.modelo}`}
        tabIndex={0}
      >
        <img
          src={imagenPrincipal}
          alt={`Fotografía de ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año} en color ${vehiculo.color}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Badges superpuestos */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehiculo.destacado && (
            <span className="badge-primary flex items-center gap-1">
              <Zap size={11} aria-hidden="true" />
              Destacado
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="badge-muted bg-black/60 text-white border-0 backdrop-blur-sm">
            Placa ···{vehiculo.placa_final}
          </span>
        </div>
        {/* Gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </Link>

      {/* ── Contenido ── */}
      <div className="flex flex-col flex-grow p-5 gap-3">

        {/* Encabezado */}
        <div>
          <Link to={`/vehiculo/${vehiculo.id}`}>
            <h2 className="font-semibold text-lg text-text-main leading-snug line-clamp-1 hover:text-primary transition-colors">
              {vehiculo.marca} {vehiculo.modelo}
            </h2>
          </Link>
          <p className="text-sm text-text-muted mt-0.5">
            {vehiculo.año} &bull; {vehiculo.transmision}
          </p>
        </div>

        {/* Especificaciones rápidas */}
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Gauge size={15} className="text-primary flex-shrink-0" aria-hidden="true" />
            <span>{vehiculo.kilometraje.toLocaleString('es-CO')} km</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} className="text-primary flex-shrink-0" aria-hidden="true" />
            <span>Cali, Valle</span>
          </span>
        </div>

        {/* Precio + CTA */}
        <div
          className={clsx(
            'mt-auto pt-3 border-t border-border flex flex-col gap-3'
          )}
        >
          <MicroScaleFade delay={index * 80 + 200}>
            <p className="text-2xl font-extrabold text-text-main tracking-tight">
              {formatPrecio(vehiculo.precio)}
            </p>
          </MicroScaleFade>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !py-3 w-full"
            aria-label={`Contactar por WhatsApp sobre el ${vehiculo.marca} ${vehiculo.modelo}`}
          >
            <MessageCircle size={20} aria-hidden="true" />
            Me interesa este carro
          </a>
        </div>
      </div>
    </article>
  );
}
