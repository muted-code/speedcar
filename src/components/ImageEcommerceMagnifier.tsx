import { useState, useRef } from 'react';

interface Props {
  src: string;
  alt: string;
}

export default function ImageEcommerceMagnifier({ src, alt }: Props) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [lensStyle, setLensStyle] = useState<React.CSSProperties>({});
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Posición del mouse relativa al contenedor
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Dimensiones de la lente (proporcional al tamaño del contenedor)
    const lensWidth = width / 3;
    const lensHeight = height / 3;

    // Centrar la lente en la posición del mouse
    let lensLeft = x - lensWidth / 2;
    let lensTop = y - lensHeight / 2;

    // Limitar la lente para que no salga del contenedor
    if (lensLeft < 0) lensLeft = 0;
    if (lensTop < 0) lensTop = 0;
    if (lensLeft > width - lensWidth) lensLeft = width - lensWidth;
    if (lensTop > height - lensHeight) lensTop = height - lensHeight;

    // Calcular porcentajes de desplazamiento
    const percentX = (lensLeft / (width - lensWidth)) * 100;
    const percentY = (lensTop / (height - lensHeight)) * 100;

    // Estilos de la lente traslúcida
    setLensStyle({
      left: `${lensLeft}px`,
      top: `${lensTop}px`,
      width: `${lensWidth}px`,
      height: `${lensHeight}px`,
    });

    // Estilos del panel de zoom a la derecha
    setZoomStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: `${percentX}% ${percentY}%`,
      backgroundSize: `${3 * 100}% ${3 * 100}%`, // Escala 3x coincidente con el tamaño de la lente
    });
  };

  return (
    <div className="relative w-full aspect-video select-none">
      
      {/* Contenedor de la Imagen Principal */}
      <div
        ref={containerRef}
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
        className="relative w-full h-full bg-surface-alt rounded-xl overflow-hidden border border-border cursor-crosshair"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Lente traslúcida estilo Amazon */}
        {showMagnifier && (
          <div
            className="absolute border border-primary/40 bg-primary/10 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-[opacity] duration-100 ease-out"
            style={lensStyle}
          />
        )}
      </div>

      {/* Panel de Zoom separado flotante a la derecha */}
      {showMagnifier && (
        <div
          className="absolute left-[calc(100%+16px)] top-0 w-full h-full hidden lg:block rounded-xl border border-border shadow-2xl bg-surface overflow-hidden z-40 animate-fade-in"
          role="presentation"
        >
          <div
            className="w-full h-full bg-no-repeat"
            style={zoomStyle}
          />
        </div>
      )}

      {/* Indicador visual de zoom e instrucciones para accesibilidad */}
      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none transition-opacity duration-200 lg:group-hover:opacity-0">
        Pasa el cursor para ver detalles en alta resolución
      </div>
    </div>
  );
}
