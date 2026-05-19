import { X, Search, DollarSign, Calendar, Hash, RotateCcw } from 'lucide-react';

export interface FiltrosState {
  busqueda: string;
  precioMin: string;
  precioMax: string;
  anioMin: string;
  anioMax: string;
  placas: number[];
  transmision: string;
}

interface Props {
  filtros: FiltrosState;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosState>>;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ANIOS_DISPONIBLES = Array.from(
  { length: 17 },
  (_, i) => String(new Date().getFullYear() + 1 - i)
);

export default function SidebarFilters({ filtros, setFiltros, onClear, isOpen, onClose }: Props) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePlaca = (num: number) => {
    setFiltros((prev) => {
      const exists = prev.placas.includes(num);
      const newPlacas = exists
        ? prev.placas.filter((p) => p !== num)
        : [...prev.placas, num];
      return { ...prev, placas: newPlacas };
    });
  };

  const Content = () => (
    <div className="space-y-6">
      {/* Encabezado Filtros */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          Criterios de Búsqueda
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-text-muted hover:text-primary flex items-center gap-1.5 transition-colors"
          aria-label="Limpiar todos los filtros"
        >
          <RotateCcw size={13} />
          Limpiar
        </button>
      </div>

      {/* 1. Búsqueda por Texto */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
          Marca o Modelo
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            name="busqueda"
            value={filtros.busqueda}
            onChange={handleInputChange}
            placeholder="Ej. Mazda, Tracker..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
      </div>

      {/* 2. Rango de Precio */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
          Precio (COP)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="number"
              name="precioMin"
              value={filtros.precioMin}
              onChange={handleInputChange}
              placeholder="Desde"
              className="w-full pl-7 pr-2 py-2 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="number"
              name="precioMax"
              value={filtros.precioMax}
              onChange={handleInputChange}
              placeholder="Hasta"
              className="w-full pl-7 pr-2 py-2 rounded-xl border border-border bg-surface text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* 3. Año */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
          <Calendar size={13} />
          Año del Modelo
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="anioMin"
            value={filtros.anioMin}
            onChange={handleInputChange}
            className="w-full px-2 py-2 rounded-xl border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
            aria-label="Año mínimo"
          >
            <option value="">Desde</option>
            {ANIOS_DISPONIBLES.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            name="anioMax"
            value={filtros.anioMax}
            onChange={handleInputChange}
            className="w-full px-2 py-2 rounded-xl border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
            aria-label="Año máximo"
          >
            <option value="">Hasta</option>
            {ANIOS_DISPONIBLES.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transmisión */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
          Transmisión
        </label>
        <select
          name="transmision"
          value={filtros.transmision}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
          aria-label="Filtrar por transmisión"
        >
          <option value="Todos">Todos</option>
          <option value="Automático">Automático</option>
          <option value="Mecánico">Mecánico</option>
        </select>
      </div>

      {/* 4. Pico y Placa (CRÍTICO) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
          <Hash size={13} />
          Último dígito Placa
        </label>
        <p className="text-[11px] text-text-muted leading-snug">
          Selección múltiple para verificar restricción de pico y placa.
        </p>
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => togglePlaca(i)}
              className={`h-9 w-full rounded-lg font-bold text-xs flex items-center justify-center transition border ${
                filtros.placas.includes(i)
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                  : 'bg-surface hover:bg-surface-alt border-border text-text-main'
              }`}
              aria-pressed={filtros.placas.includes(i)}
              aria-label={`Dígito de placa ${i}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Versión Desktop: Sidebar fija/sticky */}
      <aside className="hidden lg:block w-[300px] flex-shrink-0">
        <div className="sticky top-24 bg-surface rounded-2xl border border-border p-6 shadow-card space-y-6">
          <Content />
        </div>
      </aside>

      {/* Versión Mobile: Drawer deslizable */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay oscuro */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Panel lateral deslizable */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-[310px] max-w-[85vw] bg-surface p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out border-r border-border ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="overflow-y-auto pr-1 pb-6">
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-text-muted hover:bg-surface-alt transition-colors"
                aria-label="Cerrar panel de filtros"
              >
                <X size={20} />
              </button>
            </div>
            <Content />
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full py-3 rounded-xl font-bold mt-auto"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </>
  );
}
