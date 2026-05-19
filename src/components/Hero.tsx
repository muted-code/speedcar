import { ArrowRight, ShieldCheck, CheckCircle, Search } from 'lucide-react';

export default function Hero() {
  return (
    <section aria-label="Vitrina de Vehículos" className="bg-surface relative overflow-hidden border-b border-border">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-20 relative z-10">
          {/* Texto Hero */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary">
              <ShieldCheck size={16} aria-hidden="true" />
              Vehículos 100% Inspeccionados y Garantizados
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main leading-tight tracking-tight">
              Encuentra tu próximo <span className="text-primary">carro ideal</span> en Cali
            </h1>

            <p className="text-lg text-text-muted max-w-lg leading-relaxed">
              Explora nuestra selección de carros usados premium en Cali. Cada vehículo ha sido verificado exhaustivamente para que compres con total tranquilidad y seguridad.
            </p>

            {/* Beneficios rápidos en lista */}
            <ul className="space-y-2.5 text-sm text-text-main font-medium">
              {[
                'Peritaje técnico y legal completo realizado.',
                'Listos para traspaso inmediato.',
                'Sin intermediarios costosos ni sorpresas.',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5">
                  <CheckCircle size={17} className="text-primary flex-shrink-0" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#vitrina"
                className="btn-primary"
                aria-label="Explorar vitrina de vehículos"
              >
                <Search size={18} aria-hidden="true" />
                Explorar Vitrina
              </a>
              <a
                href="https://wa.me/573137148566?text=Hola%2C%20estoy%20buscando%20un%20veh%C3%ADculo%20en%20Cali."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                aria-label="Hablar con un asesor de ventas por WhatsApp"
              >
                Hablar con un Asesor
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Imagen Hero */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover aspect-[4/3] border border-border">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Vehículos listos para rodar en Cali, vitrina de Speed Car"
                className="w-full h-full object-cover animate-fade-in"
                loading="eager"
              />
              <div className="absolute bottom-5 right-5 bg-surface/95 rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-3 backdrop-blur-sm border border-border">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <span className="text-xl font-bold text-primary">Cali</span>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Ubicación</p>
                  <p className="text-sm font-bold text-text-main">Valle del Cauca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
