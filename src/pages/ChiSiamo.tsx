import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Instagram, PenTool, Heart, MessageCircle, Sparkles, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

// --- TIMELINE AGGIORNATA CON LA TUA STORIA ---
const timelineData = [
  {
    title: "Le Origini",
    content: (
      <div>
        <p className="text-neutral-600 text-sm md:text-base font-normal mb-8 leading-relaxed">
          Fin da bambina, osservavo la moda come un mondo affascinante e lontano: le vetrine erano tele di un sogno
          ancora senza forma. Per anni ho indossato ciò che era disponibile, scontrandomi presto con la realtà del fast
          fashion: tessuti che non lasciavano respirare la pelle, irritazioni e forme che svanivano dopo pochi lavaggi.
          Ho capito che non stavo scegliendo cosa indossare: stavo accettando materiali che non rispettavano né il mio
          corpo né la mia idea di eleganza.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
            alt="Ispirazione iniziale"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
          />

          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/asset.jpg"
            alt="Primi bozzetti"
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
        <p className="text-neutral-600 text-sm md:text-base font-normal mb-8 leading-relaxed">
          Da quella consapevolezza è nato un punto di svolta. La moda, da semplice passione, è diventata improvvisamente
          una responsabilità: creare capi che fossero belli, funzionali e sani. Era necessario trasformare quel sogno
          lontano in un'esperienza autentica. Così è iniziato il percorso di Emeraldress: non più compromessi, ma la
          ricerca di un benessere che parte dal tessuto e arriva all'anima.
        </p>
        <img
          src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/Gemini_Generated_Image_bv0czcbv0czcbv0c%20-%20Modificata.png"
          alt="Ricerca tessuti sani"
          className="rounded-lg object-cover h-40 md:h-64 w-full shadow-md"
        />
      </div>
    ),
  },
  {
    title: "Oggi",
    content: (
      <div>
        <p className="text-neutral-600 text-sm md:text-base font-normal mb-4 leading-relaxed">
          Oggi Emeraldress è un progetto indipendente, costruito con dedizione quotidiana. Disegno personalmente ogni
          capo studiando le linee per scolpire la silhouette e seleziono solo tessuti premium lavorati in Italia. Non
          seguiamo le tendenze: offriamo un'alternativa consapevole. È la realizzazione di un desiderio profondo:
          sentirmi finalmente a mio agio in ciò che indosso e offrire la stessa sensazione di lusso e cura a tutte le
          donne.
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
        bgImageSrc="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/SFONDO%20MINT.png"
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

          {/* MANIFESTO SECTION */}
          <section className="container mx-auto px-4 mb-32">
            <div className="bg-[#e4ffec] p-10 md:p-20 rounded-[3rem] border border-emerald-100 text-center max-w-5xl mx-auto relative overflow-hidden shadow-sm">
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
                  "Non volevo creare solo vestiti. Volevo creare un modo per sentirsi belle facendo la cosa giusta. Il
                  vero lusso oggi è la consapevolezza."
                </h3>
                <div className="flex justify-center items-center gap-3 text-emerald-800">
                  <span className="font-serif italic text-3xl md:text-4xl transform -rotate-3">Noemy</span>
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
              src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/BIANCO%20FIOCCO/BIANCO%20FIOCCO(1).jpeg"
              alt="Atelier"
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          </section>

          {/* SEZIONE SOCIAL DRESS */}
          <section className="py-32 w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-white">
            {/* Background Decorativo Elegante */}
            <div className="absolute inset-0 bg-[#F9FAF9]">
              <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent" />
              <div className="absolute right-0 bottom-0 w-2/3 h-full bg-gradient-to-l from-emerald-50/40 to-transparent" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">
                {/* Text Content (Sinistra) */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="w-full md:w-5/12 text-center md:text-left"
                >
                  <span className="inline-block py-1 px-3 rounded-full bg-emerald-100/50 text-emerald-800 text-[10px] uppercase tracking-widest font-bold mb-6 border border-emerald-100">
                    Community
                  </span>

                  <h2 className="font-serif text-5xl md:text-7xl text-emerald-950 mb-8 leading-none">
                    Social <br />
                    <span className="italic text-emerald-600 font-light">Dress</span>
                  </h2>

                  <p className="text-lg text-neutral-600 font-sans mb-10 leading-relaxed">
                    Il lusso non è solo un abito, è un'esperienza condivisa. Segui il nostro viaggio quotidiano, scopri
                    i backstage esclusivi e lasciati ispirare dallo stile di vita Emeraldress.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                    <a href="https://www.instagram.com/emeraldress_/" target="_blank" rel="noopener noreferrer">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="bg-emerald-950 text-[#e4ffec] flex items-center gap-3 px-8 py-4 font-bold tracking-widest text-sm shadow-xl hover:bg-emerald-900 transition-all"
                      >
                        <Instagram className="w-5 h-5" />
                        @emeraldress_
                      </HoverBorderGradient>
                    </a>
                    <span className="text-sm font-serif italic text-neutral-400 flex items-center gap-2">
                      Unisciti a 8k+ followers <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>

                {/* Phone Mockup (Destra) - Minimal & Luxury */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 3 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="w-full md:w-7/12 flex justify-center md:justify-end relative"
                >
                  {/* Decorazioni di sfondo dietro il telefono */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl -z-10" />

                  {/* Floating Elements (Cards, non notifiche fumetto) */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute top-20 -left-10 z-20 hidden md:block"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop"
                      className="w-32 h-40 object-cover rounded-xl shadow-2xl border-4 border-white rotate-[-6deg]"
                      alt="Post preview"
                    />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 -right-4 z-20 hidden md:block"
                  >
                    <div className="bg-white p-4 rounded-xl shadow-2xl border border-emerald-50 max-w-[180px]">
                      <div className="flex gap-1 text-emerald-500 mb-2">
                        <Sparkles className="w-4 h-4 fill-current" />
                      </div>
                      <p className="text-xs text-neutral-600 font-serif italic">
                        "Incredibile la qualità della seta rigenerata!"
                      </p>
                    </div>
                  </motion.div>

                  {/* The Phone Device */}
                  <div className="relative w-[340px] h-[680px] bg-[#121212] rounded-[3.5rem] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden ring-1 ring-white/10 z-10">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-30"></div>

                    {/* Screen Content */}
                    <div className="w-full h-full bg-white relative flex flex-col">
                      {/* Insta Header */}
                      <div className="h-24 bg-white border-b border-neutral-100 flex items-end pb-3 px-6 justify-between z-20 shrink-0">
                        <span className="font-bold text-sm tracking-wide text-neutral-900">emeraldress_</span>
                        <Instagram className="w-5 h-5 text-neutral-900" />
                      </div>

                      {/* Main Image (Full Height) */}
                      <div className="relative flex-1 overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format&fit=crop"
                          alt="Instagram Feed Hero"
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />

                        {/* Gradient Overlay Bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full border-2 border-white p-0.5">
                              <img
                                src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=100&auto=format&fit=crop"
                                className="w-full h-full rounded-full object-cover"
                                alt="Avatar"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold">emeraldress_</p>
                              <p className="text-[10px] opacity-80">Milano, Italy</p>
                            </div>
                          </div>
                          <p className="text-sm font-light leading-relaxed opacity-90 line-clamp-3">
                            L'eleganza non urla, sussurra. Scopri la nuova collezione Seta Rigenerata nel nostro store
                            online.
                            <span className="text-emerald-400 font-medium ml-1">#Emeraldress #SustainableLuxury</span>
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
                <div className="flex flex-col items-center gap-4 py-4 md:py-0 group cursor-default">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50 group-hover:text-emerald-400 transition-colors duration-500">
                    8K+
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-600/80 group-hover:text-emerald-400 transition-colors">
                    FOLLOWERS
                  </span>
                </div>

                {/* Colonna 2 */}
                <div className="flex flex-col items-center gap-4 py-4 md:py-0 group cursor-default">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50 group-hover:text-emerald-400 transition-colors duration-500">
                    100%
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-600/80 group-hover:text-emerald-400 transition-colors">
                    Made in Italy
                  </span>
                </div>

                {/* Colonna 3 */}
                <div className="flex flex-col items-center gap-4 py-4 md:py-0 group cursor-default">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50 group-hover:text-emerald-400 transition-colors duration-500">
                    New
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-600/80 group-hover:text-emerald-400 transition-colors">
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
