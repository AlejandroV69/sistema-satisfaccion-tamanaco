import piscina2 from "../../assets/piscina-tamanaco2.jpg";
import comida from "../../assets/Comida.jpg";
import foto1 from "../../assets/Foto-tamanaco.jpg";
import restaurant from "../../assets/restaurante-tamanaco.jpg";

const Gallery = () => {
  const images = [
    { src: piscina2, alt: "Piscina Tamanaco" },
    { src: comida, alt: "Gastronomía" },
    { src: foto1, alt: "Hotel Heritage" },
    { src: restaurant, alt: "Luxury Dining" }
  ];

  return (
    <section className="py-24 bg-[#fffcf9]" id="gallery">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24 px-4">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 font-semibold">Social</p>
          <h2 className="font-serif text-3xl md:text-5xl text-[#0f172a]">Momentos Tamanaco</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-sm group cursor-pointer shadow-xl ${
                index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 h-[350px] sm:h-[450px] lg:h-[720px]" : "h-[300px] sm:h-[350px]"
              }`}
            >
              <img 
                src={image.src} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={image.alt} 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all m-4"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
