import { Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { Gauge, MessageCircle, MapPin, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import MicroScaleFade from './animations/MicroScaleFade';

import { motion } from 'motion/react';

interface Props {
  vehiculo: Vehiculo;
  /** Índice para animación escalonada */
  index?: number;
}

/**
 * Helper para verificar el Pico y Placa de Cali en tiempo real.
 * lunes: 1 y 2 | martes: 3 y 4 | miércoles: 5 y 6 | jueves: 7 y 8 | viernes: 9 y 0
 */
function getPicoYPlacaCali(placaFinal: number) {
  const ahora = new Date();
  const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const hora = ahora.getHours();
  
  // Rango de restricción: Lunes a Viernes de 6:00 a.m. a 8:00 p.m.
  const enHorarioRestriccion = hora >= 6 && hora < 20;

  const mapping: Record<number, number[]> = {
    1: [1, 2], // Lunes
    2: [3, 4], // Martes
    3: [5, 6], // Miércoles
    4: [7, 8], // Jueves
    5: [9, 0], // Viernes
  };

  const digitosRestringidos = mapping[diaSemana] || [];
  const aplicaHoy = digitosRestringidos.includes(placaFinal);
  const restringidoAhora = aplicaHoy && enHorarioRestriccion;

  const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  return {
    aplicaHoy,
    restringidoAhora,
    diaNombre: nombresDias[diaSemana],
    digitosHoy: digitosRestringidos.join(' y ')
  };
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
  
  const pyPInfo = getPicoYPlacaCali(vehiculo.placa_final);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: ((index || 0) % 6) * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="card flex flex-col h-full border border-border/85 bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 group"
      aria-label={`Vehículo: ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`}
    >
      {/* ── Imagen y Badges ── */}
      <Link
        to={`/vehiculo/${vehiculo.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {vehiculo.destacado && (
            <span className="badge-primary flex items-center gap-1 shadow-sm">
              <Zap size={11} aria-hidden="true" />
              Destacado
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm border border-emerald-400/20">
            <ShieldCheck size={11} aria-hidden="true" />
            Garantizado
          </span>
        </div>

        {/* Validador Caleño de Pico y Placa */}
        <div className="absolute bottom-3 right-3">
          <div className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md shadow-sm border",
            pyPInfo.restringidoAhora 
              ? "bg-red-500/90 text-white border-red-400/20"
              : pyPInfo.aplicaHoy 
                ? "bg-amber-500/90 text-white border-amber-400/20"
                : "bg-black/60 text-white border-white/10"
          )}>
            <span className="relative flex h-2 w-2">
              <span className={clsx(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                pyPInfo.restringidoAhora 
                  ? "bg-red-200" 
                  : pyPInfo.aplicaHoy 
                    ? "bg-amber-200" 
                    : "bg-emerald-400"
              )}></span>
              <span className={clsx(
                "relative inline-flex rounded-full h-2 w-2",
                pyPInfo.restringidoAhora 
                  ? "bg-red-100" 
                  : pyPInfo.aplicaHoy 
                    ? "bg-amber-100" 
                    : "bg-emerald-500"
              )}></span>
            </span>
            <span>Placa: ···{vehiculo.placa_final}</span>
          </div>
        </div>

        {/* Gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
      </Link>

      {/* ── Contenido ── */}
      <div className="flex flex-col flex-grow p-5 gap-3.5 bg-surface">

        {/* Encabezado */}
        <div>
          <Link to={`/vehiculo/${vehiculo.id}`}>
            <h2 className="font-bold text-lg text-text-main leading-snug line-clamp-1 hover:text-primary transition-colors font-display">
              {vehiculo.marca} {vehiculo.modelo}
            </h2>
          </Link>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">
            Modelo {vehiculo.año} &bull; {vehiculo.transmision}
          </p>
        </div>

        {/* Ficha de Tablero Digital */}
        <div className="grid grid-cols-2 gap-2 bg-surface-alt p-3 rounded-xl border border-border/60">
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase tracking-wider font-bold">Odómetro</span>
            <div className="flex items-center gap-1 text-sm font-mono font-bold text-text-main">
              <Gauge size={14} className="text-primary flex-shrink-0" />
              <span>{vehiculo.kilometraje.toLocaleString('es-CO')} KM</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase tracking-wider font-bold">Ubicación</span>
            <div className="flex items-center gap-1 text-sm font-semibold text-text-main">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <span>Cali, Valle</span>
            </div>
          </div>
        </div>

        {/* Alerta de restricción Pico y Placa (si aplica hoy) */}
        {pyPInfo.aplicaHoy && (
          <div className={clsx(
            "flex items-start gap-2 p-2.5 rounded-lg text-xs border transition-colors",
            pyPInfo.restringidoAhora
              ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
          )}>
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              {pyPInfo.restringidoAhora 
                ? `Restringido ahora en Cali (Horario Pico y Placa).`
                : `Pico y Placa hoy ${pyPInfo.diaNombre} en Cali.`
              }
            </span>
          </div>
        )}

        {/* Precio + CTA */}
        <div className="mt-auto pt-3.5 border-t border-border/80 flex flex-col gap-3">
          <MicroScaleFade delay={index * 80 + 200}>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Precio Vitrina</span>
              <p className="text-2xl font-black text-text-main tracking-tight font-mono">
                {formatPrecio(vehiculo.precio)}
              </p>
            </div>
          </MicroScaleFade>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !py-3 w-full flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            aria-label={`Contactar por WhatsApp sobre el ${vehiculo.marca} ${vehiculo.modelo}`}
          >
            <MessageCircle size={18} aria-hidden="true" />
            Me interesa este carro
          </a>
        </div>
      </div>
    </motion.article>
  );
}
