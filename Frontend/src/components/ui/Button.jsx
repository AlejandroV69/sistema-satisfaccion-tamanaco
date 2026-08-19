/**
 * @file Button.jsx
 * @description Componente de botón reutilizable con múltiples variantes de estilo,
 * tamaños e indicador de carga opcional.
 */

import React from 'react';

/**
 * Componente Button
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido del botón.
 * @param {'primary'|'accent'|'outline'|'danger'} [props.variant='primary'] - Variante de estilo visual.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Tamaño del botón.
 * @param {string} [props.className=''] - Clases CSS adicionales.
 * @param {React.ComponentType} [props.icon] - Componente de icono opcional (Lucide icon).
 * @param {boolean} [props.loading=false] - Define si muestra un spinner de carga.
 * @returns {JSX.Element} Botón personalizado.
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon, 
  loading = false,
  ...props 
}) => {
  // Configuración de variantes de estilo
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-95',
    accent: 'bg-[#C5A02D] text-white hover:bg-[#D4AF37] shadow-md shadow-[#C5A02D]/20 active:scale-95',
    outline: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95',
    danger: 'bg-white border border-red-100 text-red-500 hover:bg-red-50 active:scale-95'
  };

  // Configuración de tamaños del botón
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg font-bold'
  };

  return (
    <button 
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {/* Muestra spinner si está cargando, o icono si está definido */}
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
};

export default Button;

