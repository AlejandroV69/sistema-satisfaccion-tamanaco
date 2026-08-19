/**
 * @file CountrySelect.jsx
 * @description Componente de selección de país y código telefónico con banderas optimizadas en imágenes PNG/SVG (flagcdn)
 * totalmente compatible con Windows, Mac, iOS y Android, con soporte para búsqueda rápida y diseño elegante.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { allCountries } from '../../data/countries';

const CountrySelect = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // País actualmente seleccionado
  const selectedCountry = allCountries.find(c => c.dial_code === value) || allCountries[0];

  // Filtrar lista por nombre, código ISO o prefijo telefónico
  const filteredCountries = allCountries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.dial_code.includes(searchTerm)
  );

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

  const handleSelect = (country) => {
    onChange({ target: { name: 'country_code', value: country.dial_code } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Botón Principal del Select */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100/80 focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all cursor-pointer h-full min-w-[110px]"
      >
        <img
          src={`https://flagcdn.com/20x15/${selectedCountry.code.toLowerCase()}.png`}
          alt={selectedCountry.name}
          className="w-5 h-3.5 object-cover rounded-xs shadow-xs shrink-0"
          loading="lazy"
        />
        <span className="text-slate-800 font-bold">{selectedCountry.dial_code}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú Desplegable con Búsqueda */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Input de Búsqueda */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar país o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-accent text-slate-700"
                autoFocus
              />
            </div>
          </div>

          {/* Lista Scrollable de Países */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 py-1 scrollbar-thin">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 italic">No se encontraron países</div>
            ) : (
              filteredCountries.map((c, idx) => {
                const isSelected = c.dial_code === value;
                return (
                  <button
                    key={`${c.code}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-amber-50/60 font-bold text-[#C5A02D]' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={`https://flagcdn.com/20x15/${c.code.toLowerCase()}.png`}
                        alt={c.name}
                        className="w-5 h-3.5 object-cover rounded-xs shadow-xs shrink-0"
                        loading="lazy"
                      />
                      <span className="truncate max-w-[130px] font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-slate-500">{c.dial_code}</span>
                      {isSelected && <Check size={14} className="text-[#C5A02D]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
