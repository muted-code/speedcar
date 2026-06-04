export default function TarjetaVehiculoSkeleton() {
  return (
    <div 
      className="card flex flex-col h-full animate-pulse border border-border bg-surface rounded-2xl overflow-hidden shadow-sm"
      aria-hidden="true"
    >
      {/* ── Imagen Shimmer ── */}
      <div className="aspect-video bg-surface-alt relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
      </div>

      {/* ── Contenido Shimmer ── */}
      <div className="flex flex-col flex-grow p-5 gap-4">
        {/* Encabezado */}
        <div className="space-y-2">
          {/* Título (Marca + Modelo) */}
          <div className="h-6 bg-surface-alt rounded-lg w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
          {/* Subtítulo (Año + Transmisión) */}
          <div className="h-4 bg-surface-alt rounded-lg w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>

        {/* Especificaciones rápidas */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-surface-alt rounded-lg w-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="h-4 bg-surface-alt rounded-lg w-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>

        {/* Precio + Botón */}
        <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
          {/* Precio */}
          <div className="h-8 bg-surface-alt rounded-lg w-2/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
          {/* Botón WhatsApp */}
          <div className="h-11 bg-surface-alt rounded-xl w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/50 to-transparent bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
