/**
 * @file AdminLayout.jsx
 * @description Estructura de maquetación principal para la sección administrativa.
 * Incluye la barra lateral (Sidebar), barra superior responsive (topbar) y el contenedor de páginas.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

/**
 * Componente AdminLayout
 * @returns {JSX.Element} Layout con Sidebar y área principal de contenido (<Outlet />)
 */
const AdminLayout = () => {
  // Estado para controlar la visibilidad del Sidebar en dispositivos móviles
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Visible por defecto en desktop; menú desplegable en móvil */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Áreas de contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior de administración (Top bar) */}
        <header className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="admin-menu-btn"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <span className="admin-topbar-title">TAMANACO</span>
          <div className="admin-topbar-spacer" />
        </header>

        {/* Zona de renderizado de la ruta actual */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

