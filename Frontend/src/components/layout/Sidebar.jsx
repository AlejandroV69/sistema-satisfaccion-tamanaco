import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './Sidebar.css';

const Sidebar = () => {
  const [statsOpen, setStatsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Force a hard refresh to clear all app state and prevent 'Back' button session re-entry
      window.location.replace('/login');
    } catch (error) {
      console.error('Error closing session:', error.message);
      alert('Error al cerrar sesión');
    }
  };

  const toggleStats = (e) => {
    e.preventDefault();
    setStatsOpen(!statsOpen);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo">
          TAMANACO
        </NavLink>
        <span className="sidebar-subtitle">Satisfaction System</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Inicio</span>
        </NavLink>

        <div className={`sidebar-item-group ${statsOpen ? 'open' : ''}`}>
          <a 
            href="#" 
            className={`sidebar-link has-submenu ${statsOpen ? 'open' : ''}`}
            onClick={toggleStats}
          >
            <BarChart3 size={20} />
            <span>Estadísticas</span>
            <ChevronDown size={16} className="chevron-icon" />
          </a>
          
          {statsOpen && (
            <div className="submenu">
              <NavLink to="/stats/recepcion" className="submenu-link">Recepción</NavLink>
              <NavLink to="/stats/habitaciones" className="submenu-link">Habitaciones</NavLink>
              <NavLink to="/stats/restaurante" className="submenu-link">Restaurante</NavLink>
              <NavLink to="/stats/areas-comunes" className="submenu-link">Áreas Comunes</NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/surveys"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <ClipboardList size={20} />
          <span>Gestión de Encuestas</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
