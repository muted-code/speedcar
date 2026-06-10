import { useNavigate } from 'react-router-dom';
import type { Vehiculo } from '../types';

interface Props {
  vehiculos: Vehiculo[];
}

export default function LatestCreations({ vehiculos }: Props) {
  const navigate = useNavigate();

  // Tomamos los primeros 5 vehículos
  const items = vehiculos.slice(0, 5);

  if (items.length === 0) return null;

  const formatPrecio = (n: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <section className="py-16 font-['Poppins']">
      <h2 className="text-3xl font-semibold text-center text-text-main mx-auto">
        Vehículos Destacados
      </h2>
      <p className="text-sm text-text-muted text-center mt-2 max-w-lg mx-auto px-4">
        Una selección visual de nuestros modelos más exclusivos.
        Haz clic en cualquiera para ver la publicación detallada.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 h-auto md:h-[400px] w-full max-w-6xl mt-10 mx-auto px-4">
        {items.map((vehiculo) => (
          <div 
            key={vehiculo.id}
            onClick={() => navigate(`/vehiculo/${vehiculo.id}`)}
            className="relative group flex-grow transition-all w-full md:w-40 h-[250px] md:h-[400px] duration-500 hover:w-full hover:md:w-[800px] rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img 
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              src={vehiculo.urls_imagenes[0]}
              alt={`${vehiculo.marca} ${vehiculo.modelo}`}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {vehiculo.marca} {vehiculo.modelo}
              </h3>
              <div className="text-sm mt-2 opacity-0 group-hover:opacity-90 transition-opacity duration-500 delay-100 leading-relaxed max-w-sm">
                <p className="font-semibold text-primary">{formatPrecio(vehiculo.precio)}</p>
                <p className="text-white/80">{vehiculo.año} • {vehiculo.kilometraje.toLocaleString('es-CO')} km • {vehiculo.transmision}</p>
                <p className="mt-1 line-clamp-2 text-white/60 text-xs hidden md:block">
                  {vehiculo.descripcion_marketing}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
