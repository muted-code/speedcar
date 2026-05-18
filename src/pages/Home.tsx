import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import TarjetaVehiculo from '../components/TarjetaVehiculo';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';

export default function Home() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    // Aquí iría la llamada real a Firebase
    // Simulando carga de datos
    setVehiculos(mockVehiculos);
  }, []);

  return (
    <div>
      <Hero />
      
      <main id="inventario" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Vehículos Disponibles
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Encuentra tu próximo carro con garantía de calidad y el mejor precio del mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehiculos.map((vehiculo) => (
            <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} />
          ))}
        </div>
        
        {vehiculos.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>No hay vehículos disponibles en este momento.</p>
          </div>
        )}
      </main>
    </div>
  );
}
