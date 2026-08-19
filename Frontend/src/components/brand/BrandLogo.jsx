/**
 * @file BrandLogo.jsx
 * @description Componente vectorial SVG para la representación del logotipo de la marca "TAMANACO"
 * con degradado dorado y subtítulo opcional.
 */

import React from 'react';

/**
 * Componente BrandLogo
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.className="h-12"] - Clases CSS de dimensionamiento.
 * @param {boolean} [props.showTagline=false] - Muestra el lema institucional "Patrimonio de Distinción".
 * @returns {JSX.Element} Logotipo vectorial de la marca.
 */
const BrandLogo = ({ className = "h-12", showTagline = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className} overflow-visible`}>
      {/* SVG del isotipo/logotipo con degradado dorado */}
      <svg 
        viewBox="0 0 540 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Degradado metálico dorado */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="25%" stopColor="#FCF6BA" />
            <stop offset="50%" stopColor="#B38728" />
            <stop offset="75%" stopColor="#FBF5B7" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
          
          {/* Filtro de resplandor suave */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Texto principal TAMANACO */}
        <text
          x="50%"
          y="65"
          textAnchor="middle"
          fill="url(#goldGradient)"
          style={{
            fontFamily: "'Inter', 'Montserrat', sans-serif",
            fontSize: "48px",
            fontWeight: "800",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))"
          }}
        >
          TAMANACO
        </text>
      </svg>
      
      {/* Lema institucional opcional */}
      {showTagline && (
        <span className="text-[#C5A02D] text-[10px] uppercase tracking-[0.6em] mt-2 font-bold opacity-80">
          Patrimonio de Distinción
        </span>
      )}
    </div>
  );
};

export default BrandLogo;

