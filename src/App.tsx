import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Carga diferida (Lazy Loading) para rutas pesadas
const Vender = lazy(() => import('./pages/Vender'));
const VehiculoDetail = lazy(() => import('./pages/VehiculoDetail'));
const AdminUpload = lazy(() => import('./pages/AdminUpload'));
const Vitrina = lazy(() => import('./pages/Vitrina'));

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface-alt">
        <Navbar />
        <div className="flex-grow">
          <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-text-muted">Cargando...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/comprar" element={<Vitrina />} />
              <Route path="/vender" element={<Vender />} />
              <Route path="/vehiculo/:id" element={<VehiculoDetail />} />
              <Route path="/admin/upload" element={<AdminUpload />} />
            </Routes>
          </Suspense>
        </div>
        <footer className="bg-surface border-t border-border mt-auto py-6 text-center text-text-muted text-sm">
          © {new Date().getFullYear()} SPEED CAR · Portal de Vehículos Usados en Cali · Todos los derechos reservados.
        </footer>
      </div>
    </Router>
  );
}

export default App;
