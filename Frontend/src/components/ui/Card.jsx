/**
 * @file Card.jsx
 * @description Componente de tarjeta reutilizable con cabecera opcional, icono y acciones personalizadas.
 */

import React from 'react';

/**
 * Componente Card
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido interior de la tarjeta.
 * @param {string} [props.title] - Título para el encabezado de la tarjeta.
 * @param {React.ComponentType} [props.icon] - Icono opcional a mostrar junto al título.
 * @param {string} [props.className=''] - Clases CSS adicionales.
 * @param {React.ReactNode} [props.headerAction] - Elemento o botón opcional en el lado derecho de la cabecera.
 * @returns {JSX.Element} Tarjeta contenedora.
 */
const Card = ({ children, title, icon: Icon, className = '', headerAction }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {/* Cabecera de la tarjeta (si se proporciona título o icono) */}
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <span className="text-accent flex items-center justify-center"><Icon size={20} /></span>}
            {title && <h3 className="text-lg font-serif text-slate-900 m-0">{title}</h3>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Cuerpo principal */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;


