/**
 * @file Sidebar.jsx
 * @description Barra lateral de navegación para el panel de administración con enlaces a Inicio,
 * Estadísticas, Gestión de Encuestas y Configuración, además del botón de cierre de sesión.
 */

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

/**
 * Componente Sidebar
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Define si el sidebar móvil está desplegado.
 * @param {Function} props.onClose - Callback para cerrar el menú móvil.
 * @returns {JSX.Element} Panel de navegación lateral.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  /**
   * Cierra la sesión activa del usuario en Supabase Auth y redirige al login.
   */
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

  /**
   * Cierra el panel lateral en vistas móviles al hacer clic en un enlace de navegación.
   */
  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Capa traslúcida móvil para cerrar al hacer clic afuera */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Botón de cierre para móviles */}
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Encabezado del Sidebar */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo" onClick={handleNavClick}>
            TAMANACO
          </NavLink>
          <span className="sidebar-subtitle">Satisfaction System</span>
        </div>

        {/* Navegación Principal */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <LayoutDashboard size={20} />
            <span>Inicio</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <BarChart3 size={20} />
            <span>Estadísticas</span>
          </NavLink>

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

        {/* Pie del Sidebar: Cierre de Sesión */}
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

