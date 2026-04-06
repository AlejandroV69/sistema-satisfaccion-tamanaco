import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-900 pt-32 pb-20 px-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 p-12 rounded-sm shadow-2xl relative overflow-hidden group">
        {/* Decorative corner */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D4AF37]/10 rotate-45 group-hover:bg-[#D4AF37]/20 transition-all duration-700"></div>
        
        <div className="relative z-10 text-center">
          <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.6em] mb-4 font-bold">Portal de Acceso</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-tighter">Bienvenido</h2>
          
          <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-10"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-sm text-center">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-slate-400 text-xs uppercase tracking-widest pl-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-white/10 focus:border-[#D4AF37]/60 text-white px-4 py-3 rounded-sm outline-none transition-colors"
                placeholder="admin@hoteltamanaco.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 text-xs uppercase tracking-widest pl-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-white/10 focus:border-[#D4AF37]/60 text-white px-4 py-3 rounded-sm outline-none transition-colors"
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
      
      <p className="mt-12 text-slate-500 text-[10px] uppercase tracking-widest opacity-50">
        © 2026 Hotel Tamanaco Caracas | Gestión Interna
      </p>
    </div>
  );
};

export default Login;