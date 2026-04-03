import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Location = () => {
  return (
    <section className="py-16 md:py-24 bg-[#fcf9f4]" id="location">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Side: Contact Information */}
          <div className="order-2 lg:order-1">
            <p className="text-[#C5A02D] text-xs uppercase tracking-[0.5em] mb-4 md:mb-6 font-semibold">Ubicación Estratégica</p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#0f172a] mb-8 md:mb-10 leading-tight"> Donde la Ciudad <br/> se Encuentra con el Lujo </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Dirección Física</h4>
                  <p className="text-slate-700 font-light leading-relaxed">
                    Final Avenida Principal de las Mercedes, <br/>
                    Caracas 1060-A, Venezuela.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Concierge & Reservas</h4>
                  <p className="text-slate-700 font-light">+58 (212) 909-7111</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Consultas Generales</h4>
                  <p className="text-slate-700 font-light">recepcion@hoteltamanaco.com</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Atención al Huésped</h4>
                  <p className="text-slate-700 font-light italic">Disponible las 24 horas del día, los 7 días de la semana.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Embedded Google Map */}
          <div className="order-1 lg:order-2">
            <div className="relative group overflow-hidden rounded-sm shadow-2xl p-1 bg-white border border-[#D4AF37]/10">
              <div className="aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-slate-100 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.364213795325!2d-66.8647576241029!3d10.471853689667793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a588b39d1b09b%3A0xc0f1f1a54a7d6e8!2sHotel%20Tamanaco!5e0!3m2!1ses!2sve!4v1707000000000!5m2!1ses!2sve" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                {/* Decorative Frame */}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-white/40 mix-blend-overlay"></div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 text-[8px] uppercase tracking-[0.3em] font-bold shadow-sm border border-[#D4AF37]/20 uppercase">
                Mercedes, Caracas
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Location;
