/**
 * @file Input.jsx
 * @description Componente de entrada de texto reutilizable con etiqueta, icono y mensaje de error.
 */

import React from 'react';

/**
 * Componente Input
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.label] - Etiqueta descriptiva del campo de entrada.
 * @param {React.ComponentType} [props.icon] - Icono opcional a la izquierda.
 * @param {string} [props.error] - Mensaje de error para mostrar validaciones de formulario.
 * @param {string} [props.className=''] - Clases CSS adicionales para el contenedor.
 * @returns {JSX.Element} Campo de texto personalizado.
 */
const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Etiqueta del input */}
      {label && (
        <label className="text-sm font-semibold text-slate-600 ml-1">
          {label}
        </label>
      )}
      
      {/* Contenedor del campo de entrada e icono */}
      <div className={`
        relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-200
        ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/5 focus-within:bg-white'}
      `}>
        {Icon && (
          <div className="pl-4 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full bg-transparent py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none
            ${Icon ? 'pl-2' : 'pl-4'}
          `}
          {...props}
        />
      </div>
      
      {/* Mensaje de error */}
      {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
    </div>
  );
};

export default Input;

