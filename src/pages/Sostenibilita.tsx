import { motion } from "framer-motion";
import { ArrowRight, Recycle, Leaf, ShoppingBag, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

// --- DATI DEL CAROSELLO ---
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

// --- DATI NUOVA COLLEZIONE ---
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

// --- COMPONENTE HERO (VIDEO RESPONSIVE FIX) ---
const HeroSustainability = () => (
  <section className="relative h-[85vh] w-full overflow-hidden">
    <div className="absolute inset-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        // FIX: object-cover va bene, ma aggiungiamo object-center per centrare l'azione su mobile
        className="w-full h-full object-cover object-center blur-[1px] scale-105"
      >
        <source
          src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/Video%20asset.mov"
          type="video/mp4"
        />
      </video>
      {/* Overlay più scuro per garantire leggibilità su mobile */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
    </div>

    <div className="absolute inset-0 container mx-auto px-4 flex items-center justify-center md:justify-start text-center md:text-left">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl text-white"
      >
        <span className="text-xs md:text-sm tracking-[0.4em] uppercase font-sans mb-6 block text-emerald-200 font-bold">
          La Nostra Promessa
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 drop-shadow-lg">
          Lusso <br className="hidden md:block" /> Responsabile.
        </h1>
        <p className="text-base md:text-xl font-sans text-white/90 leading-relaxed max-w-lg mx-auto md:mx-0 md:border-l-2 md:border-emerald-400 md:pl-6">
          "La nostra ambizione è esportare nel mondo la bellezza della Costa Smeralda: la sua luce, la sua calma, la sua
          eleganza discreta."
        </p>
      </motion.div>
    </div>
  </section>
);

// --- BANNER NERO ---
const SustainabilityBanner = () => {
  const items = [
    {
      icon: Recycle,
      title: "Recupero Attivo",
      desc: "Trasformiamo reti da pesca e plastica in filati preziosi.",
    },
    {
      icon: Leaf,
      title: "Impatto Zero",
      desc: "Produzione certificata che rispetta l'ecosistema marino.",
    },
    {
      icon: ShoppingBag,
      title: "Acquisto Etico",
      desc: "Ogni tuo ordine supporta l'artigianato italiano.",
    },
  ];

  return (
    <section className="relative py-28 bg-[#051c14] overflow-hidden border-t border-emerald-900/30">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              {index !== 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-emerald-800/50 to-transparent" />
              )}

              <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <item.icon className="w-12 h-12 text-emerald-400 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>

              <h3 className="font-serif text-3xl mb-4 text-white tracking-wide group-hover:text-emerald-200 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="w-12 h-0.5 bg-emerald-700 mb-4 rounded-full group-hover:w-24 transition-all duration-500" />
              <p className="text-neutral-400 font-sans text-lg leading-relaxed max-w-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTE: LATEST COLLECTION SHOWCASE ---
const LatestCollectionShowcase = () => {
  return (
    <section className="py-32 relative bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto">
              <Gem className="w-8 h-8 text-emerald-600" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-emerald-950 mb-6"
          >
            Nuovi Arrivi
          </motion.h2>
          <p className="text-neutral-500 font-sans tracking-[0.2em] uppercase text-sm md:text-base">
            La Sostenibilità incontra lo Stile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-16 items-center justify-center max-w-7xl mx-auto mb-24">
          {latestDrops.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -15 }}
              className={`relative group cursor-pointer ${index === 1 ? "md:-mt-16" : ""}`}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-[2rem] shadow-2xl relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="font-serif text-emerald-900 font-bold">{item.price}</span>
                </div>
              </div>
              <div className="text-center mt-8">
                <h3 className="font-serif text-2xl text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h3>
                <div className="w-12 h-0.5 bg-emerald-200 mx-auto group-hover:w-24 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/collezioni">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-12 py-5 font-bold tracking-widest uppercase text-sm shadow-xl hover:shadow-emerald-200/50 transition-all"
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
    <main className="bg-white relative">
      {/* 1. HERO SECTION */}
      <HeroSustainability />

      {/* 2. IL CAROSELLO (Il Processo) - INVARIATO */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-4 mb-16 text-center">
          <span className="text-emerald-600 tracking-[0.2em] text-sm font-bold uppercase block mb-4">
            Il Ciclo Virtuoso
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-emerald-950">Dalla Natura alla Natura</h2>
        </div>

        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="p-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center min-h-[600px]">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="relative h-[500px] lg:h-[700px] w-full overflow-hidden group rounded-[2rem] shadow-2xl"
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 h-full w-20 bg-white/95 backdrop-blur-md flex items-center justify-center border-r border-emerald-100 hidden md:flex">
                        <span
                          className="text-emerald-900 font-serif tracking-[0.3em] uppercase text-sm whitespace-nowrap font-bold"
                          style={{
                            writingMode: "vertical-lr",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {slide.verticalText}
                        </span>
                      </div>
                    </motion.div>
                    <motion.div className="text-center lg:text-left py-10 px-6">
                      <h2 className="text-[6rem] md:text-[10rem] leading-none font-serif text-emerald-100 font-medium mb-6 -ml-2 select-none">
                        {slide.percentage}
                      </h2>
                      <h3 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-8 relative z-10 -mt-12 lg:-mt-20">
                        {slide.title}
                      </h3>
                      <div className="w-32 h-1 bg-emerald-500 mx-auto lg:mx-0 mb-10"></div>
                      <p className="text-neutral-600 font-sans text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
            <div className="pointer-events-auto">
              <CarouselPrevious className="relative bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-full h-16 w-16 shadow-lg" />
            </div>
            <div className="pointer-events-auto">
              <CarouselNext className="relative bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-full h-16 w-16 shadow-lg" />
            </div>
          </div>
        </Carousel>
      </section>

      {/* 3. BANNER NERO MIGLIORATO */}
      <SustainabilityBanner />

      {/* 4. NUOVI ARRIVI (CLEAN & LUXURY) */}
      <LatestCollectionShowcase />
    </main>
  );
};

export default Sostenibilita;
