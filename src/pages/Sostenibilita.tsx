import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Expand,
  Recycle,
  StretchHorizontal,
  Grid3X3,
  Shrink,
  Sun,
  Droplet,
  CircleDashed,
  Wind,
} from "lucide-react";
import logoED from "@/assets/logo-ed.png";
import logoET from "@/assets/logo-emeraldtouch.png";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useProducts } from "@/hooks/useProducts";
import GemLoader from "@/components/GemLoader";

// --- DATI DEL CAROSELLO ---
const slides = [
  {
    id: 1,
    percentage: "ZERO",
    title: "INQUINAMENTO",
    verticalText: "Petrolio Vergine",
    description:
      "Il nostro impatto sulle risorse fossili è nullo. Invece di estrarre nuovo petrolio, recuperiamo reti da pesca abbandonate e scarti plastici, trasformando un problema ambientale in una risorsa preziosa.",
    image: "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/2.jpg",
  },
  {
    id: 2,
    percentage: "100%",
    title: "RIGENERAZIONE",
    verticalText: "Nylon Rigenerato",
    description:
      "Attraverso un processo di depolimerizzazione avanzato, i materiali recuperati vengono trasformati in un nuovo filato puro. Il risultato è un tessuto chimicamente identico al nylon vergine, ma con un'anima pulita.",
    image: "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/1.png",
  },
  {
    id: 3,
    percentage: "ITALY",
    title: "CREAZIONE",
    verticalText: "Manifattura Etica",
    description:
      "La sostenibilità deve essere anche sociale. Rifiutiamo la delocalizzazione: ogni singolo capo Emeraldress è tagliato e cucito in Italia, garantendo qualità sartoriale e rispetto per i lavoratori.",
    image: "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/DETTAGLIO%201.jpeg",
  },
  {
    id: 4,
    percentage: "∞",
    title: "CIRCOLARITÀ",
    verticalText: "Design Rigenerabile",
    description:
      "Nulla si crea, nulla si distrugge, tutto si trasforma. I nostri capi sono progettati per essere rigenerati all'infinito. Anche il packaging è pensato per durare: una custodia di design da riutilizzare nei tuoi viaggi.",
    image: "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress%20acqua.PNG",
  },
];

// --- COMPONENTE HERO ---
const HeroSustainability = () => (
  <section className="relative h-[85vh] w-full overflow-hidden">
    <div className="absolute inset-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center blur-[1px] scale-105">
        <source
          src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/HERO.mov"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/30" />
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
          Lusso Responsabile
        </h1>
        <p className="text-base md:text-xl font-sans text-white/90 leading-relaxed max-w-lg mx-auto md:mx-0 md:border-l-2 md:border-emerald-400 md:pl-6">
          "La nostra è una sostenibilità responsabile: materiali rigenerati, processi etici e packaging riutilizzabile.
          Per noi la coerenza non è una moda, ma l'essenza di un lusso contemporaneo che rispetta il mondo"
        </p>
      </motion.div>
    </div>
  </section>
);

// --- NUOVO BANNER: CARATTERISTICHE TESSUTO ---
const FabricFeatures = () => {
  const features = [
    { icon: Expand, title: "BIELASTICO" },
    { icon: Recycle, title: "FIBRA RICICLATA" },
    { icon: StretchHorizontal, title: "MANTENIMENTO DELLA FORMA" },
    { icon: Grid3X3, title: "OTTIMA COPERTURA" },
    { icon: Shrink, title: "PERFETTA VESTIBILITÀ" },
    { icon: Sun, title: "PROTEZIONE DAI RAGGI UV" },
    { icon: Droplet, title: "RESISTENTE AL CLORO" },
    { icon: CircleDashed, title: "RESISTENTE AL PILLING" },
    { icon: Wind, title: "TRASPIRANTE" },
  ];

  return (
    <section className="py-24 bg-[#fbfbfb] border-y border-emerald-100/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-emerald-950 mb-16 text-left leading-tight"
          >
            CARATTERISTICHE <br />
            DEL TESSUTO:
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 group"
              >
                <div className="text-emerald-950 group-hover:text-emerald-500 transition-colors duration-300">
                  <feature.icon strokeWidth={1.5} className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <span className="font-sans font-medium text-sm md:text-base tracking-widest uppercase text-emerald-950">
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- COLLEZIONI: dati dinamici da DB (Emerald Touch) ---
const LatestCollectionShowcase = () => {
  const { data: products, isLoading } = useProducts("emerald-touch");
  const emeraldProducts = (products ?? []).slice(0, 3);

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
            <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto p-2">
              <img src={logoED} alt="Emeraldress" className="w-full h-full object-contain" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-emerald-950 mb-6"
          >
            Collezioni
          </motion.h2>
          <div className="flex items-center justify-center gap-2 text-neutral-500 font-sans tracking-[0.2em] uppercase text-sm md:text-base">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="flex items-center gap-1">
              Ultima Uscita:
              <img src={logoET} alt="Emerald Touch" className="h-5 w-auto object-contain" />
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <GemLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-16 items-center justify-center max-w-7xl mx-auto mb-24">
            {emeraldProducts.map((product, index) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <motion.div
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
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="font-serif text-emerald-900 font-bold">
                        {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <h3 className="font-serif text-2xl text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-emerald-200 mx-auto group-hover:w-24 transition-all duration-300" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

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

// --- PAGINA PRINCIPALE ---
const Sostenibilita = () => {
  return (
    <main className="bg-white relative overflow-hidden w-full">
      {/* 1. HERO SECTION */}
      <HeroSustainability />

      {/* 2. IL CAROSELLO (Il Processo) */}
      <section className="py-24 bg-white relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <span className="text-emerald-600 tracking-[0.2em] text-sm font-bold uppercase block mb-4">
            Il Ciclo Virtuoso
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-emerald-950">Dalla Natura alla Natura</h2>
        </div>

        <div className="container mx-auto px-0 md:px-4">
          <Carousel
            className="w-full max-w-7xl mx-auto"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-0">
              {slides.map((slide) => (
                <CarouselItem key={slide.id} className="pl-0 md:pl-4">
                  <div className="p-4 md:p-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center min-h-[auto] md:min-h-[600px]">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="relative h-[400px] md:h-[500px] lg:h-[700px] w-full overflow-hidden group rounded-3xl md:rounded-[2rem] shadow-xl md:shadow-2xl"
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-0 left-0 h-full w-20 bg-white/95 backdrop-blur-md flex items-center justify-center border-r border-emerald-100 hidden md:flex">
                          <span
                            className="text-emerald-900 font-serif tracking-[0.3em] uppercase text-sm whitespace-nowrap font-bold"
                            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
                          >
                            {slide.verticalText}
                          </span>
                        </div>
                      </motion.div>

                      <motion.div className="text-center lg:text-left py-6 px-4 md:py-10 md:px-6">
                        <h2 className="text-[5rem] md:text-[6rem] lg:text-[10rem] leading-none font-serif text-emerald-100 font-medium mb-4 md:mb-6 md:-ml-2 select-none">
                          {slide.percentage}
                        </h2>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-emerald-950 mb-6 relative z-10 -mt-10 md:-mt-12 lg:-mt-20">
                          {slide.title}
                        </h3>
                        <div className="w-24 md:w-32 h-1 bg-emerald-500 mx-auto lg:mx-0 mb-6 md:mb-10"></div>
                        <p className="text-neutral-600 font-sans text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                          {slide.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* FRECCE CAROSELLO - Visibili anche su Mobile */}
            <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-emerald-50 text-emerald-900 border-emerald-100 h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg z-10" />
            <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-emerald-50 text-emerald-900 border-emerald-100 h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg z-10" />
          </Carousel>
        </div>
      </section>

      {/* 3. NUOVO BANNER: CARATTERISTICHE TESSUTO */}
      <FabricFeatures />

      {/* 4. COLLEZIONI */}
      <LatestCollectionShowcase />
    </main>
  );
};

export default Sostenibilita;
