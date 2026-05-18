import type { Vehiculo } from '../types';

export const mockVehiculos: Vehiculo[] = [
  {
    id: "1",
    creado: Date.now(),
    destacado: true,
    marca: "Mazda",
    modelo: "CX-30 Grand Touring LX",
    año: 2022,
    precio: 111600000,
    kilometraje: 29000,
    placa_final: 1,
    transmision: "Automático",
    color: "Rojo Diamante",
    descripcion_marketing: "Vehículo en perfecto estado, único dueño. Mantenimientos al día en concesionario. Diseño elegante y deportivo, ideal para la ciudad y carretera. Aprovecha esta oportunidad.",
    urls_imagenes: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "2",
    creado: Date.now() - 86400000,
    destacado: false,
    marca: "Chevrolet",
    modelo: "Tracker Turbo",
    año: 2021,
    precio: 75500000,
    kilometraje: 45000,
    placa_final: 4,
    transmision: "Automático",
    color: "Gris",
    descripcion_marketing: "Excelente SUV familiar. Espaciosa, económica en consumo y con toda la tecnología que necesitas. Pantalla táctil, cámara de reversa y sensores.",
    urls_imagenes: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "3",
    creado: Date.now() - 172800000,
    destacado: true,
    marca: "Toyota",
    modelo: "Corolla Cross",
    año: 2023,
    precio: 135000000,
    kilometraje: 15000,
    placa_final: 8,
    transmision: "Automático",
    color: "Blanco Perlado",
    descripcion_marketing: "Como nueva. La confiabilidad de Toyota en un formato SUV moderno. Híbrida, no tiene pico y placa. Excelente rendimiento de combustible.",
    urls_imagenes: [
      "https://images.unsplash.com/photo-1626668893632-6f0a44733db9?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "4",
    creado: Date.now() - 259200000,
    destacado: false,
    marca: "Kia",
    modelo: "Picanto Zenith",
    año: 2020,
    precio: 42000000,
    kilometraje: 60000,
    placa_final: 5,
    transmision: "Mecánico",
    color: "Plata",
    descripcion_marketing: "Ideal para la ciudad. Muy económico, fácil de estacionar. Mantenimientos económicos. Perfecto como primer carro.",
    urls_imagenes: [
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
