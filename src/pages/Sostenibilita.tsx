import { motion } from "framer-motion";
import { Anchor, Recycle, Scissors, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: Anchor,
    title: "Recupero",
    desc: "Reti da pesca e scarti plastici vengono raccolti dalle coste del Mediterraneo, trasformando l'inquinamento in risorsa.",
  },
  {
    icon: Recycle,
    title: "Rigenerazione",
    desc: "Attraverso il processo ECONYL®, i rifiuti vengono trasformati in filo di nylon rigenerato, identico al vergine per qualità.",
  },
  {
    icon: Scissors,
    title: "Creazione",
    desc: "Artigiani italiani trasformano le fibre rigenerate in capi d'alta moda, con tagli sartoriali e finiture impeccabili.",
  },
  {
    icon: RefreshCw,
    title: "Circolarità",
    desc: "Ogni capo è progettato per durare e, a fine vita, essere rigenerato nuovamente. Moda senza fine, rifiuti zero.",
  },
];

const Sostenibilita = () => (
  <main className="pt-24 pb-16">
    <div className="container mx-auto px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mb-20"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-primary font-sans mb-2">Il nostro impegno</p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Sostenibilità</h1>
        <p className="text-muted-foreground font-sans leading-relaxed">
          La sostenibilità non è un'opzione, è il nostro DNA. Ogni fase del nostro processo produttivo
          è progettata per minimizzare l'impatto ambientale e massimizzare il valore sociale.
        </p>
      </motion.div>

      {/* Vertical Timeline */}
      <div className="relative max-w-2xl mx-auto">
        {/* Central line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="relative pl-16 pb-16 last:pb-0"
          >
            {/* Icon circle */}
            <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <step.icon className="w-5 h-5 text-primary" />
            </div>

            <p className="text-xs tracking-[0.2em] uppercase text-primary font-sans mb-1">
              Fase {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-serif text-2xl mb-2">{step.title}</h3>
            <p className="text-muted-foreground font-sans leading-relaxed text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </main>
);

export default Sostenibilita;
