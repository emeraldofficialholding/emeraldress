import { motion } from "framer-motion";

const ManifestoSection = () => (
  <section className="py-28 px-4 lg:px-8">
    <div className="container mx-auto max-w-3xl text-center">
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="font-serif text-3xl md:text-5xl leading-snug tracking-tight"
      >
        "La moda non deve costare la Terra."
      </motion.blockquote>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-8 text-muted-foreground font-sans text-sm tracking-[0.15em] uppercase"
      >
        — Il nostro manifesto
      </motion.p>
    </div>
  </section>
);

export default ManifestoSection;
