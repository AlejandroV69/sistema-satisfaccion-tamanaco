import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../brand/BrandLogo';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { title: "Inicio", path: "/" },
    { title: "Iniciar Sesión", path: "/login", primary: true },
  ];

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-[#C5A01D] px-4 md:px-12 py-3 flex justify-between items-center shadow-2xl fixed top-0 w-full z-[100]">
        {/* Lado Izquierdo: Botón de Menú (Hamburguesa) */}
        <button 
          onClick={toggleMenu}
          className="text-[#D4AF37] hover:bg-white/5 p-2 rounded-full transition-all duration-300 flex items-center gap-3 group order-1"
        >
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold">Menú</span>
        </button>

        {/* Centro: Branding con Logo Mejorado */}
        <div className="flex items-center justify-center flex-1 order-2">
          <Link to="/" className="flex items-center group transition-all hover:scale-105 active:scale-95">
            <BrandLogo className="h-14 md:h-16 w-auto" />
          </Link>
        </div>

        {/* Espaciador para equilibrar */}
        <div className="w-10 md:w-24 order-3"></div>
      </nav>

      {/* Sidebar Navigation (Left Side) */}
      <div 
        className={`fixed inset-0 z-[200] transition-all duration-500 ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
      >
        {/* Dark Overlay */}
        <div 
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleMenu}
        ></div>

        {/* The Sidebar (Miniature width for 2 links) */}
        <div 
          className={`absolute top-0 left-0 h-full w-[80%] md:w-[320px] bg-slate-900 border-r border-[#C5A02D]/30 shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header del Sidebar */}
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#C5A02D] font-bold">Menú</p>
            <button 
              onClick={toggleMenu}
              className="text-white/60 hover:text-[#D4AF37] transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links del Sidebar - Ultra Compactos */}
          <div className="flex-1 flex flex-col justify-center p-10 md:p-12 space-y-8">
            {navLinks.map((link, index) => (
              <Link 
                key={link.title}
                to={link.path}
                onClick={toggleMenu}
                className="group relative flex items-center gap-5 transition-all duration-500 text-[#D4AF37]"
              >
                <div className="h-px w-0 bg-[#D4AF37] group-hover:w-8 transition-all duration-700"></div>
                <span className="text-xl md:text-2xl font-serif italic tracking-tight group-hover:translate-x-2 transition-transform group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  {link.title}
                </span>
              </Link>
            ))}
          </div>

          {/* Footer del Sidebar */}
          <div className="p-12 border-t border-white/5">
            <p className="text-white/30 text-[9px] uppercase tracking-widest leading-relaxed">
              Hotel Tamanaco Caracas <br/>
              Distinción Legendaria
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;