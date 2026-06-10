import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import LatestCreations from '../components/LatestCreations';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';

export default function Home() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    // Al montar Home, hacemos una sola llamada al backend
    // para obtener los vehiculos más recientes y mostrarlos en el componente LatestCreations
    const fetchVehiculos = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${BACKEND_URL}/api/vehiculos`);
        
        if (res.ok) {
          const data = await res.json();
          setVehiculos(data);
        } else {
          // Fallback
          const sorted = [...mockVehiculos].sort(
            (a, b) => Number(b.destacado) - Number(a.destacado)
          );
          setVehiculos(sorted);
        }
      } catch (e) {
        console.error(e);
        // Fallback
        const sorted = [...mockVehiculos].sort(
          (a, b) => Number(b.destacado) - Number(a.destacado)
        );
        setVehiculos(sorted);
      }
    };

    fetchVehiculos();
  }, []);

  return (
    <main className="bg-surface-alt min-h-screen pb-16">
      <Hero />
      <LatestCreations vehiculos={vehiculos} />
    </main>
  );
}
