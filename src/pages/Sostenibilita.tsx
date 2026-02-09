import { motion } from "framer-motion";
import { ArrowRight, Recycle, Leaf, ShoppingBag, Gem } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

// --- CUSTOM ICONS ---
const Butterfly = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C12 2 13 5 14 6C16 8 21 8 22 10C23 12 19 16 17 17C15 18 13 17 12 16C11 17 9 18 7 17C5 16 1 12 2 10C3 8 8 8 10 6C11 5 12 2 12 2Z"
      opacity="0.8"
    />
    <path d="M12 16V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

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

// --- BACKGROUND ANIMATO (Smeraldi & Farfalle) ---
const EnchantedBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Sfumature di sfondo */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-emerald-50/50 to-white" />
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[100px] animate-pulse delay-1000" />

    {/* Particelle Fluttuanti (Gemme & Farfalle) */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`gem-${i}`}
        className="absolute opacity-20 text-emerald-400"
        initial={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
      >
        {i % 2 === 0 ? <Gem className="w-12 h-12" /> : <Butterfly className="w-16 h-16" />}
      </motion.div>
    ))}
  </div>
);

// --- COMPONENTE HERO ---
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

// --- NUOVO BANNER: DARK LUXURY (Potenziato) ---
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
    <section className="relative py-24 overflow-hidden">
      {/* Sfondo Banner: Gradiente Scuro + Noise Texture */}
      <div className="absolute inset-0 bg-neutral-950 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-emerald-950/30 to-neutral-950" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group relative p-6 rounded-2xl hover:bg-white/5 transition-colors duration-500"
            >
              {/* Separatore verticale (solo desktop, tra gli elementi) */}
              {index !== 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />
              )}

              {/* Icona con cerchio glow e animazione Butterfly hover */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-500" />
                <div className="relative w-full h-full rounded-full border border-emerald-800/50 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
                {/* Farfalla decorativa sull'icona */}
                <motion.div
                  className="absolute -top-2 -right-2 text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Butterfly className="w-6 h-6" />
                </motion.div>
              </div>

              <h3 className="font-serif text-2xl mb-3 text-emerald-50 tracking-wide">{item.title}</h3>
              <p className="text-neutral-400 font-sans max-w-xs leading-relaxed">{item.desc}</p>
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
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <Gem className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          </motion.div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12 items-center justify-center max-w-6xl mx-auto mb-20">
          {latestDrops.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative group rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/60 bg-white/80 backdrop-blur-md
                ${index === 0 ? "md:rotate-[-3deg] md:mt-12" : ""}
                ${index === 1 ? "md:z-10 md:-mt-8 shadow-[0_20px_50px_rgba(5,150,105,0.15)]" : ""} 
                ${index === 2 ? "md:rotate-[3deg] md:mt-12" : ""}
              `}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent opacity-60 z-10" />

                {/* Farfalla sulla card */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <Butterfly className="w-6 h-6 text-white drop-shadow-md" />
                </div>

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-white">
                <div className="w-10 h-1 bg-emerald-400 mb-4 rounded-full" />
                <h3 className="font-serif text-2xl mb-1">{item.name}</h3>
                <p className="font-sans text-emerald-200 text-sm tracking-widest">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
    <main className="bg-white relative">
      {/* 1. HERO SECTION */}
      <HeroSustainability />

      {/* WRAPPER CON SFONDO ANIMATO per le sezioni successive */}
      <div className="relative">
        <EnchantedBackground />

        {/* 2. IL CAROSELLO (Il Processo) */}
        <section className="py-20 relative z-10">
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
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="relative h-[400px] lg:h-[600px] w-full overflow-hidden group rounded-xl shadow-lg"
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

        {/* 3. BANNER NERO POTENZIATO */}
        <SustainabilityBanner />

        {/* 4. NUOVI ARRIVI */}
        <LatestCollectionShowcase />
      </div>
    </main>
  );
};

export default Sostenibilita;
