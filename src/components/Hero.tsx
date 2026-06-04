import { ArrowRight, ShieldCheck, CheckCircle2, Search, MapPin } from 'lucide-react';
import SoftBlurIn from './animations/SoftBlurIn';
import MaskRevealUp from './animations/MaskRevealUp';

export default function Hero() {
  return (
    <section aria-label="Vitrina de Vehículos" className="bg-surface relative overflow-hidden border-b border-border/75">
      {/* Patrón de Rejilla Técnica Deportiva y Gradiente Radial */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--color-border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--color-border)/0.3)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,hsl(var(--color-primary-light))_0%,transparent_100%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24 relative z-10">
          
          {/* Texto Hero */}
          <div className="space-y-7 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 backdrop-blur-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Vitrina Cali &bull; Usados Garantizados
            </div>

            {/* soft-blur-in en el h1 con gradientes de color y animación escalonada */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main leading-tight tracking-tight font-display">
              <SoftBlurIn
                text="Encuentra tu próximo"
                as="span"
                className="block text-text-main"
              />
              <SoftBlurIn
                text="carro ideal en Cali"
                as="span"
                className="block text-primary"
                delay={200}
              />
            </h1>

            {/* mask-reveal-up en el subtítulo por líneas */}
            <MaskRevealUp
              lines={[
                'Explora nuestra selección de carros usados premium en Cali.',
                'Cada vehículo ha sido verificado exhaustivamente para que',
                'compres con total tranquilidad y seguridad de peritaje.',
              ]}
              className="text-base sm:text-lg text-text-muted max-w-lg leading-relaxed font-medium"
              delay={400}
            />

            {/* Fichas de Especificaciones / Beneficios en formato Dashboard */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { label: 'Peritaje Aprobado', desc: '150 puntos verificados' },
                { label: 'Traspaso Inmediato', desc: 'Papeles al día en Cali' },
                { label: 'Garantía Directa', desc: 'Sin intermediarios' }
              ].map((b, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-alt/65 border border-border/80 rounded-xl text-left shadow-xs backdrop-blur-xs hover:border-primary/20 transition-all duration-300"
                >
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-text-main">{b.label}</p>
                    <p className="text-[10px] text-text-muted">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <a
                href="#vitrina"
                className="btn-primary shadow-lg shadow-primary/20 !px-7 !py-3.5 text-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
                aria-label="Explorar vitrina de vehículos"
              >
                <Search size={16} aria-hidden="true" />
                Explorar Vitrina
              </a>
              <a
                href="https://wa.me/573137148566?text=Hola%2C%20estoy%20buscando%20un%20veh%C3%ADculo%20en%20Cali."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-7 !py-3.5 text-sm hover:scale-[1.01] active:scale-[0.99] transition-all backdrop-blur-xs bg-surface/30"
                aria-label="Hablar con un asesor de ventas por WhatsApp"
              >
                Hablar con un Asesor
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Imagen Hero con widgets flotantes */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {/* Efecto de brillo de fondo detrás de la imagen */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-emerald-500/10 rounded-[32px] blur-2xl pointer-events-none" />
            
            <div className="relative rounded-[28px] overflow-hidden shadow-card-hover aspect-[4/3] border border-border/85 bg-surface group hover:scale-[1.005] transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Vehículos listos para rodar en Cali, vitrina de Speed Car"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                loading="eager"
              />
              
              {/* Widget Flotante 1: Ubicación */}
              <div className="absolute bottom-4 right-4 bg-surface/90 rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-2.5 backdrop-blur-md border border-border/80">
                <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider leading-none">Ubicación</p>
                  <p className="text-xs font-extrabold text-text-main mt-0.5">Cali, Valle del Cauca</p>
                </div>
              </div>

              {/* Widget Flotante 2: Peritaje Certificado */}
              <div className="absolute top-4 left-4 bg-surface/90 rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-2.5 backdrop-blur-md border border-border/80">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider leading-none">Inspección</p>
                  <p className="text-xs font-extrabold text-text-main mt-0.5">150 Puntos OK</p>
                </div>
              </div>

              {/* Gradiente sutil interno */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
