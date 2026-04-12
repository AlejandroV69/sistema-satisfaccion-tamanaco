import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronDown,
  X,
  Menu
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const [statsOpen, setStatsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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

  const handleNavClick = () => {
    if (onClose) onClose(); // close on mobile after navigating
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Mobile close button */}
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo" onClick={handleNavClick}>
            TAMANACO
          </NavLink>
          <span className="sidebar-subtitle">Satisfaction System</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
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
                <NavLink to="/stats/recepcion" className={({isActive}) => `submenu-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>Recepción</NavLink>
                <NavLink to="/stats/habitaciones" className={({isActive}) => `submenu-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>Habitaciones</NavLink>
                <NavLink to="/stats/restaurante" className={({isActive}) => `submenu-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>Restaurante</NavLink>
                <NavLink to="/stats/areas-comunes" className={({isActive}) => `submenu-link ${isActive ? 'active' : ''}`} onClick={handleNavClick}>Áreas Comunes</NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/surveys"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <ClipboardList size={20} />
            <span>Gestión de Encuestas</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
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
    </>
  );
};

export default Sidebar;
