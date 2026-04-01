import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Survey from './pages/Survey';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Huésped */}
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        
        {/* Rutas para el Hotel (Administración) */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
