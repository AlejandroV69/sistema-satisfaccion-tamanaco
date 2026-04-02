import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 border-b border-amber-900/50 px-8 py-4 flex justify-between items-center shadow-2xl">
      {/* Lado Izquierdo: Branding */}
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-amber-600 rounded-full flex items-center justify-center font-serif text-white font-bold">T</div>
        <span className="text-amber-500 font-serif text-xl tracking-[0.2em] font-bold uppercase">
          Hotel Tamanaco
        </span>
      </div>

      {/* Lado Derecho: Navegación */}
      <div className="hidden md:flex items-center space-x-10">
        <Link to="/" className="text-slate-300 hover:text-amber-500 transition-all text-sm uppercase tracking-widest font-medium">
          Inicio
        </Link>
        <Link to="/survey" className="text-slate-300 hover:text-amber-500 transition-all text-sm uppercase tracking-widest font-medium">
          Encuesta
        </Link>
        <Link to="/login" className="border border-amber-600 text-amber-500 px-5 py-2 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-amber-600 hover:text-white transition-all">
          Acceso Staff
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;