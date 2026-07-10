import { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const ProtectedRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const location = useLocation();

  const lastActivityTime = useRef(Date.now());
  const showWarningRef = useRef(false);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [location]); // Re-run check on every route transition

  // Manejo de inactividad
  useEffect(() => {
    if (!session) return;

    // 15 minutos para mostrar la advertencia
    const INACTIVITY_MS = 15 * 60 * 1000; 

    const updateActivity = () => {
      if (!showWarningRef.current) {
        lastActivityTime.current = Date.now();
      }
    };

    // Eventos a escuchar
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

    // Verificar inactividad periódicamente
    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (!showWarningRef.current && now - lastActivityTime.current >= INACTIVITY_MS) {
        setShowWarning(true);
        setCountdown(60);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      clearInterval(checkInterval);
    };
  }, [session]);

  // Manejo de la cuenta regresiva del modal
  useEffect(() => {
    let interval;
    if (showWarning) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            supabase.auth.signOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showWarning]);

  const handleStayLoggedIn = () => {
    lastActivityTime.current = Date.now();
    setShowWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C5A02D]"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />

      {showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-sm shadow-2xl max-w-md w-full text-center border-t-4 border-[#C5A02D] animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-serif mb-4 text-slate-800">Inactividad Detectada</h2>
            <p className="text-slate-600 mb-8">
              Tu sesión está a punto de cerrarse por inactividad. <br/><br/>
              Se cerrará automáticamente en <strong className="text-[#C5A02D] text-xl">{countdown}</strong> segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={async () => {
                  setShowWarning(false);
                  await supabase.auth.signOut();
                }}
                className="px-6 py-3 border border-slate-300 text-slate-600 rounded-sm hover:bg-slate-50 transition-colors uppercase text-[10px] tracking-widest font-bold w-full sm:w-auto"
              >
                Cerrar Sesión
              </button>
              <button 
                onClick={handleStayLoggedIn}
                className="px-6 py-3 bg-[#C5A02D] text-white rounded-sm hover:bg-[#B38B22] transition-colors uppercase text-[10px] tracking-widest font-bold shadow-lg w-full sm:w-auto"
              >
                Mantener Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
