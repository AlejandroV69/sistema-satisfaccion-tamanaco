import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';
import piscinaBackground from '../assets/piscina-tamanaco2.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/dashboard');
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={piscinaBackground} 
          alt="Tamanaco Pool" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/70 hover:text-[#D4AF37] transition-all group"
      >
        <div className="p-2 rounded-full border border-white/10 group-hover:border-[#D4AF37]/40 bg-white/5 backdrop-blur-md">
          <ArrowLeft size={20} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Volver al Inicio</span>
      </Link>

      <div className="relative z-10 max-w-md w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-sm shadow-2xl overflow-hidden group">
        {/* Decorative corner */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D4AF37]/10 rotate-45 group-hover:bg-[#D4AF37]/20 transition-all duration-700"></div>
        
        <div className="text-center">
          <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.6em] mb-4 font-bold">Portal de Acceso</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 tracking-tighter bg-gradient-to-b from-[#F5E2A1] via-[#D4AF37] to-[#B38B22] bg-clip-text text-transparent drop-shadow-sm">
            Bienvenido
          </h2>
          
          <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-10"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-sm">
                <p className="text-red-400 text-[11px] text-center uppercase tracking-wider">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-slate-400 text-[10px] uppercase tracking-widest pl-1 font-bold">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 text-white px-4 py-3 rounded-sm outline-none transition-colors placeholder:text-white/20"
                placeholder="admin@hoteltamanaco.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 text-[10px] uppercase tracking-widest pl-1 font-bold">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/60 text-white px-4 py-3 rounded-sm outline-none transition-colors placeholder:text-white/20"
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-transparent border border-[#C5A02D]/40 hover:bg-[#C5A02D] disabled:hover:bg-transparent disabled:hover:text-[#C5A02D] text-[#C5A02D] hover:text-white px-8 py-4 text-xs uppercase tracking-[0.3em] transition-all rounded-sm font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Autenticando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Subtle bottom detail */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
      </div>
      
      <p className="absolute bottom-8 text-white/30 text-[9px] uppercase tracking-[0.4em] font-light">
        © 2026 Hotel Tamanaco Caracas | Distinción Legendaria
      </p>
    </div>
  );
};

export default Login;