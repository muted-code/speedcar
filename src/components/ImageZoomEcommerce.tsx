import { useState, useRef } from 'react';

interface Props {
  src: string;
  alt: string;
}

export default function ImageZoomEcommerce({ src, alt }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calcular porcentaje de posición del mouse respecto al contenedor
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-xl bg-surface-alt aspect-video cursor-zoom-in border border-border group"
      aria-label="Contenedor de imagen con zoom interactivo. Pasa el cursor por encima para ampliar."
    >
      {/* Imagen Base */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-300"
        loading="eager"
      />
      
      {/* Lupa Fluida / Zoom Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out bg-no-repeat bg-cover ${
          showZoom ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: `${position.x}% ${position.y}%`,
          transform: showZoom ? 'scale(1.05)' : 'scale(1)',
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
        role="presentation"
      />

      {/* Indicador visual de zoom */}
      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none transition-opacity duration-200 group-hover:opacity-0">
        Pasar cursor para zoom
      </div>
    </div>
  );
}
