import { useState, useRef, useEffect } from 'react';

interface Props {
  srcOriginal: string;
  srcZoom?: string;
  altText: string;
}

export default function ImageEcommerceMagnifier({ srcOriginal, srcZoom, altText }: Props) {
  const [showZoom, setShowZoom] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomBgPos, setZoomBgPos] = useState('0% 0%');
  const [zoomPanelStyle, setZoomPanelStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const LENS_W = 130;
  const LENS_H = 130;
  const ZOOM_FACTOR = 3.5;
  const PANEL_SIZE = 400;

  // Actualizar posición del panel de zoom al hacer scroll o resize
  useEffect(() => {
    const updatePanelPosition = () => {
      if (!containerRef.current) return;
      const { right, top } = containerRef.current.getBoundingClientRect();
      setZoomPanelStyle({
        position: 'fixed',
        left: `${right + 16}px`,
        top: `${top}px`,
        width: `${PANEL_SIZE}px`,
        height: `${PANEL_SIZE}px`,
        zIndex: 9999,
      });
    };

    updatePanelPosition();
    window.addEventListener('scroll', updatePanelPosition, { passive: true });
    window.addEventListener('resize', updatePanelPosition);
    return () => {
      window.removeEventListener('scroll', updatePanelPosition);
      window.removeEventListener('resize', updatePanelPosition);
    };
  }, [showZoom]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    let x = e.clientX - left;
    let y = e.clientY - top;

    // Limitar la lente dentro del contenedor
    if (x < LENS_W / 2) x = LENS_W / 2;
    if (x > width - LENS_W / 2) x = width - LENS_W / 2;
    if (y < LENS_H / 2) y = LENS_H / 2;
    if (y > height - LENS_H / 2) y = height - LENS_H / 2;

    setLensPosition({ x: x - LENS_W / 2, y: y - LENS_H / 2 });

    // Calcular % de posición para el fondo del panel de zoom
    const percentX = ((x - LENS_W / 2) / (width - LENS_W)) * 100;
    const percentY = ((y - LENS_H / 2) / (height - LENS_H)) * 100;
    setZoomBgPos(`${percentX}% ${percentY}%`);
  };

  const finalZoomSrc = srcZoom || srcOriginal;

  return (
    <>
      {/* Imagen principal con lente */}
      <div
        ref={containerRef}
        className="relative w-full h-full bg-surface-alt rounded-xl overflow-hidden border border-border cursor-crosshair"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
        aria-label={`Imagen de ${altText}. Pasa el cursor para ver detalles.`}
      >
        <img
          src={srcOriginal}
          alt={altText}
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Lente traslúcida */}
        {showZoom && (
          <div
            className="absolute border-2 border-primary/50 bg-primary/15 backdrop-blur-[1px] pointer-events-none rounded-md shadow-inner"
            style={{
              width: `${LENS_W}px`,
              height: `${LENS_H}px`,
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
            }}
            role="presentation"
          />
        )}

        {/* Indicador de instrucción */}
        <div
          className={`absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none transition-opacity duration-200 ${showZoom ? 'opacity-0' : 'opacity-100'}`}
        >
          Pasa el cursor para ampliar
        </div>
      </div>

      {/* Panel de zoom: usa fixed para escapar de cualquier overflow-hidden padre */}
      {showZoom && (
        <div
          className="hidden lg:block rounded-2xl border-2 border-border shadow-2xl bg-surface overflow-hidden animate-fade-in"
          style={zoomPanelStyle}
          role="presentation"
          aria-hidden="true"
        >
          <div
            className="w-full h-full bg-no-repeat"
            style={{
              backgroundImage: `url(${finalZoomSrc})`,
              backgroundSize: `${ZOOM_FACTOR * 100}% ${ZOOM_FACTOR * 100}%`,
              backgroundPosition: zoomBgPos,
            }}
          />
        </div>
      )}
    </>
  );
}
