export default function LatestCreations() {
  const items = [
    {
      img: "https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=800&h=400&auto=format&fit=crop",
      title: "Deportivos Premium",
      desc: "Velocidad y diseño aerodinámico en su máxima expresión."
    },
    {
      img: "https://images.unsplash.com/photo-1714976326351-0ecf0244f0fc?q=80&w=800&h=400&auto=format&fit=crop",
      title: "Sedanes Ejecutivos",
      desc: "Lujo, comodidad y representación para el uso diario."
    },
    {
      img: "https://images.unsplash.com/photo-1736220690062-79e12ca75262?q=80&w=800&h=400&auto=format&fit=crop",
      title: "SUVs Familiares",
      desc: "Espacio, seguridad y confort para todos tus viajes."
    },
    {
      img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&h=400&auto=format&fit=crop",
      title: "Coupés Exclusivos",
      desc: "Sofisticación y lujo para los gustos más exigentes."
    },
    {
      img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&h=400&auto=format&fit=crop",
      title: "Exóticos Limitados",
      desc: "Modelos únicos que garantizan una inversión segura."
    }
  ];

  return (
    <section className="py-16 font-['Poppins']">
      <h2 className="text-3xl font-semibold text-center text-text-main mx-auto">
        Colecciones Destacadas
      </h2>
      <p className="text-sm text-text-muted text-center mt-2 max-w-lg mx-auto px-4">
        Una selección visual de nuestros segmentos más cotizados.
        Cada vehículo seleccionado con intención, emoción y estilo.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 h-auto md:h-[400px] w-full max-w-6xl mt-10 mx-auto px-4">
        {items.map((item, idx) => (
          <div key={idx} className="relative group flex-grow transition-all w-full md:w-40 h-[250px] md:h-[400px] duration-500 hover:w-full hover:md:w-[800px] rounded-2xl overflow-hidden cursor-pointer shadow-md">
            <img 
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              src={item.img}
              alt={item.title}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
              <p className="text-sm mt-2 opacity-0 group-hover:opacity-90 transition-opacity duration-500 delay-100 leading-relaxed max-w-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
