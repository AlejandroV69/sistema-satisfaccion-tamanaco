import Hero from "../components/home/Hero";
import Narrative from "../components/home/Narrative";
import Services from "../components/home/Services";
import Casino from "../components/home/Casino";
import Gallery from "../components/home/Gallery";
import Location from "../components/home/Location";
import BrandLogo from "../components/brand/BrandLogo";

// Custom SVG Icons to avoid Lucide-React version conflicts
const InstaIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FBIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const XIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
  </svg>
);

const Home = () => {
  return (
    <main className="bg-[#fcf9f4] text-[#1c1c19] font-sans selection:bg-amber-100 overflow-x-hidden">
      
      {/* Hero Section */}
      <Hero />

      {/* Narrative Section */}
      <Narrative />

      {/* Services Section */}
      <Services />

      {/* Featured Casino Section */}
      <Casino />

      {/* Mosaic Gallery Section */}
      <Gallery />

      {/* Location & Contact Section */}
      <Location />

      {/* Footer Final */}
      <footer className="py-24 bg-slate-900 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex justify-center">
            <BrandLogo className="h-20" showTagline={true} />
          </div>
          
          <div className="flex justify-center flex-wrap gap-8 md:gap-12 mb-12">
            <a 
              href="https://www.instagram.com/hoteltamanaco?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 text-slate-400 hover:text-[#D4AF37] transition-all duration-300"
            >
              <InstaIcon className="w-6 h-6 group-hover:scale-110" />
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Instagram</span>
            </a>
            
            <a 
              href="https://www.facebook.com/TamanacoCaracasHotel?locale=es_LA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 text-slate-400 hover:text-[#D4AF37] transition-all duration-300"
            >
              <FBIcon className="w-6 h-6 group-hover:scale-110" />
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Facebook</span>
            </a>
            
            <a 
              href="https://x.com/hotel_tamanaco?s=11" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 text-slate-400 hover:text-[#D4AF37] transition-all duration-300"
            >
              <XIcon className="w-6 h-6 group-hover:scale-110" />
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase">X</span>
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-[#D4AF37]/30"></div>
            <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase font-light">
              © 2026 Hotel Tamanaco Caracas. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
};

export default Home;
