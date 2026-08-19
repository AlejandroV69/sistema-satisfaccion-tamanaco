/**
 * @file hooks/useOnlineStatus.js
 * @description Hook personalizado que monitoriza el estado de conexión a internet del usuario y detecta reconexiones.
 */

import { useState, useEffect } from 'react';

/**
 * Hook `useOnlineStatus`
 * @returns {Object} { isOnline: boolean, wasReconnected: boolean }
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' 
      ? navigator.onLine 
      : true
  );

  const [wasReconnected, setWasReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasReconnected(true);
      // Ocultar la notificación de "Reconectado" tras 4 segundos
      const timer = setTimeout(() => {
        setWasReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasReconnected };
}

export default useOnlineStatus;
