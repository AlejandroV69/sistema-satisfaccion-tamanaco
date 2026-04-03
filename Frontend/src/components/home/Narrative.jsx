import narrativeImage from "../../assets/Foto-tamanaco.jpg";

const Narrative = () => {
  return (
    <section className="py-24 md:py-32 bg-[#fcf9f4]" id="narrative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 order-2 md:order-1">
          <p className="text-[#C5A02D] text-xs uppercase tracking-widest mb-6 font-bold">Nuestra Narrativa</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#0f172a] mb-8 leading-[1.2]">
            Siete Décadas de <br/>
            <span className="italic">Hospitalidad Curada</span>
          </h2>
          <div className="space-y-6 text-slate-600 leading-relaxed max-w-lg font-light text-lg">
            <p>
              Originalmente comisionado como una pieza central del renacimiento arquitectónico de Caracas, 
              el Hotel Tamanaco ha albergado a dignatarios, artistas y leyendas por generaciones.
            </p>
            <p>
              Cada pasillo cuenta una historia de una era definida por la grandeza. 
              Hoy, fusionamos ese legado histórico con el confort contemporáneo más exigente.
            </p>
          </div>
          <button className="mt-10 text-amber-800 font-serif border-b-2 border-amber-800/30 hover:border-amber-800 transition-all pb-1 italic text-xl">
            Descubra el Legado &rarr;
          </button>
        </div>
        <div className="md:col-span-7 order-1 md:order-2">
          <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-sm overflow-hidden shadow-2xl group">
            <img 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
              src={narrativeImage} 
              alt="Hotel Tamanaco Legacy"
            />
            <div className="absolute inset-0 bg-amber-900/10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Narrative;
