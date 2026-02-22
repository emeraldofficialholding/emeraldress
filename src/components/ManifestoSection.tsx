import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight, Globe, Fingerprint, Scissors, Loader2 } from "lucide-react";
import logoED from "@/assets/logo-ed.png";
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
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/BIANCO%20FIOCCO/BIANCO%20FIOCCO(1).jpeg"
            alt="Emeraldress Manifesto"
            className="w-full h-full object-cover brightness-[0.6] scale-105"
          />

          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
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

      {/* --- SEZIONE 2: VISION (Focus Sostenibilità) --- */}
      <section className="py-32 bg-[#F9FAF9] relative overflow-hidden">
        {/* Decorazione Sfondo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* COLONNA SX: Testo & Call to Action */}
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
                <p className="text-neutral-600 text-lg leading-relaxed font-sans mb-8">
                  Non creiamo solo abiti, progettiamo il futuro. Ogni capo Emeraldress nasce dal recupero di reti da
                  pesca abbandonate nei mari, trasformate in prezioso <strong>Nylon ECONYL®</strong>. Scopri come un
                  problema ambientale diventa bellezza pura, senza compromessi per il pianeta.
                </p>

                {/* NUOVO BOTTONE VERSO /SOSTENIBILITA */}
                <Link to="/sostenibilita" className="inline-block">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    className="bg-emerald-950 text-[#e4ffec] flex items-center gap-3 px-8 py-3.5 font-bold tracking-widest uppercase text-xs hover:bg-emerald-900 transition-colors shadow-lg"
                  >
                    Scopri i Benefici del Processo
                    <ArrowRight className="w-4 h-4" />
                  </HoverBorderGradient>
                </Link>
              </motion.div>

              {/* Griglia Icone Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-emerald-100/50">
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
            <div className="lg:col-span-7 relative h-[400px] lg:h-[600px] mt-12 lg:mt-0">
              {/* Immagine Grande (Sfondo) */}
              <motion.div
                className="absolute right-0 top-0 w-full lg:w-3/4 h-[350px] lg:h-[550px] overflow-hidden rounded-sm shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/NERO%20CLASSIC/NERO%20CLASSIC%20(11).png"
                  alt="Fashion Editorial"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </motion.div>

              {/* Immagine Piccola (Sovrapposta) */}
              <motion.div
                className="absolute left-0 lg:left-10 bottom-0 w-2/3 lg:w-1/2 h-[200px] lg:h-[350px] overflow-hidden rounded-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-4 border-white hidden lg:block"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/Gemini_Generated_Image_62etyv62etyv62et%20-%20Modificata.png"
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

      {/* --- SEZIONE 3: NEWSLETTER FORM (BRAND COLOR BG) --- */}
      <section className="py-24 bg-[#e4ffec] relative overflow-hidden border-t border-emerald-100">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-60" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl p-2">
              <img src={logoED} alt="Emeraldress" className="w-full h-full object-contain invert brightness-200" />
            </div>
            <h3 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-6">Entra nell'Emerald Circle</h3>
            <p className="text-emerald-800/80 font-sans text-lg max-w-xl mx-auto">
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
                    className="block w-full bg-transparent border-b border-emerald-900/20 py-4 text-emerald-950 text-lg placeholder-transparent focus:border-emerald-600 focus:outline-none transition-colors peer"
                    placeholder="Nome Completo"
                    required
                  />
                  <label
                    htmlFor="nome"
                    className="absolute left-0 -top-3.5 text-emerald-700 text-xs transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-emerald-800/60 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-700 peer-focus:text-xs uppercase tracking-widest"
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
                    className="block w-full bg-transparent border-b border-emerald-900/20 py-4 text-emerald-950 text-lg placeholder-transparent focus:border-emerald-600 focus:outline-none transition-colors peer"
                    placeholder="Indirizzo Email"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-emerald-700 text-xs transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-emerald-800/60 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-700 peer-focus:text-xs uppercase tracking-widest"
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
                    className="block w-full bg-transparent border-b border-emerald-900/20 py-4 text-emerald-950 text-lg placeholder-transparent focus:border-emerald-600 focus:outline-none transition-colors peer"
                    placeholder="Numero di Telefono"
                    required
                  />
                  <label
                    htmlFor="telefono"
                    className="absolute left-0 -top-3.5 text-emerald-700 text-xs transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-emerald-800/60 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-700 peer-focus:text-xs uppercase tracking-widest"
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
                  className="bg-emerald-950 text-[#e4ffec] border-none flex items-center gap-3 px-12 py-4 font-bold tracking-widest uppercase text-sm w-full md:w-auto justify-center min-w-[200px] hover:bg-emerald-900 transition-colors"
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

              <p className="text-center text-xs text-emerald-900/50 mt-0">
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
