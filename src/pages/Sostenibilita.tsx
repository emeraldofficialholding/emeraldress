import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // Assicurati di avere react-router-dom o usa <a> se preferisci
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

// --- DATI DEL CAROSELLO (Già approvati - INVARIATI) ---
const slides = [
  {
    id: 1,
    percentage: "ZERO",
    title: "RECUPERO",
    verticalText: "Petrolio Vergine",
    description:
      "Il nostro impatto sulle risorse fossili è nullo. Invece di estrarre nuovo petrolio, recuperiamo reti da pesca abbandonate e scarti plastici, trasformando un problema ambientale in una risorsa preziosa.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    percentage: "100%",
    title: "RIGENERAZIONE",
    verticalText: "Nylon Rigenerato",
    description:
      "Attraverso un processo di depolimerizzazione avanzato, i materiali recuperati vengono trasformati in un nuovo filato puro. Il risultato è un tessuto chimicamente identico al nylon vergine, ma con un'anima pulita.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    percentage: "ITALY",
    title: "CREAZIONE",
    verticalText: "Manifattura Etica",
    description:
      "La sostenibilità deve essere anche sociale. Rifiutiamo la delocalizzazione: ogni singolo capo Emeraldress è tagliato e cucito in Italia, garantendo qualità sartoriale e rispetto per i lavoratori.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 4,
    percentage: "∞",
    title: "CIRCOLARITÀ",
    verticalText: "Design Rigenerabile",
    description:
      "Nulla si crea, nulla si distrugge, tutto si trasforma. I nostri capi sono progettati per essere rigenerati all'infinito. Anche il packaging è pensato per durare: una custodia di design da riutilizzare nei tuoi viaggi.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000",
  },
];

// --- DATI NUOVA COLLEZIONE (Per i 3 Riquadri) ---
const latestDrops = [
  {
    id: 101,
    name: "Midnight Silk Dress",
    price: "€320",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 102,
    name: "Emerald Corset",
    price: "€240",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 103,
    name: "Riviera Linen Set",
    price: "€280",
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&auto=format&fit=crop&q=60",
  },
];

// --- COMPONENTE 1: HERO SECTION (INVARIATO) ---
const HeroSustainability = () => (
  <section className="relative h-[85vh] w-full overflow-hidden">
    <div className="absolute inset-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover blur-[2px] scale-105">
        <source
          src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/e5ce34aaaf008c541e7645ddb5233fae0c320bbf2cec96cb53fb1e40e1806251.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/30" />
    </div>
    <div className="absolute inset-0 container mx-auto px-4 flex items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl text-white"
      >
        <span className="text-sm md:text-base tracking-[0.3em] uppercase font-sans mb-4 block text-emerald-100">
          La Nostra Promessa
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-6">
          Lusso <br /> Responsabile.
        </h1>
        <p className="text-lg md:text-xl font-sans text-white/90 leading-relaxed max-w-lg border-l-2 border-emerald-400 pl-6">
          "La nostra ambizione è esportare nel mondo la bellezza della Costa Smeralda: la sua luce, la sua calma, la sua
          eleganza discreta."
        </p>
      </motion.div>
    </div>
  </section>
);

// --- NUOVA SEZIONE: LATEST COLLECTION SHOWCASE (Design Reference) ---
const LatestCollectionShowcase = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Glow Effect (The Beam from reference, adapted to Emerald) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl text-emerald-950 mb-4"
          >
            Nuovi Arrivi
          </motion.h2>
          <p className="text-neutral-500 font-sans tracking-wide uppercase text-sm">
            La Sostenibilità incontra lo Stile
          </p>
        </div>

        {/* The 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12 items-center justify-center max-w-6xl mx-auto mb-20">
          {latestDrops.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative group rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 bg-white
                ${index === 0 ? "md:rotate-[-3deg] md:mt-12" : ""}
                ${index === 1 ? "md:z-10 md:-mt-8 shadow-[0_20px_50px_rgba(5,150,105,0.15)]" : ""} 
                ${index === 2 ? "md:rotate-[3deg] md:mt-12" : ""}
              `}
              // Note: The rotations mimic the "fan" layout in the reference photo
            >
              {/* Card Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10" />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Card Content (Bottom) */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-white">
                <div className="w-10 h-1 bg-emerald-400 mb-4 rounded-full" />
                <h3 className="font-serif text-2xl mb-1">{item.name}</h3>
                <p className="font-sans text-emerald-200 text-sm tracking-widest">{item.price}</p>
              </div>

              {/* Glossy Overlay Effect (Reference Style) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link to="/collezioni">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-8 py-4 font-bold tracking-widest uppercase text-sm"
            >
              Vedi Tutte le Collezioni
              <ArrowRight className="w-4 h-4" />
            </HoverBorderGradient>
          </Link>
        </div>
      </div>
    </section>
  );
};

// --- PAGINA PRINCIPALE (ASSEMBLAGGIO) ---
const Sostenibilita = () => {
  return (
    <main className="bg-white">
      {/* 1. HERO SECTION (Video) */}
      <HeroSustainability />

      {/* 2. IL CAROSELLO (Il Processo) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 mb-12 text-center">
          <span className="text-emerald-600 tracking-[0.2em] text-sm font-bold uppercase">Il Ciclo Virtuoso</span>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 mt-4">Dalla Natura alla Natura</h2>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="p-1">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center min-h-[500px]">
                    {/* Immagine */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="relative h-[400px] lg:h-[600px] w-full overflow-hidden group"
                    >
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 h-full w-16 bg-white/90 backdrop-blur-sm flex items-center justify-center border-r border-emerald-100">
                        <span
                          className="text-emerald-900 font-serif tracking-widest uppercase text-sm whitespace-nowrap"
                          style={{
                            writingMode: "vertical-lr",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {slide.verticalText}
                        </span>
                      </div>
                    </motion.div>
                    {/* Testo */}
                    <motion.div className="text-center lg:text-left py-10 px-6">
                      <h2 className="text-[5rem] md:text-[8rem] leading-none font-serif text-emerald-600 font-medium mb-4">
                        {slide.percentage}
                      </h2>
                      <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-neutral-900 mb-8">
                        {slide.title}
                      </h3>
                      <div className="w-24 h-1 bg-emerald-600 mx-auto lg:mx-0 mb-8"></div>
                      <p className="text-neutral-600 font-sans text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
            <div className="pointer-events-auto">
              <CarouselPrevious className="relative bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-none h-14 w-14" />
            </div>
            <div className="pointer-events-auto">
              <CarouselNext className="relative bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-none h-14 w-14" />
            </div>
          </div>
        </Carousel>
      </section>

      {/* 3. NUOVA SEZIONE: LATEST COLLECTION SHOWCASE */}
      <LatestCollectionShowcase />
    </main>
  );
};

export default Sostenibilita;
