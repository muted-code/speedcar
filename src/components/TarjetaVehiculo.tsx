import { Link } from 'react-router-dom';
import type { Vehiculo } from '../types';
import { MapPin, Gauge, MessageCircle } from 'lucide-react';

interface Props {
  vehiculo: Vehiculo;
}

export default function TarjetaVehiculo({ vehiculo }: Props) {
  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(precio);
  };

  const whatsappMessage = `Hola, estoy interesado en el ${vehiculo.marca} ${vehiculo.modelo} año ${vehiculo.año} que vi en su página por ${formatPrecio(vehiculo.precio)}. Me gustaría agendar una cita para verlo.`;
  const whatsappUrl = `https://wa.me/573137148566?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
      <Link to={`/vehiculo/${vehiculo.id}`} className="relative aspect-[4/3] overflow-hidden block">
        {vehiculo.destacado && (
          <div className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
            DESTACADO
          </div>
        )}
        <img 
          src={vehiculo.urls_imagenes[0]} 
          alt={`${vehiculo.marca} ${vehiculo.modelo}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          Placa termina en: {vehiculo.placa_final}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <Link to={`/vehiculo/${vehiculo.id}`}>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-600 transition-colors line-clamp-1">
              {vehiculo.marca} {vehiculo.modelo}
            </h3>
          </Link>
          <p className="text-gray-500 text-sm">
            {vehiculo.año} • {vehiculo.transmision}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Gauge size={16} className="text-gray-400" />
            <span>{vehiculo.kilometraje.toLocaleString('es-CO')} km</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-400" />
            <span>Cali</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="font-extrabold text-2xl text-gray-900 mb-4">
            {formatPrecio(vehiculo.precio)}
          </p>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-lg font-bold transition-colors"
          >
            <MessageCircle size={20} />
            Me interesa este carro
          </a>
        </div>
      </div>
    </div>
  );
}
