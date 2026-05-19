import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import TarjetaVehiculo from '../components/TarjetaVehiculo';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';
import { Search, SlidersHorizontal, Sliders } from 'lucide-react';

const TRANSMISIONES = ['Todos', 'Automático', 'Mecánico'] as const;

export default function Home() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [transmisionFiltro, setTransmisionFiltro] = useState<string>('Todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // Aquí irá la llamada a Firestore en producción
    const sorted = [...mockVehiculos].sort(
      (a, b) => Number(b.destacado) - Number(a.destacado)
    );
    setVehiculos(sorted);
  }, []);

  const vehiculosFiltrados = vehiculos.filter((v) => {
    const matchTransmision =
      transmisionFiltro === 'Todos' || v.transmision === transmisionFiltro;
    const term = busqueda.toLowerCase();
    const matchBusqueda =
      !term ||
      v.marca.toLowerCase().includes(term) ||
      v.modelo.toLowerCase().includes(term) ||
      String(v.año).includes(term);
    return matchTransmision && matchBusqueda;
  });

  return (
    <main className="bg-surface-alt min-h-screen">
      <Hero />

      {/* ── Vitrina / Inventario ── */}
      <section id="vitrina" aria-labelledby="vitrina-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
            <Sliders size={16} aria-hidden="true" />
            Catálogo Disponible
          </div>
          <h2 id="vitrina-heading" className="text-3xl font-extrabold text-text-main tracking-tight">
            Nuestra Vitrina de Vehículos
          </h2>
          <p className="mt-2 text-text-muted">
            Mostrando {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? 's' : ''} listo{vehiculosFiltrados.length !== 1 ? 's' : ''} para entrega en Cali.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Input de Búsqueda */}
          <div className="relative flex-grow">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Buscar por marca, modelo o año..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              aria-label="Buscar vehículos"
            />
          </div>

          {/* Selector de Transmisión */}
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2">
            <SlidersHorizontal size={16} className="text-text-muted flex-shrink-0" aria-hidden="true" />
            <select
              value={transmisionFiltro}
              onChange={(e) => setTransmisionFiltro(e.target.value)}
              className="bg-transparent text-sm text-text-main focus:outline-none cursor-pointer"
              aria-label="Filtrar por tipo de transmisión"
            >
              {TRANSMISIONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grilla de Vehículos */}
        {vehiculosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculosFiltrados.map((vehiculo, i) => (
              <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-text-muted bg-surface rounded-2xl border border-border">
            <p className="text-lg font-semibold text-text-main">No se encontraron vehículos</p>
            <p className="text-sm mt-1">Intenta ajustando los filtros de búsqueda o transmisión.</p>
          </div>
        )}
      </section>
    </main>
  );
}
