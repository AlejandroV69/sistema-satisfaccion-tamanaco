/**
 * @file components/ui/OfflineBanner.jsx
 * @description Banner / Toast flotante interactivo para notificar al usuario sobre el estado de la conexión a internet.
 */

import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import useOnlineStatus from '../../hooks/useOnlineStatus';

/**
 * Componente OfflineBanner
 * Muestra una alerta cuando se pierde la conexión y un aviso breve cuando se restablece.
 */
const OfflineBanner = () => {
  const { isOnline, wasReconnected } = useOnlineStatus();

  // Si hay conexión y no venimos de una reconexión reciente, no renderizar nada
  if (isOnline && !wasReconnected) {
    return null;
  }

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] sm:w-auto transition-all duration-300 ease-in-out"
    >
      {!isOnline ? (
        // --- BANNER CUANDO NO HAY CONEXIÓN ---
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <WifiOff size={22} className="animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-200">Sin conexión a internet</p>
              <p className="text-xs text-slate-300">Verifique su red. El sistema responderá al reconectarse.</p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            title="Reintentar cargar"
            className="flex items-center gap-1.5 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-2 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Reintentar</span>
          </button>
        </div>
      ) : (
        // --- BANNER DE RECONEXIÓN EXITOSA ---
        <div className="bg-emerald-950/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-fade-in">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Wifi size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-200">Conexión restablecida</p>
            <p className="text-xs text-emerald-400/80">Estás nuevamente en línea.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;
