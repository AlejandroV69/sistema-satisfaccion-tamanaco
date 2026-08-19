/**
 * @file App.jsx
 * @description Componente principal de la aplicación que gestiona la estructura de rutas
 * públicas y protegidas del sistema de satisfacción Hotel Tamanaco.
 */

import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import SurveyList from "./pages/SurveyList";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/layout/ProtectedRoute";

/**
 * Componente principal App
 * @returns {JSX.Element} Estructura de navegación y rutas de React Router
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* --- RUTAS PÚBLICAS (Con navegación superior Navbar) --- */}
          <Route element={<><Navbar /><div className="pt-20 md:pt-24"><Outlet /></div></>}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/survey" element={<Survey />} />
          </Route>
          
          {/* --- RUTA DE INICIO DE SESIÓN --- */}
          <Route path="/login" element={<Login />} />

          {/* --- RUTAS ADMINISTRATIVAS PROTEGIDAS (Con barra lateral AdminLayout) --- */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/stats/:serviceId" element={<Stats />} />
              <Route path="/surveys" element={<SurveyList />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;