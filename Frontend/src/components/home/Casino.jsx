import casinoImage from "../../assets/casino-tamanaco.jpg";
import CasinoLogo from "../brand/CasinoLogo";

const Casino = () => {
  return (
    <section className="relative bg-slate-900 overflow-hidden" id="casino">
      <div className="flex flex-col md:flex-row min-h-[600px] md:h-[700px]">
        {/* Left Side: Massive Visual */}
        <div className="md:w-1/2 relative overflow-hidden group">
          <img 
            src={casinoImage} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Casino Tamanaco Experience" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>

        {/* Right Side: Text & Brand */}
        <div className="md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-slate-900">
          <div className="max-w-md text-center md:text-left flex flex-col items-center md:items-start">
            <p className="text-[#C5A02D] text-xs uppercase tracking-[0.5em] mb-8 font-semibold">
              The Night Experience
            </p>
            
            <CasinoLogo className="h-24 md:h-32 mb-10 -ml-1 md:-ml-2" />
            
            <p className="text-slate-300 text-lg leading-relaxed font-light mb-10">
              Sienta la emoción del juego en un ambiente de sofisticación absoluta. 
              Donde la herencia clásica se encuentra con la adrenalina contemporánea.
            </p>

            <div className="space-y-4 w-full">
              <div className="flex items-center gap-4 text-slate-400 border-b border-white/5 pb-4">
                <span className="text-[#D4AF37] font-serif italic text-2xl">01.</span>
                <span className="uppercase tracking-widest text-[10px] font-bold">Mesas de Juego Exclusivas</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 border-b border-white/5 pb-4">
                <span className="text-[#D4AF37] font-serif italic text-2xl">02.</span>
                <span className="uppercase tracking-widest text-[10px] font-bold">Ambiente de Inmersión Total</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="text-[#D4AF37] font-serif italic text-2xl">03.</span>
                <span className="uppercase tracking-widest text-[10px] font-bold">Servicio VIP Personalizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Casino;
