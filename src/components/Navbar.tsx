import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-500 text-white p-2 rounded-lg">
                <Car size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">SPEED CAR</span>
            </Link>
          </div>
          <div className="flex items-center">
            <a 
              href="https://wa.me/573137148566?text=Hola,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20para%20vender%20mi%20carro." 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-600 font-medium hover:text-brand-700 transition-colors hidden sm:block mr-6"
            >
              Vende tu Carro
            </a>
            <a 
              href="https://wa.me/573137148566?text=Hola,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20para%20vender%20mi%20carro." 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
