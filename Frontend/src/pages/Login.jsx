const Login = () => {
  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-20 px-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 p-12 rounded-sm shadow-2xl relative overflow-hidden group">
        {/* Decorative corner */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D4AF37]/10 rotate-45 group-hover:bg-[#D4AF37]/20 transition-all duration-700"></div>
        
        <div className="relative z-10 text-center">
          <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.6em] mb-4 font-bold">Portal de Acceso</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-tighter">Bienvenido</h2>
          
          <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-10"></div>
          
          <div className="space-y-8 text-center">
            <p className="text-slate-400 font-light leading-relaxed">
              El sistema de gestión del hotel se encuentra actualmente en fase de <span className="text-[#D4AF37] font-medium">mantenimiento programado</span>.
            </p>
            
            <div className="py-8 border-y border-white/5">
               <p className="text-slate-500 italic text-sm">
                 Por favor, contacte con el departamento de TI para accesos de emergencia o soporte técnico.
               </p>
            </div>

            <button className="w-full bg-transparent border border-[#C5A02D]/40 hover:bg-[#C5A02D] text-[#C5A02D] hover:text-white px-8 py-4 text-xs uppercase tracking-[0.3em] transition-all rounded-sm font-bold shadow-xl">
              Cerrar Portal
            </button>
          </div>
        </div>
        
        {/* Subtle bottom detail */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
      </div>
      
      <p className="mt-12 text-slate-500 text-[10px] uppercase tracking-widest opacity-50">
        © 2026 Hotel Tamanaco Caracas | Gestión Interna
      </p>
    </div>
  );
};

export default Login;