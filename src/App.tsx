import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VehiculoDetail from './pages/VehiculoDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehiculo/:id" element={<VehiculoDetail />} />
          </Routes>
        </div>
        <footer className="bg-white border-t border-gray-200 mt-auto py-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SPEED CAR. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
