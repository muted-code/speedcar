import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import TarjetaVehiculo from '../components/TarjetaVehiculo';
import SidebarFilters from '../components/SidebarFilters';
import type { FiltrosState } from '../components/SidebarFilters';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';
import { SlidersHorizontal, AlertCircle } from 'lucide-react';

const INITIAL_FILTROS: FiltrosState = {
  busqueda: '',
  precioMin: '',
  precioMax: '',
  anioMin: '',
  anioMax: '',
  placas: [],
  transmision: 'Todos',
};

export default function Home() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [filtros, setFiltros] = useState<FiltrosState>(INITIAL_FILTROS);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    // Clasifica primero los destacados
    const sorted = [...mockVehiculos].sort(
      (a, b) => Number(b.destacado) - Number(a.destacado)
    );
    setVehiculos(sorted);
  }, []);

  const handleClearFilters = () => {
    setFiltros(INITIAL_FILTROS);
  };

  // Lógica de filtrado avanzada aplicando los 4 filtros principales
  const vehiculosFiltrados = vehiculos.filter((v) => {
    // 1. Filtro por Transmisión
    const matchTransmision =
      filtros.transmision === 'Todos' || v.transmision === filtros.transmision;

    // 2. Búsqueda por texto (Marca o Modelo)
    const term = filtros.busqueda.trim().toLowerCase();
    const matchTexto =
      !term ||
      v.marca.toLowerCase().includes(term) ||
      v.modelo.toLowerCase().includes(term);

    // 3. Rango de precio
    const precioMinNum = filtros.precioMin ? Number(filtros.precioMin) : 0;
    const precioMaxNum = filtros.precioMax ? Number(filtros.precioMax) : Infinity;
    const matchPrecio = v.precio >= precioMinNum && v.precio <= precioMaxNum;

    // 4. Rango de Años
    const anioMinNum = filtros.anioMin ? Number(filtros.anioMin) : 0;
    const anioMaxNum = filtros.anioMax ? Number(filtros.anioMax) : Infinity;
    const matchAnio = v.año >= anioMinNum && v.año <= anioMaxNum;

    // 5. Pico y Placa (Dígito final)
    const matchPlaca =
      filtros.placas.length === 0 || filtros.placas.includes(v.placa_final);

    return matchTransmision && matchTexto && matchPrecio && matchAnio && matchPlaca;
  });

  return (
    <main className="bg-surface-alt min-h-screen pb-16">
      <Hero />

      {/* ── Sección de Catálogo ── */}
      <section id="vitrina" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Encabezado y botón de filtros móvil */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-text-main tracking-tight">
              Vitrina de Usados Garantizados
            </h2>
            <p className="mt-2 text-text-muted text-sm">
              Encuentra tu carro ideal en Cali. Mostrando {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Botón para abrir filtros en Móvil */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-text-main hover:bg-surface-alt transition shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filtrar Resultados
          </button>
        </div>

        {/* Layout de dos columnas: Sidebar a la izquierda, Grilla a la derecha */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Componente Sidebar de Filtros */}
          <SidebarFilters
            filtros={filtros}
            setFiltros={setFiltros}
            onClear={handleClearFilters}
            isOpen={isMobileDrawerOpen}
            onClose={() => setIsMobileDrawerOpen(false)}
          />

          {/* Panel de Resultados */}
          <div className="flex-grow w-full">
            {vehiculosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehiculosFiltrados.map((vehiculo, i) => (
                  <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} index={i} />
                ))}
              </div>
            ) : (
              /* Estado Vacío (Empty State) Premium */
              <div className="text-center py-20 px-4 bg-surface rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto animate-fade-in">
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-text-main">
                  No encontramos carros con esas características
                </h3>
                <p className="text-sm text-text-muted mt-2 max-w-sm leading-relaxed">
                  Prueba modificando o limpiando los criterios de los filtros activos (como el rango de precios o los dígitos de placa) para encontrar tu carro ideal.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary mt-6 text-sm py-2 px-5"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
