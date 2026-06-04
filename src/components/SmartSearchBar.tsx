import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface Props {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

const PLACEHOLDERS = [
  "Busca: 'Camioneta familiar automática de menos de 80 millones'",
  "Busca: 'Carro económico mecánico para la ciudad'",
  "Busca: 'SUV Toyota con pico y placa terminado en 8'",
  "Busca: 'Mazda rojo con kilometraje bajo y techo corredizo'",
  "Busca: 'Vehículo familiar con motor turbo y excelente consumo'"
];

export default function SmartSearchBar({ onSearch, isLoading, onClear }: Props) {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const placeholderTimerRef = useRef<number | null>(null);

  // Efecto Typewriter para el Placeholder dinámico
  useEffect(() => {
    let currentText = PLACEHOLDERS[placeholderIndex];
    let charIndex = 0;
    let isDeleting = false;
    
    const tick = () => {
      if (isDeleting) {
        setDisplayedPlaceholder(currentText.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setDisplayedPlaceholder(currentText.substring(0, charIndex + 1));
        charIndex++;
      }

      let delta = 80 - Math.random() * 30; // velocidad de tipeo

      if (isDeleting) {
        delta /= 2; // borrar más rápido
      }

      if (!isDeleting && charIndex === currentText.length) {
        delta = 2500; // pausa cuando termina de escribir
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        delta = 500; // pausa antes de iniciar la siguiente palabra
      }

      placeholderTimerRef.current = window.setTimeout(tick, delta);
    };

    tick();

    return () => {
      if (placeholderTimerRef.current) {
        clearTimeout(placeholderTimerRef.current);
      }
    };
  }, [placeholderIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-4xl mx-auto mb-10"
      aria-label="Buscador inteligente con IA"
    >
      <div className="relative group">
        {/* Glow de fondo animado en focus */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-primary-light rounded-3xl blur opacity-25 group-focus-within:opacity-40 transition duration-500 pointer-events-none" />
        
        <div className="relative flex items-center bg-surface border border-border rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all duration-300 overflow-hidden">
          
          {/* Icono Sparkles IA a la izquierda */}
          <div className="pl-4 flex items-center text-primary" aria-hidden="true">
            <Sparkles size={20} className="animate-pulse" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={displayedPlaceholder}
            className="w-full py-4 pl-3 pr-12 bg-transparent text-text-main placeholder:text-text-muted text-base md:text-lg focus:outline-none"
            aria-label="Buscar vehículos con Inteligencia Artificial"
          />

          {/* Botón de limpiar input */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-28 p-2 text-text-muted hover:text-text-main transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X size={18} />
            </button>
          )}

          {/* Botón de búsqueda */}
          <button
            type="submit"
            disabled={isLoading}
            className="mr-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm md:text-base flex items-center gap-2 shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={18} />
            )}
            <span>Buscar con IA</span>
          </button>
        </div>
      </div>
    </form>
  );
}
