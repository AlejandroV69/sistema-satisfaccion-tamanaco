/**
 * @file Modal.jsx
 * @description Componente de ventana modal flotante reutilizable con bloqueo de scroll,
 * soporte de tecla Escape y animaciones de apertura.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Componente Modal
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Determina si la ventana modal está visible.
 * @param {Function} props.onClose - Callback invocado al cerrar la modal.
 * @param {string} props.title - Título del encabezado de la modal.
 * @param {React.ReactNode} props.children - Contenido interior de la modal.
 * @returns {JSX.Element|null} Ventana modal renderizada o null si está cerrada.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Manejo de eventos de teclado (Escape) y bloqueo de scroll en el body
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Si no está abierta, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo oscuro semitransparente (Overlay) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Contenido principal de la modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Cabecera de la Modal */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-serif font-bold text-slate-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Cuerpo con scroll interno si sobrepasa la altura */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

