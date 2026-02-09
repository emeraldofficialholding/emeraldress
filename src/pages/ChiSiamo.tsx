import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Instagram, PenTool } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

const timelineData = [
  {
    title: "Le Origini",
    content: (
      <div>
        <p className="text-muted-foreground text-sm md:text-base font-normal mb-8">
          Tutto inizia nelle acque cristalline della Costa Smeralda. Ispirati dalla bellezza incontaminata della
          Sardegna, abbiamo deciso di creare un brand che unisse l'estetica del "Lusso Lento" con una missione urgente:
          proteggere il nostro mare.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
            alt="Costa Smeralda"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1516834474-48c0abc2a902?q=80&w=2073&auto=format&fit=crop"
            alt="Sketching"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
          />
        </div>
      </div>
    ),
  },
  {
    title: "La Svolta",
    content: (
      <div>
        <p className="text-muted-foreground text-sm md:text-base font-normal mb-8">
          Non bastava essere belli. Dovevamo essere puliti. Abbiamo introdotto l'uso esclusivo di fibre rigenerate da
          reti da pesca recuperate, trasformando un rifiuto in seta tecnologica.
        </p>
        <img
          src="https://images.unsplash.com/photo-1532667449560-72a95c8d381b?q=80&w=2070&auto=format&fit=crop"
          alt="Textile Process"
          className="rounded-lg object-cover h-40 md:h-64 w-full shadow-md"
        />
      </div>
    ),
  },
  {
    title: "Oggi",
    content: (
      <div>
        <p className="text-muted-foreground text-sm md:text-base font-normal mb-4">
          Con il lancio dell'Emerald Scanner, portiamo la trasparenza totale nelle mani del cliente. Ogni capo ha una
          storia digitale, ogni acquisto è un atto di consapevolezza.
        </p>
      </div>
    ),
  },
];

const ChiSiamo = () => {
  return (
    <main className="pt-0 bg-white">
      <ScrollExpandMedia
        mediaType="video"
        // Video Hero
        mediaSrc="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/HERO.mp4"
        // 🟢 NUOVO SFONDO: Texture marina scura e astratta.
        // Funziona perfettamente perché non ha un "soggetto" che viene tagliato, ma crea atmosfera.
        bgImageSrc="https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=2000&auto=format&fit=crop"
        title="Emerald Dress"
        scrollToExpand="Scorri per esplorare"
        textBlend
      >
        <div className="pt-16">
          {/* Header Description */}
          <motion.div {...fadeUp} className="container mx-auto px-4 lg:px-8 max-w-2xl mb-24">
            <p className="text-xs tracking-[0.2em] uppercase text-emerald-600 font-sans mb-2 text-center">
              La nostra storia
            </p>
            <h1 className="font-serif text-5xl mb-6 text-center md:text-7xl text-neutral-900">Chi Siamo</h1>
            <p className="text-neutral-600 font-sans leading-relaxed text-center text-lg">
              Dalla Costa Smeralda al mondo. EMERALDRESS nasce dalla visione di unire l'artigianato sardo con
              l'innovazione tessile sostenibile, creando capi che rispettano la Terra senza compromessi sull'eleganza.
            </p>
          </motion.div>

          {/* ✨ NUOVA SEZIONE: MANIFESTO & FIRMA ✨ */}
          <section className="container mx-auto px-4 mb-32">
            <div className="bg-neutral-50 p-10 md:p-16 rounded-2xl border border-neutral-100 text-center max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
              <h3 className="font-serif text-2xl md:text-4xl text-neutral-800 leading-snug mb-8">
                "Non volevamo creare solo vestiti. Volevamo creare un modo per sentirsi belle facendo la cosa giusta. Il
                vero lusso oggi è la consapevolezza."
              </h3>
              <div className="flex justify-center items-center gap-2 text-emerald-700">
                {/* Simulazione firma con font corsivo se disponibile, o serif italic */}
                <span className="font-serif italic text-3xl md:text-4xl transform -rotate-3">Sofia & Marco</span>
                <PenTool className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </section>

          {/* Animated Timeline */}
          <Timeline data={timelineData} />

          {/* ✨ NUOVA SEZIONE: ATELIER PARALLAX STRIP ✨ */}
          {/* Una striscia visiva che spezza il ritmo prima dei social */}
          <section className="w-screen relative left-1/2 -translate-x-1/2 h-[400px] mb-24 overflow-hidden mt-20 group">
            <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white">
              <span className="tracking-[0.5em] uppercase text-sm mb-4">L'Arte del fare</span>
              <h2 className="font-serif text-5xl md:text-6xl">Atelier Italiano</h2>
            </div>
            <img
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000&auto=format&fit=crop"
              alt="Atelier"
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          </section>

          {/* SEZIONE SOCIAL DRESS (Full Width) */}
          <section className="py-24 bg-white overflow-hidden w-screen relative left-1/2 -translate-x-1/2">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="w-full md:w-1/2 relative z-10 text-center md:text-left"
                >
                  <div className="inline-block relative">
                    <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-neutral-900 mb-6">
                      Social <br />
                      <span className="text-emerald-600 italic">DRESS</span>
                    </h2>
                    <svg
                      className="absolute -right-12 -top-8 w-24 h-24 text-pink-500 hidden md:block transform rotate-12"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10,50 Q50,10 90,50" strokeDasharray="5,5" />
                      <path d="M80,40 L90,50 L80,60" />
                    </svg>
                  </div>

                  <p className="text-lg text-neutral-600 font-sans mb-10 max-w-md mx-auto md:mx-0">
                    Il lusso non è solo un abito, è una community. Segui il nostro viaggio quotidiano, scopri i
                    backstage e lasciati ispirare dallo stile di vita Emeraldress.
                  </p>

                  <div className="flex justify-center md:justify-start items-center gap-4">
                    <span className="font-handwriting text-pink-500 transform -rotate-12 text-sm hidden lg:block">
                      Join the club!
                    </span>
                    <a href="https://instagram.com/emeraldress_" target="_blank" rel="noopener noreferrer">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-[#e4ffec] text-emerald-950 flex items-center gap-2 px-8 py-4 font-bold tracking-widest"
                      >
                        <Instagram className="w-5 h-5" />
                        @emeraldress_
                      </HoverBorderGradient>
                    </a>
                  </div>
                </motion.div>

                {/* Phone Mockup */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="w-full md:w-1/2 flex justify-center md:justify-end relative"
                >
                  <div className="relative w-[300px] h-[600px] bg-neutral-900 rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                    <div className="w-full h-full bg-white relative">
                      <div className="h-20 bg-white border-b border-neutral-100 flex items-end pb-2 px-4 justify-between z-10 relative">
                        <span className="font-bold text-sm">emeraldress_</span>
                        <Instagram className="w-5 h-5 text-neutral-800" />
                      </div>
                      <div className="w-full h-[calc(100%-80px)] relative">
                        <img
                          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop"
                          alt="Instagram Feed"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                          <div className="flex gap-2 items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white"></div>
                            <span className="text-xs font-bold">emeraldress_</span>
                          </div>
                          <p className="text-sm font-light">
                            Lusso, rinato. La nuova collezione è ora disponibile online. #Emeraldress #SustainableLuxury
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* STATS BANNER NERO (Full Width) */}
          <section className="bg-neutral-950 text-white py-8 border-t border-neutral-800 w-screen relative left-1/2 -translate-x-1/2">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase font-sans">
                    8000 Followers
                  </span>
                </div>

                <div className="hidden md:block w-px h-6 bg-neutral-800"></div>

                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase font-sans">
                    Made in ITALY
                  </span>
                </div>

                <div className="hidden md:block w-px h-6 bg-neutral-800"></div>

                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase font-sans">
                    Ogni settimana nuovi contenuti
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollExpandMedia>
    </main>
  );
};

export default ChiSiamo;
