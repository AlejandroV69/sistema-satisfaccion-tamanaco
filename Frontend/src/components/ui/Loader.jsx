import React from 'react';

const Loader = ({ fullPage = false, message = "Cargando..." }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#C5A02D] border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && <p className="text-slate-500 font-medium animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;
