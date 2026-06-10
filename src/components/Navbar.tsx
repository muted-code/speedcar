import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/comprar', label: 'Comprar (Vitrina)' },
    { to: '/vender', label: 'Vender mi Carro' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50 border-b border-border">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Bloque de Marca */}
        <Link
          to="/"
          className="flex items-center gap-0 hover:opacity-90 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Speed Car — Ir al inicio"
        >
          <img
            src="/logo.png"
            alt="Emblema de Speed Car"
            className="h-20 w-auto object-contain flex-shrink-0"
            loading="eager"
          />
          <img
            src="/words.png"
            alt="Logotipo SPEED CAR"
            className="h-16 w-auto object-contain flex-shrink-0 dark:invert transition-all duration-300 -ml-4"
            loading="eager"
          />
        </Link>

        {/* Links desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.to)
                ? 'bg-primary-light text-primary'
                : 'text-text-muted hover:text-text-main hover:bg-surface-alt'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/vender"
            className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            aria-label="Ir a la página de vender mi carro"
          >
            Vende tu Carro
          </Link>
          <a
            href="https://wa.me/573137148566?text=Hola%2C%20necesito%20asesor%C3%ADa%20sobre%20un%20veh%C3%ADculo."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2 !px-4 !text-sm"
            aria-label="Contactar asesor por WhatsApp"
          >
            Contáctanos
          </a>
        </div>

        {/* Botón menú móvil */}
        <button
          className="sm:hidden p-2 rounded-lg text-text-muted hover:bg-surface-alt transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Abrir menú de navegación"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-surface px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.to)
                ? 'bg-primary-light text-primary'
                : 'text-text-muted hover:text-text-main hover:bg-surface-alt'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between px-4 py-2 border-t border-b border-border">
            <span className="text-sm font-medium text-text-muted">Modo Oscuro</span>
            <ThemeToggle />
          </div>
          <Link
            to="/vender"
            className="block text-center btn-primary mt-2 !text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Vende tu Carro
          </Link>
        </div>
      )}
    </header>
  );
}
