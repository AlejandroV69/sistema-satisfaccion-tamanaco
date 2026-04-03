import restaurantImage from "../../assets/restaurante-tamanaco.jpg";
import roomsImage from "../../assets/habitaciones.jpg";
import poolImage from "../../assets/piscina-tamanaco.jpg";
import { Utensils, Bed, Waves } from "lucide-react";

const services = [
  {
    title: "Experiencia Culinaria",
    description: "Sabores locales reimaginados con técnicas contemporáneas en nuestra Terraza Mar.",
    image: restaurantImage,
    Icon: Utensils,
  },
  {
    title: "Descanso de Élite",
    description: "Habitaciones que fusionan el confort clásico con vistas espectaculares a la ciudad.",
    image: roomsImage,
    Icon: Bed,
  },
  {
    title: "Relajación Elevada",
    description: "Nuestra icónica piscina y áreas de bienestar son el refugio perfecto en la ciudad.",
    image: poolImage,
    Icon: Waves,
  },
];

const Services = () => {
  return (
    <section className="py-32 bg-slate-900 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 font-semibold">Exclusividad</p>
          <h2 className="font-serif text-4xl md:text-6xl !text-white">Servicios de Clase Mundial</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative overflow-hidden bg-slate-950/50 border border-white/10 rounded-sm hover:border-[#C5A02D]/50 transition-all flex flex-col items-center">
              <div className="w-full aspect-[4/5] overflow-hidden">
                <img 
                  className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  src={service.image} 
                  alt={service.title}
                />
              </div>
              <div className="p-10 text-center relative z-10">
                <service.Icon className="mx-auto mb-6 text-[#D4AF37] w-8 h-8 group-hover:text-amber-300 transition-colors" />
                <h3 className="font-serif text-2xl !text-white mb-4">{service.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
