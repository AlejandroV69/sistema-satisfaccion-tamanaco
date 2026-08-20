/**
 * @file CustomSelect.jsx
 * @description Componente selector desplegable estilizado con estética Luxury (Hotel Tamanaco).
 * Reemplaza los selects nativos del navegador por menús flotantes personalizados con esquinas redondeadas,
 * sombras suaves e indicadores visuales dorados.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ value, onChange, options = [], className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Encontrar opción seleccionada
  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0];

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue } });
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Botón activador del selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-700 outline-none hover:border-[#C5A02D]/50 focus:ring-4 focus:ring-accent/5 transition-all shadow-xs cursor-pointer min-w-[200px]"
      >
        <span className="truncate">{selectedOption?.label || ''}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#C5A02D]' : ''}`} />
      </button>

      {/* Menú Flotante Personalizado */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1.5">
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-amber-50/70 text-[#C5A02D] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="text-[#C5A02D] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
