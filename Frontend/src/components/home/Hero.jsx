import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import heroImage from "../../assets/Foto-tamanaco2.jpg";
import BrandLogo from "../brand/BrandLogo";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
          src={heroImage} 
          alt="Hotel Tamanaco Facade"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      <div className="relative z-10 px-6 md:px-24 w-full max-w-7xl pt-24 md:pt-32">
        <p className="font-sans text-[#C5A02D] text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 md:mb-6 font-semibold">
          Desde 1953
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl !text-white mb-6 md:mb-8 leading-[1.1] md:leading-tight">
          Donde la historia <br />
          <span className="italic text-[#D4AF37]">se vive.</span>
        </h1>
        <p className="text-white/90 max-w-sm md:max-w-md text-base md:text-lg mb-8 md:mb-10 leading-relaxed font-light">
          Redescubra el icono arquitectónico de Caracas. Un santuario de elegancia atemporal y servicio legendario.
        </p>
        <div className="flex gap-4">
          <Link 
            to="/survey" 
            className="bg-[#C5A02D] hover:bg-[#B38B22] text-white px-10 py-4 text-xs uppercase tracking-widest transition-all rounded-sm font-bold shadow-2xl hover:-translate-y-1"
          >
            Realizar Encuesta
          </Link>
          <a 
            href="#narrative" 
            className="border border-white/30 hover:border-white text-white px-10 py-4 text-xs uppercase tracking-widest transition-all rounded-sm font-bold backdrop-blur-sm hover:bg-white/10"
          >
            Explorar
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden md:block animate-bounce opacity-50">
        <ArrowDown className="text-white w-8 h-8" />
      </div>
    </section>
  );
};

export default Hero;
