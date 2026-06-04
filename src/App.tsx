import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vender from './pages/Vender';
import VehiculoDetail from './pages/VehiculoDetail';

import AdminUpload from './pages/AdminUpload';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface-alt">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vender" element={<Vender />} />
            <Route path="/vehiculo/:id" element={<VehiculoDetail />} />
            <Route path="/admin/upload" element={<AdminUpload />} />
          </Routes>
        </div>
        <footer className="bg-surface border-t border-border mt-auto py-6 text-center text-text-muted text-sm">
          © {new Date().getFullYear()} SPEED CAR · Portal de Vehículos Usados en Cali · Todos los derechos reservados.
        </footer>
      </div>
    </Router>
  );
}

export default App;
