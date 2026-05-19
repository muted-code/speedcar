import { useState } from 'react';
import { Camera, TrendingUp, ShieldCheck, MessageCircle, HelpCircle } from 'lucide-react';

export default function Vender() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    marca: '',
    modelo: '',
    año: '',
    kilometraje: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generar mensaje contextual de WhatsApp
    const message = `Hola Speed Car, me gustaría solicitar corretaje para vender mi carro:\n\n` +
      `- Nombre: ${formData.nombre}\n` +
      `- Teléfono: ${formData.telefono}\n` +
      `- Vehículo: ${formData.marca} ${formData.modelo} (${formData.año})\n` +
      `- Kilometraje: ${formData.kilometraje} km\n\n` +
      `Quedo atento para coordinar la sesión de fotos y peritaje.`;

    const whatsappUrl = `https://wa.me/573137148566?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    {
      icon: Camera,
      title: 'Fotografía Premium',
      desc: 'Hacemos que tu vehículo resalte con fotos de alta calidad que atraen a compradores serios.',
    },
    {
      icon: TrendingUp,
      title: 'Máximo Alcance',
      desc: 'Publicamos en portales líderes y realizamos pauta digital segmentada en Cali.',
    },
    {
      icon: ShieldCheck,
      title: 'Seguridad Total',
      desc: 'Nosotros filtramos a los interesados y coordinamos citas seguras. Tú solo recibes el pago.',
    },
  ];

  return (
    <main className="bg-surface-alt min-h-screen pb-16">
      {/* Hero Section */}
      <section aria-labelledby="vender-heading" className="bg-surface border-b border-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Texto informativo */}
            <div className="space-y-6 animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-1 text-xs font-semibold text-primary">
                Servicio de Corretaje Premium
              </span>
              <h1 id="vender-heading" className="text-4xl sm:text-5xl font-black text-text-main leading-tight tracking-tight">
                Vendemos tu carro <span className="text-primary">más rápido</span> y al mejor precio
              </h1>
              <p className="text-lg text-text-muted leading-relaxed">
                Sin llamadas molestas, sin regateos innecesarios y con total seguridad. Nos encargamos de todo el marketing y proceso de venta en Cali por una comisión de éxito.
              </p>
              
              <div className="grid gap-6 pt-4">
                {features.map((feat) => (
                  <div key={feat.title} className="flex gap-4 items-start">
                    <div className="bg-primary-light p-2.5 rounded-xl flex-shrink-0">
                      <feat.icon size={20} className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-sm">{feat.title}</h3>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario de Captación */}
            <div className="bg-surface rounded-3xl shadow-card-hover border border-border p-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-text-main">
                  Solicita tu Corretaje
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Ingresa los detalles de tu vehículo y nos pondremos en contacto contigo de inmediato.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-xs font-semibold text-text-muted mb-1.5">Nombre Completo</label>
                    <input
                      required
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-xs font-semibold text-text-muted mb-1.5">Teléfono de Contacto</label>
                    <input
                      required
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej. 3137148566"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="marca" className="block text-xs font-semibold text-text-muted mb-1.5">Marca</label>
                    <input
                      required
                      type="text"
                      id="marca"
                      name="marca"
                      value={formData.marca}
                      onChange={handleChange}
                      placeholder="Ej. Mazda"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="modelo" className="block text-xs font-semibold text-text-muted mb-1.5">Modelo</label>
                    <input
                      required
                      type="text"
                      id="modelo"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleChange}
                      placeholder="Ej. CX-30"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="año" className="block text-xs font-semibold text-text-muted mb-1.5">Año</label>
                    <input
                      required
                      type="number"
                      id="año"
                      name="año"
                      value={formData.año}
                      onChange={handleChange}
                      placeholder="Ej. 2022"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="kilometraje" className="block text-xs font-semibold text-text-muted mb-1.5">Kilometraje</label>
                    <input
                      required
                      type="number"
                      id="kilometraje"
                      name="kilometraje"
                      value={formData.kilometraje}
                      onChange={handleChange}
                      placeholder="Ej. 35000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-whatsapp w-full mt-4 flex items-center justify-center gap-2"
                  aria-label="Enviar solicitud de corretaje por WhatsApp"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  Enviar Solicitud por WhatsApp
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section aria-labelledby="faq-heading" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 id="faq-heading" className="text-2xl font-bold text-text-main text-center mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="text-primary" size={24} aria-hidden="true" />
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          {[
            { q: '¿Cuánto cobran por el servicio?', a: 'Cobramos una comisión competitiva sobre el valor final de venta del vehículo. No pagas nada por adelantado, solo pagas cuando tu carro se vende.' },
            { q: '¿Dónde muestran mi carro?', a: 'Coordinamos citas de exhibición en ubicaciones seguras de Cali únicamente con compradores pre-calificados e interesados reales.' },
            { q: '¿Cuánto tiempo toma vender un carro?', a: 'Nuestro promedio de venta es de 15 días gracias a nuestras campañas digitales premium y base de datos de compradores activos.' }
          ].map((faq, idx) => (
            <details key={idx} className="group bg-surface rounded-2xl border border-border p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <span className="font-semibold text-sm text-text-main">{faq.q}</span>
                <span className="transition-transform group-open:rotate-180">
                  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
