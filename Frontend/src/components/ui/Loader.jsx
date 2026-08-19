/**
 * @file Loader.jsx
 * @description Componente de indicador de carga animado (spinner) configurable en pantalla completa o contenedor local.
 */

import React from 'react';

/**
 * Componente Loader
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} [props.fullPage=false] - Define si el loader cubre toda la pantalla.
 * @param {string} [props.message="Cargando..."] - Texto explicativo mostrado debajo del spinner.
 * @returns {JSX.Element} Componente de carga.
 */
const Loader = ({ fullPage = false, message = "Cargando..." }) => {
  // Elemento spinner de carga animado
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#C5A02D] border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && <p className="text-slate-500 font-medium animate-pulse">{message}</p>}
    </div>
  );

  // Renderizado en pantalla completa con fondo borroso
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  // Renderizado dentro de un contenedor estándar
  return (
    <div className="w-full py-12 flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;

