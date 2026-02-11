import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Instagram, PenTool, Heart, MessageCircle, Sparkles } from "lucide-react";

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
        mediaSrc="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/HERO.mp4"
        bgImageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
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

          {/* MANIFESTO SECTION (AGGIORNATA: Background #e4ffec) */}
          <section className="container mx-auto px-4 mb-32">
            <div className="bg-[#e4ffec] p-10 md:p-20 rounded-[3rem] border border-emerald-100 text-center max-w-5xl mx-auto relative overflow-hidden shadow-sm">
              {/* Texture Sottile per dare profondità */}
              <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                  backgroundImage: "radial-gradient(#10b981 0.5px, transparent 0.5px)",
                  backgroundSize: "12px 12px",
                }}
              ></div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30"></div>

              <div className="relative z-10">
                <h3 className="font-serif text-2xl md:text-5xl text-emerald-950 leading-tight mb-10">
                  "Non volevamo creare solo vestiti. Volevamo creare un modo per sentirsi belle facendo la cosa giusta.
                  Il vero lusso oggi è la consapevolezza."
                </h3>
                <div className="flex justify-center items-center gap-3 text-emerald-800">
                  <span className="font-serif italic text-3xl md:text-4xl transform -rotate-3">Sofia & Marco</span>
                  <PenTool className="w-5 h-5 opacity-70" />
                </div>
              </div>
            </div>
          </section>

          {/* Animated Timeline */}
          <Timeline data={timelineData} />

          {/* ATELIER PARALLAX STRIP */}
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

          {/* SEZIONE SOCIAL DRESS */}
          <section className="py-32 bg-gradient-to-b from-white to-emerald-50/30 overflow-hidden w-screen relative left-1/2 -translate-x-1/2">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
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
                      <span className="text-emerald-700 italic">DRESS</span>
                    </h2>

                    {/* Freccia Smeraldo/Oro */}
                    <svg
                      className="absolute -right-12 -top-8 w-24 h-24 text-emerald-500 hidden md:block transform rotate-12 opacity-60"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10,50 Q50,10 90,50" strokeDasharray="5,5" />
                      <path d="M80,40 L90,50 L80,60" />
                    </svg>
                  </div>

                  <p className="text-lg text-neutral-600 font-sans mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
                    Il lusso non è solo un abito, è una community. Segui il nostro viaggio quotidiano, scopri i
                    backstage e lasciati ispirare dallo stile di vita Emeraldress.
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-6 justify-center md:justify-start">
                    <span className="font-serif italic text-emerald-800/60 text-lg hidden lg:block">
                      Unisciti al club
                    </span>
                    <a href="https://instagram.com/emeraldress_" target="_blank" rel="noopener noreferrer">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-10 py-4 font-bold tracking-widest text-sm shadow-lg hover:shadow-emerald-200/50 transition-shadow"
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
                  {/* Floating Notifications */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-20 -left-10 bg-white p-3 rounded-2xl shadow-xl z-30 flex items-center gap-3 border border-emerald-50 hidden md:flex"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-xs font-bold text-neutral-800">New Collection Drop</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-32 -right-4 bg-white p-3 rounded-2xl shadow-xl z-30 flex items-center gap-3 border border-emerald-50 hidden md:flex"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-neutral-800">Backstage Live</span>
                  </motion.div>

                  {/* The Phone */}
                  <div className="relative w-[320px] h-[640px] bg-[#1a1a1a] rounded-[3.5rem] border-[10px] border-[#2a2a2a] shadow-2xl overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-20"></div>
                    <div className="w-full h-full bg-white relative">
                      {/* Instagram Header Mockup */}
                      <div className="h-24 bg-white border-b border-neutral-50 flex items-end pb-3 px-6 justify-between z-10 relative">
                        <span className="font-bold text-sm tracking-wide">emeraldress_</span>
                        <div className="flex gap-4 text-neutral-800">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Feed Image */}
                      <div className="w-full h-[calc(100%-96px)] relative overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
                          alt="Instagram Feed"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Overlay Gradient & Text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                          <div className="flex gap-3 items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center">
                              <span className="font-serif italic text-xs">E</span>
                            </div>
                            <span className="text-sm font-bold tracking-wide">emeraldress_</span>
                          </div>
                          <p className="text-sm font-light leading-relaxed opacity-90">
                            Lusso, rinato. La nuova collezione è ora disponibile online. <br />
                            <span className="text-emerald-400 font-medium">#Emeraldress #SustainableLuxury</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* STATS BANNER NERO */}
          <section className="bg-[#051c14] text-white py-24 w-screen relative left-1/2 -translate-x-1/2 border-t border-emerald-900/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 items-center justify-center text-center divide-y md:divide-y-0 md:divide-x divide-emerald-900/50">
                {/* Colonna 1 */}
                <div className="flex flex-col items-center gap-4 py-4 md:py-0">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50">8K+</span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-400">
                    Community
                  </span>
                </div>

                {/* Colonna 2 */}
                <div className="flex flex-col items-center gap-4 py-4 md:py-0">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50">100%</span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-400">
                    Made in Italy
                  </span>
                </div>

                {/* Colonna 3 */}
                <div className="flex flex-col items-center gap-4 py-4 md:py-0">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50">New</span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-400">
                    Weekly Content
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
