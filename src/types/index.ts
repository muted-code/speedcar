import { Timestamp } from 'firebase/firestore';

export interface Vehiculo {
  id: string; // Único
  creado: Timestamp | Date | number; // Fecha de publicación
  destacado: boolean; // Para ordenarlos al principio
  
  // Datos Críticos (Visibles en la Tarjeta)
  marca: string;      // Ej: Mazda
  modelo: string;     // Ej: CX-30
  año: number;        // Ej: 2022
  precio: number;      // Ej: 111600000
  kilometraje: number; // Ej: 29000
  placa_final: number; // Ej: 1 (Crítico para Pico y Placa)
  
  // Datos Detalles
  transmision: "Automático" | "Mecánico";
  color: string;
  descripcion_marketing: string; // Texto descriptivo para la venta
  
  // Multimedia
  urls_imagenes: string[]; // Lista de URLs de Firebase Storage
  url_video_corto?: string; // Opcional (TikTok/Reel link)
}
