import { useState } from 'react';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import SoftBlurIn from './animations/SoftBlurIn';
import MaskRevealUp from './animations/MaskRevealUp';

export default function Hero() {
  const [stopScroll, setStopScroll] = useState(false);

  const cardData = [
    {
      title: "Deportivos de Alta Gama",
      image: "https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=800&h=400&auto=format&fit=crop",
    },
    {
      title: "SUVs Imponentes",
      image: "https://images.unsplash.com/photo-1736220690062-79e12ca75262?q=80&w=800&h=400&auto=format&fit=crop",
    },
    {
      title: "Sedanes Ejecutivos",
      image: "https://images.unsplash.com/photo-1714976326351-0ecf0244f0fc?q=80&w=800&h=400&auto=format&fit=crop",
    },
    {
      title: "Clásicos Modernos",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&h=400&auto=format&fit=crop",
    },
    {
      title: "Ediciones Limitadas",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&h=400&auto=format&fit=crop",
    }
  ];

  return (
    <section aria-label="Vitrina de Vehículos" className="bg-surface relative overflow-hidden border-b border-border/75">
      <style>{`
          .marquee-inner {
              animation: marqueeScroll linear infinite;
          }
          @keyframes marqueeScroll {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-33.333333%); }
          }
      `}</style>
      
      {/* Patrón de Rejilla Técnica Deportiva y Gradiente Radial */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--color-border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--color-border)/0.3)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,hsl(var(--color-primary-light))_0%,transparent_100%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16 relative z-10 flex flex-col items-center text-center">
        
        {/* Texto Hero */}
        <div className="space-y-7 flex flex-col items-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 backdrop-blur-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Vitrina Cali &bull; Usados Garantizados
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main leading-tight tracking-tight font-display">
            <SoftBlurIn text="Encuentra tu próximo" as="span" className="block text-text-main" />
            <SoftBlurIn text="carro ideal en Cali" as="span" className="block text-primary" delay={200} />
          </h1>

          <MaskRevealUp
            lines={[
              'Explora nuestra selección de carros usados premium en Cali.',
              'Cada vehículo ha sido verificado exhaustivamente para que',
              'compres con total tranquilidad y seguridad de peritaje.',
            ]}
            className="text-base sm:text-lg text-text-muted leading-relaxed font-medium"
            delay={400}
          />

          <div className="flex flex-wrap justify-center gap-2.5 pt-1">
            {[
              { label: 'Peritaje Aprobado', desc: '150 puntos verificados' },
              { label: 'Traspaso Inmediato', desc: 'Papeles al día en Cali' },
              { label: 'Garantía Directa', desc: 'Sin intermediarios' }
            ].map((b, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-alt/65 border border-border/80 rounded-xl text-left shadow-xs backdrop-blur-xs hover:border-primary/20 transition-all duration-300">
                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-text-main">{b.label}</p>
                  <p className="text-[10px] text-text-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <a href="#vitrina" className="btn-primary shadow-lg shadow-primary/20 !px-7 !py-3.5 text-sm hover:scale-[1.01] active:scale-[0.99] transition-all">
              <Search size={16} />
              Explorar Vitrina
            </a>
            <a href="https://wa.me/573137148566?text=Hola%2C%20estoy%20buscando%20un%20veh%C3%ADculo%20en%20Cali." target="_blank" rel="noopener noreferrer" className="btn-secondary !px-7 !py-3.5 text-sm hover:scale-[1.01] active:scale-[0.99] transition-all backdrop-blur-xs bg-surface/30">
              Hablar con un Asesor
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Marquee Gallery Hero */}
      <div className="w-full relative max-w-[100vw] mx-auto pb-12 overflow-hidden z-10" onMouseEnter={() => setStopScroll(true)} onMouseLeave={() => setStopScroll(false)}>
          <div className="absolute left-0 top-0 h-full w-24 md:w-48 z-20 pointer-events-none bg-gradient-to-r from-surface to-transparent" />
          
          <div className="marquee-inner flex w-fit" style={{ animationPlayState: stopScroll ? "paused" : "running", animationDuration: cardData.length * 4000 + "ms" }}>
              <div className="flex">
                  {/* Duplicamos 3 veces para que sea infinito al mover el 33% */}
                  {[...cardData, ...cardData, ...cardData].map((card, index) => (
                      <div key={index} className="w-64 md:w-80 mx-3 h-[16rem] md:h-[22rem] relative group hover:scale-95 transition-all duration-500 rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-surface">
                          <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                          <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-500 absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                              <p className="text-white text-xl md:text-2xl font-bold text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-display shadow-black drop-shadow-md">{card.title}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          
          <div className="absolute right-0 top-0 h-full w-24 md:w-48 z-20 pointer-events-none bg-gradient-to-l from-surface to-transparent" />
      </div>
    </section>
  );
}
