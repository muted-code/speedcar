# Sistema de Diseño de Speed Car
## Configuración de Interfaz (Interface Design)

### Dirección Estética y Sensación
* **Estilo**: Premium, deportivo y de alta gama. Inspirado en clústeres de instrumentos de superdeportivos modernos.
* **Sensación**: Técnico, fiable, interactivo y veloz.

### Paleta de Colores (HSL)
* **Negro Asfalto/Carbono**: `hsl(220, 25%, 10%)` (Alta jerarquía de texto y bases).
* **Cobre Cognac**: `hsl(35, 75%, 50%)` (Acentos de exclusividad y advertencias de Pico y Placa).
* **Verde Caliper**: `hsl(158, 95%, 35%)` (Color de marca primario para CTAs, checks de peritaje e indicadores "aprobado").
* **Gris Niebla Caleña**: `hsl(215, 15%, 97%)` (Lienzo secundario y fondos).
* **Superficies Recesivas (Inset)**: `hsl(var(--color-surface-inset))` (Para inputs y selectores).

### Tipografía
* **Títulos y Encabezados**: `Plus Jakarta Sans` (Geométrica, moderna y deportiva).
* **Cuerpo e Información**: `Inter` (Neutral y de alta legibilidad).
* **Cifras Técnicas y Precios**: `JetBrains Mono` (Estilo instrumental digital).

### Estrategia de Profundidad
* **Bordes**: Finos y de baja opacidad (`border-border/80`).
* **Sombras**: Sombras sutiles y suaves en modo claro; bordes técnicos puros en modo oscuro.

### Componentes de Firma (Signature)
1. **Validador Caleño de Pico y Placa**: Widget con indicador luminoso interactivo (verde/rojo) que evalúa la restricción vial del día de hoy en Cali en tiempo real.
2. **Reporte de Peritaje 360°**: Módulo interactivo con pestañas táctiles de diagnóstico para verificar el estado de los componentes críticos (Motor, Chasis, Eléctrico, Legal).
3. **SmartSearchBar (Buscador IA)**: Barra inteligente con placeholders dinámicos de efecto typewriter y resplandor de foco.
