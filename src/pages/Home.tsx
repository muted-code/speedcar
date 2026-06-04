import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import TarjetaVehiculo from '../components/TarjetaVehiculo';
import SidebarFilters from '../components/SidebarFilters';
import type { FiltrosState } from '../components/SidebarFilters';
import type { Vehiculo } from '../types';
import { mockVehiculos } from '../data/mockVehiculos';
import { SlidersHorizontal, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import SmartSearchBar from '../components/SmartSearchBar';
import TarjetaVehiculoSkeleton from '../components/TarjetaVehiculoSkeleton';

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
  
  // Estados para Búsqueda Semántica con IA
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSemanticActive, setIsSemanticActive] = useState(false);

  // Cargar vehículos iniciales ordenando destacados primero
  useEffect(() => {
    const sorted = [...mockVehiculos].sort(
      (a, b) => Number(b.destacado) - Number(a.destacado)
    );
    setVehiculos(sorted);
  }, []);

  const handleClearFilters = () => {
    setFiltros(INITIAL_FILTROS);
  };

  // Handler de Búsqueda Semántica
  const handleSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      handleClearSemantic();
      return;
    }
    setIsSearchLoading(true);
    setIsSemanticActive(true);
    setSearchQuery(query);

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${BACKEND_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("No se pudo conectar con el servidor de búsqueda semántica");
      }

      const data = await res.json();
      setVehiculos(data);
    } catch (err) {
      console.warn("Backend de búsqueda inactivo, usando algoritmo local de contingencia:", err);
      
      // Fallback local: buscador básico de coincidencia de texto en campos de marketing y ficha
      const term = query.toLowerCase().trim();
      const localResults = mockVehiculos.filter((v) => {
        const textToMatch = `${v.marca} ${v.modelo} ${v.año} ${v.color} ${v.transmision} ${v.descripcion_marketing}`.toLowerCase();
        
        // Comprobar coincidencia de palabras clave
        const queryWords = term.split(/\s+/).filter(w => w.length > 2);
        if (queryWords.length === 0) return textToMatch.includes(term);
        
        // Devolver verdadero si al menos el 50% de las palabras clave están presentes
        const matches = queryWords.filter(word => textToMatch.includes(word));
        return matches.length >= Math.ceil(queryWords.length / 2);
      });

      setVehiculos(localResults);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Limpiar Búsqueda Semántica
  const handleClearSemantic = () => {
    setIsSemanticActive(false);
    setSearchQuery("");
    const sorted = [...mockVehiculos].sort(
      (a, b) => Number(b.destacado) - Number(a.destacado)
    );
    setVehiculos(sorted);
  };

  // Filtrado final aplicando filtros del sidebar a los resultados actuales de la grilla
  const vehiculosFiltrados = vehiculos.filter((v) => {
    // 1. Filtro por Transmisión
    const matchTransmision =
      filtros.transmision === 'Todos' || v.transmision === filtros.transmision;

    // 2. Búsqueda por texto del sidebar (Marca o Modelo)
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

  // Alternativas recomendadas en caso de Empty State
  const alternativasDestacadas = mockVehiculos.filter(v => v.destacado);

  return (
    <main className="bg-surface-alt min-h-screen pb-16">
      <Hero />

      {/* ── Sección de Catálogo ── */}
      <section id="vitrina" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Barra de Búsqueda Inteligente */}
        <SmartSearchBar 
          onSearch={handleSemanticSearch} 
          isLoading={isSearchLoading}
          onClear={handleClearSemantic}
        />

        {/* Encabezado y botón de filtros móvil */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-text-main tracking-tight flex items-center gap-2.5 font-display">
              <span>Vitrina de Usados Garantizados</span>
              {isSemanticActive && (
                <span className="badge-primary inline-flex items-center gap-1 text-xs py-1 px-2.5 bg-primary/10 text-primary">
                  <Sparkles size={12} /> Búsqueda IA activa
                </span>
              )}
            </h2>
            <p className="mt-2 text-text-muted text-sm">
              {isSemanticActive 
                ? `Resultados semánticos para "${searchQuery}". Mostrando ${vehiculosFiltrados.length} vehículo${vehiculosFiltrados.length !== 1 ? 's' : ''}.`
                : `Encuentra tu carro ideal en Cali. Mostrando ${vehiculosFiltrados.length} vehículo${vehiculosFiltrados.length !== 1 ? 's' : ''}.`
              }
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

        {/* Layout de dos columnas */}
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
            {isSearchLoading ? (
              // Shimmer effect
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TarjetaVehiculoSkeleton key={i} />
                ))}
              </div>
            ) : vehiculosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehiculosFiltrados.map((vehiculo, i) => (
                  <TarjetaVehiculo key={vehiculo.id} vehiculo={vehiculo} index={i} />
                ))}
              </div>
            ) : isSemanticActive ? (
              /* Fallback Semántico Inteligente en caso de no encontrar coincidencias exactas */
              <div className="space-y-10 w-full">
                <div className="text-center py-16 px-6 bg-surface rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto animate-fade-in">
                  <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                    <Sparkles size={32} className="animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main">
                    Sin coincidencias semánticas exactas
                  </h3>
                  <p className="text-sm text-text-muted mt-2 max-w-md leading-relaxed">
                    No logramos encontrar vehículos que coincidan exactamente con tu consulta inteligente: <strong className="text-primary">"{searchQuery}"</strong>.
                  </p>
                  
                  <div className="mt-6 text-left bg-surface-alt border border-border p-4 rounded-xl max-w-md w-full">
                    <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">Consejos de Búsqueda IA:</h4>
                    <ul className="text-xs text-text-muted list-disc pl-4 space-y-1.5">
                      <li>Evita términos excesivamente específicos (ej. "sunroof importado").</li>
                      <li>Intenta consultas enfocadas en necesidades (ej. "camioneta económica automática").</li>
                      <li>Prueba modificando tus filtros en el panel izquierdo.</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleClearSemantic}
                    className="btn-primary mt-6 text-sm py-2.5 px-6 flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Restablecer Catálogo Completo
                  </button>
                </div>

                {/* Alternativas Recomendadas */}
                <div className="space-y-6">
                  <div className="border-t border-border pt-10">
                    <h3 className="text-lg font-extrabold text-text-main tracking-tight mb-2">
                      Te sugerimos estas alternativas destacadas:
                    </h3>
                    <p className="text-sm text-text-muted">
                      Vehículos recomendados con excelente relación costo-beneficio en Cali.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {alternativasDestacadas.map((vehiculo, i) => (
                      <TarjetaVehiculo key={`alt-${vehiculo.id}`} vehiculo={vehiculo} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Estado Vacío Estándar */
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
                  className="btn-primary mt-6 text-sm py-2.5 px-6"
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
