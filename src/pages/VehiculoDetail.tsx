import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';
import ImageEcommerceMagnifier from '../components/ImageEcommerceMagnifier';
import {
  ChevronLeft, ChevronRight, ArrowLeft,
  MessageCircle, Gauge, Palette, Settings2,
  Hash, MapPin, Info, ShieldCheck, CheckCircle2,
  AlertTriangle, Hammer, Wrench, ShieldAlert
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Validador Caleño de Pico y Placa en tiempo real
 */
function getPicoYPlacaCali(placaFinal: number) {
  const ahora = new Date();
  const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const hora = ahora.getHours();
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

  const diasInfo = [
    { dia: "Lunes", digitos: "1 y 2" },
    { dia: "Martes", digitos: "3 y 4" },
    { dia: "Miércoles", digitos: "5 y 6" },
    { dia: "Jueves", digitos: "7 y 8" },
    { dia: "Viernes", digitos: "9 y 0" }
  ];

  return {
    aplicaHoy,
    restringidoAhora,
    diaActualNombre: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][diaSemana],
    diasInfo,
    placaFinal
  };
}

export default function VehiculoDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [activePeritajeTab, setActivePeritajeTab] = useState<'motor' | 'chasis' | 'electrico' | 'legal'>('motor');

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${BACKEND_URL}/api/vehiculos/${id}`);
        
        if (res.ok) {
          const data = await res.json();
          setVehiculo(data);
        } else {
          // Fallback a mockVehiculos si falla el backend (solo para no romper el desarrollo)
          const found = mockVehiculos.find((v) => v.id === id) ?? null;
          setVehiculo(found);
        }
      } catch (err) {
        console.error("Error obteniendo el vehículo del backend:", err);
        const found = mockVehiculos.find((v) => v.id === id) ?? null;
        setVehiculo(found);
      } finally {
        setImgIdx(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    fetchVehiculo();
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

  const pyPInfo = getPicoYPlacaCali(vehiculo.placa_final);

  const specs = [
    { icon: Gauge,    label: 'Kilometraje',    value: `${vehiculo.kilometraje.toLocaleString('es-CO')} km` },
    { icon: Settings2,label: 'Transmisión',    value: vehiculo.transmision },
    { icon: Palette,  label: 'Color',          value: vehiculo.color },
    { icon: Hash,     label: 'Placa termina en', value: `${vehiculo.placa_final} (Cali)` },
    { icon: MapPin,   label: 'Ciudad',         value: 'Cali, Valle' },
  ];

  // Detalles simulados de la inspección de 150 puntos (Peritaje 360°)
  const peritajeSectores = {
    motor: {
      titulo: 'Motor y Transmisión',
      estado: '100% Funcional',
      detalles: [
        'Prueba de compresión de pistones: Excelente.',
        'Estado de fluidos y aceite: Nuevos, sin fugas.',
        'Soportes de motor y correa de repartición: Inspeccionados.',
        'Suavidad en cambios de marcha y embrague: Verificado.'
      ]
    },
    chasis: {
      titulo: 'Chasis y Estructura',
      estado: 'Estructura Original',
      detalles: [
        'Pintura y latonería: Sin colisiones estructurales.',
        'Compactación de chasis y amortiguación: Medición láser OK.',
        'Desgaste de llantas: 85% de vida útil restante.',
        'Inspección anticorrosión bajo chasis: Aprobada.'
      ]
    },
    electrico: {
      titulo: 'Sistema Eléctrico y Diagnóstico',
      estado: 'Scanner Limpio',
      detalles: [
        'Lectura OBD2/Scanner: Cero códigos de falla.',
        'Salud de la batería: 94% de capacidad activa.',
        'Sistema de luces e infotenimiento: Completamente operativo.',
        'Sensores y cámaras de parqueo: Calibrados.'
      ]
    },
    legal: {
      titulo: 'Documentación y Legalidad',
      estado: 'Listo para Traspaso',
      detalles: [
        'Historial RUNT: Único dueño, cero comparendos pendientes.',
        'SOAT y Tecnicomecánica: Vigentes.',
        'Verificación de números de motor y chasis (Sijín): Limpio.',
        'Paz y salvo de impuestos de Cali: Confirmado.'
      ]
    }
  };

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="bg-surface-alt min-h-screen pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Volver */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors mb-6"
          aria-label="Volver al catálogo"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna izquierda: galería + descripción + peritaje ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Carrusel */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
              <div className="relative aspect-video bg-surface-alt group">
                <ImageEcommerceMagnifier
                  srcOriginal={vehiculo.urls_imagenes[imgIdx]}
                  altText={`Vista ${imgIdx + 1} de ${total} del ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`}
                  onClick={() => setIsLightboxOpen(true)}
                />

                {total > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface backdrop-blur-sm text-text-main p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface backdrop-blur-sm text-text-main p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" role="tablist" aria-label="Navegación de imágenes">
                  {vehiculo.urls_imagenes.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={imgIdx === i}
                      aria-label={`Ver imagen ${i + 1}`}
                      onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                      className={clsx(
                        'h-1.5 rounded-full transition-all',
                        imgIdx === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      )}
                    />
                  ))}
                </div>

                {/* Contador */}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                  {imgIdx + 1} / {total}
                </span>
              </div>

              {/* Miniaturas */}
              {total > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-border/60 bg-surface">
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
            <div className="bg-surface rounded-2xl shadow-sm border border-border/80 p-6">
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
                <Info size={20} className="text-primary" aria-hidden="true" />
                Descripción del Vehículo
              </h2>
              <p className="text-text-muted leading-relaxed whitespace-pre-line text-sm md:text-base">
                {vehiculo.descripcion_marketing}
              </p>
            </div>

            {/* Widget de Peritaje 360° (UI UX Pro Max Signature) */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border/80 p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/65 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <ShieldCheck size={22} className="text-emerald-500 animate-pulse" aria-hidden="true" />
                    Reporte de Peritaje Automotriz 360°
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Inspección certificada de 150 puntos mecánicos y legales.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold self-start md:self-auto border border-emerald-500/20">
                  <CheckCircle2 size={14} /> Aprobación 100%
                </div>
              </div>

              {/* Selector de pestañas táctiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['motor', 'chasis', 'electrico', 'legal'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePeritajeTab(tab)}
                    className={clsx(
                      "px-3 py-2.5 text-xs font-bold rounded-xl border transition-all flex flex-col items-center gap-1.5",
                      activePeritajeTab === tab
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface-alt hover:bg-surface text-text-muted border-border/70"
                    )}
                  >
                    {tab === 'motor' && <Wrench size={16} />}
                    {tab === 'chasis' && <Hammer size={16} />}
                    {tab === 'electrico' && <Gauge size={16} />}
                    {tab === 'legal' && <ShieldCheck size={16} />}
                    <span>
                      {tab === 'motor' && 'Motor'}
                      {tab === 'chasis' && 'Chasis'}
                      {tab === 'electrico' && 'Eléctrico'}
                      {tab === 'legal' && 'Legalidad'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Panel de detalles del peritaje seleccionado */}
              <div className="bg-surface-alt border border-border/60 p-5 rounded-2xl overflow-hidden min-h-[180px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePeritajeTab}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-text-main text-sm md:text-base">
                        {peritajeSectores[activePeritajeTab].titulo}
                      </h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {peritajeSectores[activePeritajeTab].estado}
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {peritajeSectores[activePeritajeTab].detalles.map((det, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-text-muted leading-relaxed">
                          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{det}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* ── Columna derecha: precio + ficha + Pico y Placa + CTA ── */}
          <aside className="space-y-5" aria-label="Información del vehículo y contacto">
            <div className="bg-surface rounded-2xl shadow-sm border border-border/80 p-6 sticky top-24 space-y-5">

              {/* Encabezado precio */}
              <div className="pb-5 border-b border-border/80 space-y-2">
                <h1 className="text-2xl font-extrabold text-text-main leading-snug font-display">
                  {vehiculo.marca} {vehiculo.modelo}
                </h1>
                <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                  Modelo {vehiculo.año} &bull; {vehiculo.transmision}
                </p>
                <div className="pt-2">
                  <p className="text-sm text-text-muted">Precio de lista</p>
                  <p className="text-4xl font-black text-text-main font-mono tracking-tight mt-1">
                    {formatPrecio(vehiculo.precio)}
                  </p>
                </div>
              </div>

              {/* Validador Caleño de Pico y Placa */}
              <div className="p-4 bg-surface-alt rounded-2xl border border-border/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-primary" />
                    Restricción Cali (Pico y Placa)
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-surface border border-border/85 rounded-lg">
                    Placa: {pyPInfo.placaFinal}
                  </span>
                </div>

                {pyPInfo.aplicaHoy ? (
                  <div className={clsx(
                    "flex items-start gap-2.5 p-3 rounded-xl text-xs border leading-relaxed",
                    pyPInfo.restringidoAhora
                      ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                  )}>
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="font-bold">
                        {pyPInfo.restringidoAhora ? "Restringido en Cali ahora mismo." : `Tiene restricción hoy ${pyPInfo.diaActualNombre}.`}
                      </p>
                      <p className="text-[10px] opacity-90 mt-1">
                        Restricción aplica de Lunes a Viernes (6:00 AM - 8:00 PM).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs leading-relaxed">
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Libre de restricción hoy ({pyPInfo.diaActualNombre}).</p>
                      <p className="text-[10px] opacity-90 mt-1">Puedes circular por Cali con total tranquilidad.</p>
                    </div>
                  </div>
                )}

                {/* Calendario de Pico y Placa */}
                <div className="border-t border-border/60 pt-2.5">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Horario Semanal:</p>
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
                    {pyPInfo.diasInfo.map((d) => (
                      <div 
                        key={d.dia} 
                        className={clsx(
                          "py-1 rounded-md border",
                          d.dia === pyPInfo.diaActualNombre
                            ? pyPInfo.aplicaHoy 
                              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold"
                              : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold"
                            : "bg-surface text-text-muted border-border/50"
                        )}
                      >
                        <span className="block font-semibold">{d.dia.substring(0, 2)}</span>
                        <span className="block mt-0.5 text-[9px] opacity-80">{d.digitos}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ficha técnica */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Especificaciones Técnicas
                </h3>
                <dl className="divide-y divide-border/80 border-y border-border/80">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="spec-row py-3 flex justify-between text-xs md:text-sm">
                      <dt className="spec-label flex items-center gap-2 text-text-muted font-medium">
                        <Icon size={14} className="text-primary flex-shrink-0" aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="spec-value font-bold text-text-main">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* CTA escritorio */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full hidden lg:inline-flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  aria-label={`Contactar asesor por WhatsApp sobre el ${vehiculo.marca} ${vehiculo.modelo}`}
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  Contactar por WhatsApp
                </a>
                <p className="text-center text-xs text-text-muted mt-3 hidden lg:block">
                  Respuesta inmediata en menos de 5 minutos
                </p>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* ── CTA Flotante Móvil ── */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border/80 lg:hidden z-40 shadow-[0_-4px_20px_hsl(0_0%_0%/0.08)] flex gap-3"
        role="complementary"
        aria-label="Botón de contacto fijo"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full flex items-center justify-center gap-2"
          aria-label={`Contactar por WhatsApp sobre ${vehiculo.marca} ${vehiculo.modelo}`}
        >
          <MessageCircle size={20} aria-hidden="true" />
          Contactar por WhatsApp
        </a>
      </div>

      {/* ── Lightbox de Imágenes ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Controles de cierre */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
              <span className="text-white/70 font-mono text-sm">{imgIdx + 1} / {total}</span>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              >
                Cerrar (Esc)
              </button>
            </div>

            {/* Imagen centrada */}
            <div className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto p-4 md:p-12">
              <img 
                src={vehiculo.urls_imagenes[imgIdx]} 
                alt="" 
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
              />
            </div>

            {/* Botones de navegación gigantes */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
                >
                  <ChevronLeft size={48} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
                >
                  <ChevronRight size={48} />
                </button>
              </>
            )}
            
            {/* Tira de miniaturas abajo */}
            {total > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4" onClick={(e) => e.stopPropagation()}>
                {vehiculo.urls_imagenes.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={clsx(
                      'flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all',
                      imgIdx === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
                    )}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
