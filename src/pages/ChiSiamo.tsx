import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

const founders = [
  {
    name: "Sofia Ferrara",
    role: "Direttrice Creativa",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Marco Ferrara",
    role: "CEO & Co-Fondatore",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Elena Ferrara",
    role: "Responsabile Sostenibilità",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];

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
    <main className="pt-0">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/HERO.mp4"
        bgImageSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
        title="Emerald Dress"
        scrollToExpand="Scorri per esplorare"
        textBlend
      >
        <div className="pt-16">
          {/* Header Description */}
          <motion.div {...fadeUp} className="container mx-auto px-4 lg:px-8 max-w-2xl mb-20">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-sans mb-2">La nostra storia</p>
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Chi Siamo</h1>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Dalla Costa Smeralda al mondo. EMERALDRESS nasce dalla visione di unire l'artigianato sardo con
              l'innovazione tessile sostenibile, creando capi che rispettano la Terra senza compromessi sull'eleganza.
            </p>
          </motion.div>

          {/* Animated Timeline */}
          <Timeline data={timelineData} />

          {/* The Team */}
          <div className="container mx-auto px-4 lg:px-8 mt-16 pb-16">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-sans mb-2">Le persone</p>
              <h2 className="font-serif text-3xl md:text-4xl">Il Team</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-3xl mx-auto">
              {founders.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-muted mb-4">
                    <img src={f.img} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-serif text-base">{f.name}</h3>
                  <p className="text-muted-foreground text-xs font-sans mt-1 tracking-wide">{f.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollExpandMedia>
    </main>
  );
};

export default ChiSiamo;
