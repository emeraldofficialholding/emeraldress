import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

const founders = [
  { name: "Sofia Ferrara", role: "Direttrice Creativa", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" },
  { name: "Marco Ferrara", role: "CEO & Co-Fondatore", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { name: "Elena Ferrara", role: "Responsabile Sostenibilità", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
];

const ChiSiamo = () => (
  <main className="pt-24 pb-16">
    <div className="container mx-auto px-4 lg:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="max-w-2xl mb-20">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-sans mb-2">La nostra storia</p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Chi Siamo</h1>
        <p className="text-muted-foreground font-sans leading-relaxed">
          Dalla Costa Smeralda al mondo. EMERALDRESS nasce dalla visione di unire l'artigianato sardo
          con l'innovazione tessile sostenibile, creando capi che rispettano la Terra senza compromessi sull'eleganza.
        </p>
      </motion.div>

      {/* Z-Pattern: Section 1 – Text Left, Image Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        <motion.div {...fadeUp}>
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-sans mb-2">Le origini</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Nati in Sardegna</h2>
          <p className="text-muted-foreground font-sans leading-relaxed">
            Lungo le coste della Sardegna, dove il verde smeraldo del mare incontra la macchia mediterranea,
            è nata la nostra ispirazione. Ogni collezione porta con sé i colori, le texture e lo spirito
            di questa terra straordinaria. La Costa Smeralda non è solo il nostro luogo d'origine:
            è la nostra musa permanente.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="aspect-[4/5] bg-accent overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=750&fit=crop"
            alt="Costa Smeralda, Sardegna"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Z-Pattern: Section 2 – Image Left, Text Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        <motion.div {...fadeUp} className="aspect-[4/5] bg-accent overflow-hidden lg:order-1">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=750&fit=crop"
            alt="Artigianato digitale"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div {...fadeUp} className="lg:order-2">
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-sans mb-2">Innovazione</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Artigianato Digitale</h2>
          <p className="text-muted-foreground font-sans leading-relaxed">
            Uniamo secoli di tradizione sartoriale italiana con le più avanzate tecnologie tessili.
            Ogni capo è progettato digitalmente e realizzato a mano, combinando precisione
            computazionale con il tocco insostituibile dell'artigiano. Il risultato: pezzi unici
            che parlano sia di passato che di futuro.
          </p>
        </motion.div>
      </div>

      {/* The Team */}
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
  </main>
);

export default ChiSiamo;
