import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight, Leaf, Globe, Fingerprint, Scissors, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/supabaseCustom";

const ManifestoSection = () => {
  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefono: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.telefono) {
      toast.error("Per favore, compila tutti i campi obbligatori.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("newsletter_leads").insert([
        {
          full_name: formData.nome,
          email: formData.email,
          phone: formData.telefono,
          source: "manifesto_home",
        },
      ]);

      if (error) throw error;

      toast.success("Benvenuto nell'Inner Circle di Emeraldress.");
      setFormData({ nome: "", email: "", telefono: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* --- SEZIONE 1: IL MANIFESTO (Hero) --- */}
      <section className="relative py-40 overflow-hidden flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2000&auto=format&fit=crop"
            alt="Emeraldress Manifesto"
            className="w-full h-full object-cover brightness-[0.4] scale-105"
          />
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-emerald-300 tracking-[0.3em] uppercase text-xs font-bold mb-6 block">
              La nostra Filosofia
            </span>

            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-12 drop-shadow-lg">
              "La moda non deve <br /> costare la Terra."
            </h2>

            {/* BOTTONE CORRETTO: Colore Menta e Testo Scuro */}
            <div className="flex justify-center">
              <Link to="/chisiamo">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-10 py-4 font-bold tracking-widest uppercase text-sm hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(228,255,236,0.3)]"
                >
                  Scopri la nostra storia
                  <ArrowRight className="w-4 h-4" />
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SEZIONE 2: VISION (Redesign Editoriale) --- */}
      <section className="py-32 bg-[#F9FAF9] relative overflow-hidden">
        {/* Decorazione Sfondo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* COLONNA SX: Testo & Features */}
            <div className="lg:col-span-5 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="font-serif text-5xl md:text-6xl text-emerald-950 leading-none mb-6">
                  Lusso <br /> <span className="italic text-emerald-600">Rigenerato.</span>
                </h3>
                <div className="h-1 w-20 bg-emerald-400 mb-8" />
                <p className="text-neutral-600 text-lg leading-relaxed font-sans">
                  Non creiamo solo abiti, progettiamo il futuro. Ogni capo Emeraldress nasce da reti da pesca recuperate
                  dai fondali marini, trasformate in <strong>Nylon rigenerato ECONYL®</strong>. Bellezza pura, senza
                  compromessi.
                </p>
              </motion.div>

              {/* Griglia Icone Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-emerald-900 mb-1">ECONYL® Yarn</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">100% Rigenerato</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Scissors className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-emerald-900 mb-1">Made in Italy</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Sartoria Etica</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Fingerprint className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-emerald-900 mb-1">Blockchain</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Trasparenza Totale</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* COLONNA DX: Immagini Sovrapposte (Editorial Look) */}
            <div className="lg:col-span-7 relative h-[600px] hidden lg:block">
              {/* Immagine Grande (Sfondo) */}
              <motion.div
                className="absolute right-0 top-0 w-3/4 h-[550px] overflow-hidden rounded-sm shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/dettaglio.jpeg"
                  alt="Fashion Editorial"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </motion.div>

              {/* Immagine Piccola (Sovrapposta) */}
              <motion.div
                className="absolute left-10 bottom-0 w-1/2 h-[350px] overflow-hidden rounded-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-4 border-white"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://images.unsplash.com/photo-1612462767205-2e6377e12739?q=80&w=800&auto=format&fit=crop"
                  alt="Fabric Detail"
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-serif text-2xl italic">"Eternal Style"</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEZIONE 3: NEWSLETTER FORM (Dark Luxury) --- */}
      <section className="py-24 bg-[#051c14] relative overflow-hidden border-t border-emerald-900/30">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Leaf className="w-10 h-10 text-emerald-400 mx-auto mb-6" />
            <h3 className="font-serif text-4xl md:text-5xl text-white mb-6">Entra nell'Inner Circle</h3>
            <p className="text-emerald-100/60 font-sans text-lg max-w-xl mx-auto">
              Ricevi inviti esclusivi per le sfilate, accesso anticipato ai drop limitati e contenuti riservati sulla
              sostenibilità.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* INPUT NOME */}
                <div className="group relative">
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="block w-full bg-transparent border-b border-emerald-800/50 py-4 text-emerald-50 text-lg placeholder-transparent focus:border-emerald-400 focus:outline-none transition-colors peer"
                    placeholder="Nome Completo"
                    required
                  />
                  <label
                    htmlFor="nome"
                    className="absolute left-0 -top-3.5 text-emerald-400 text-xs transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-emerald-700 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-400 peer-focus:text-xs uppercase tracking-widest"
                  >
                    Nome Completo
                  </label>
                </div>

                {/* INPUT EMAIL */}
                <div className="group relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full bg-transparent border-b border-emerald-800/50 py-4 text-emerald-50 text-lg placeholder-transparent focus:border-emerald-400 focus:outline-none transition-colors peer"
                    placeholder="Indirizzo Email"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-emerald-400 text-xs transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-emerald-700 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-400 peer-focus:text-xs uppercase tracking-widest"
                  >
                    Indirizzo Email
                  </label>
                </div>

                {/* INPUT TELEFONO */}
                <div className="group relative">
                  <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="block w-full bg-transparent border-b border-emerald-800/50 py-4 text-emerald-50 text-lg placeholder-transparent focus:border-emerald-400 focus:outline-none transition-colors peer"
                    placeholder="Numero di Telefono"
                    required
                  />
                  <label
                    htmlFor="telefono"
                    className="absolute left-0 -top-3.5 text-emerald-400 text-xs transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-emerald-700 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-400 peer-focus:text-xs uppercase tracking-widest"
                  >
                    Numero di Telefono
                  </label>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <HoverBorderGradient
                  as="button"
                  type="submit"
                  disabled={isSubmitting}
                  containerClassName="rounded-full"
                  className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-12 py-4 font-bold tracking-widest uppercase text-sm w-full md:w-auto justify-center min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrazione...
                    </>
                  ) : (
                    "Iscriviti Ora"
                  )}
                </HoverBorderGradient>
              </div>

              <p className="text-center text-xs text-emerald-800/60 mt-0">
                I tuoi dati sono al sicuro. Non inviamo spam, solo eccellenza.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManifestoSection;
