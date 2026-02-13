import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/supabaseCustom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Gem,
  ArrowRight,
  Shirt,
  Waves,
  TestTube,
  Scissors,
  Repeat,
  ScanLine,
  CheckCircle2,
} from "lucide-react";
import ScanningRadar from "@/components/ScanningRadar";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const EmeraldScanner = () => {
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [qualitySlider, setQualitySlider] = useState([50]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [scanStatus, setScanStatus] = useState("Inizializzazione...");

  // Funzione per simulare messaggi di analisi dinamici
  const runAnalysisSimulation = async () => {
    setAnalyzing(true);
    setScore(null);

    const steps = [
      "Scansione fibre tessili...",
      "Analisi ciclo di vita...",
      "Calcolo impronta carbonica...",
      "Verifica certificazioni etiche...",
      "Generazione Emerald Score...",
    ];

    for (const step of steps) {
      setScanStatus(step);
      await new Promise((r) => setTimeout(r, 800)); // 800ms per step
    }
  };

  const handleManualSubmit = async () => {
    await runAnalysisSimulation();

    const mockScore = Math.min(100, Math.floor(qualitySlider[0] * 0.6 + Math.random() * 40));

    const { error } = await supabase.from("scanner_requests").insert({
      brand,
      material,
      garment_type: garmentType,
      input_type: "manual",
      sustainability_score: mockScore,
    });

    setAnalyzing(false);

    if (error) {
      toast.error("Errore durante l'analisi.");
      return;
    }
    setScore(mockScore);
    toast.success(`Analisi completata`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Non avviamo ancora analyzing qui per mostrare prima l'upload

    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("scanner_uploads").upload(filePath, file);

    if (uploadError) {
      toast.error("Errore durante il caricamento.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("scanner_uploads").getPublicUrl(filePath);

    setUploading(false);

    // Ora avviamo l'analisi simulata
    await runAnalysisSimulation();

    const mockScore = Math.floor(Math.random() * 40) + 60;

    await supabase.from("scanner_requests").insert({
      image_url: urlData.publicUrl,
      input_type: "photo",
      sustainability_score: mockScore,
    });

    setAnalyzing(false);
    setScore(mockScore);
    toast.success(`Analisi completata`);
  };

  // Helper per determinare il livello e colore
  const getScoreDetails = (s: number) => {
    if (s >= 80)
      return {
        label: "ECCELLENTE",
        color: "text-emerald-600",
        bg: "bg-emerald-500",
        text: "Questo capo rappresenta il futuro della moda.",
      };
    if (s >= 60)
      return {
        label: "BUONO",
        color: "text-emerald-500",
        bg: "bg-emerald-400",
        text: "Buone pratiche di sostenibilità rilevate.",
      };
    return {
      label: "MIGLIORABILE",
      color: "text-orange-500",
      bg: "bg-orange-400",
      text: "Impatto ambientale significativo.",
    };
  };

  const pillars = [
    { title: "Recupero", icon: Waves, desc: "Reti & Plastica" },
    { title: "Rigenerazione", icon: TestTube, desc: "Filo Puro" },
    { title: "Creazione", icon: Scissors, desc: "Made in Italy" },
    { title: "Circolarità", icon: Repeat, desc: "Riuso Infinito" },
  ];

  return (
    <main className="bg-neutral-50 min-h-screen relative overflow-hidden font-sans">
      {/* TEXTURE BACKGROUND (Noise Effect) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* DECORAZIONI FLUTTUANTI */}
      <div className="absolute top-20 left-10 opacity-30 pointer-events-none animate-pulse z-0">
        <Gem className="w-32 h-32 text-emerald-200/50 rotate-12 blur-sm" />
      </div>
      <div className="absolute top-1/2 right-0 opacity-20 pointer-events-none z-0">
        <div className="w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px]" />
      </div>

      {/* SEZIONE 1: LO SCANNER */}
      <div className="pt-16 relative z-10">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center gap-6 mb-16">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative group cursor-default"
              >
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-600 flex items-center justify-center shadow-2xl border border-emerald-400/30 relative z-10">
                  <Gem className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>
              </motion.div>

              <div className="space-y-4 text-center">
                <h1 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight">
                  Emerald{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic">
                    Scanner
                  </span>
                </h1>
                <p className="text-neutral-500 font-sans text-lg max-w-xl mx-auto leading-relaxed">
                  L'Intelligenza Artificiale al servizio della moda etica. Carica una foto per rivelare il DNA
                  sostenibile del tuo guardaroba.
                </p>
              </div>
            </div>
          }
        >
          {/* INTERFACCIA IPAD (Schermo) */}
          <div className="h-full w-full overflow-y-auto bg-neutral-50 relative flex flex-col">
            {/* Header iPad */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">System Ready</span>
            </div>

            <div className="flex-1 p-4 md:p-10 max-w-2xl mx-auto w-full">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-10 bg-white p-1.5 rounded-full shadow-sm border border-neutral-100">
                  <TabsTrigger
                    value="photo"
                    className="rounded-full py-2.5 data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all"
                  >
                    Carica Foto
                  </TabsTrigger>
                  <TabsTrigger
                    value="manual"
                    className="rounded-full py-2.5 data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all"
                  >
                    Manuale
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="photo" className="space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-300 to-emerald-600 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative border border-neutral-200 bg-white rounded-3xl p-12 text-center overflow-hidden">
                      {/* Effetto griglia di sfondo */}
                      <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage: "radial-gradient(#059669 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      ></div>

                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="font-serif text-xl text-neutral-900 mb-2 relative z-10">Drop Zone</h3>
                      <p className="text-sm text-neutral-500 font-sans mb-8 relative z-10">
                        Trascina un'immagine o scatta una foto
                      </p>

                      <label className="cursor-pointer relative z-10">
                        <span className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-full text-xs tracking-[0.15em] uppercase font-bold hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-0.5">
                          <ScanLine className="w-4 h-4" /> Seleziona File
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>

                      {/* Linea di Scansione Animata (Visibile solo durante upload/analisi) */}
                      {(uploading || analyzing) && (
                        <motion.div
                          className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-0"
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>
                  </div>
                  {uploading && (
                    <p className="text-sm text-emerald-600 font-medium text-center animate-pulse">
                      Caricamento immagine in corso...
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="brand"
                          className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 mb-2 block"
                        >
                          Brand
                        </Label>
                        <Input
                          id="brand"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="Es. Gucci..."
                          className="h-12 bg-neutral-50 border-transparent focus:bg-white focus:border-emerald-200 transition-all rounded-xl"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="garment"
                          className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 mb-2 block"
                        >
                          Tipo Capo
                        </Label>
                        <Input
                          id="garment"
                          value={garmentType}
                          onChange={(e) => setGarmentType(e.target.value)}
                          placeholder="Es. Camicia..."
                          className="h-12 bg-neutral-50 border-transparent focus:bg-white focus:border-emerald-200 transition-all rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="material"
                        className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 mb-2 block"
                      >
                        Materiale Principale
                      </Label>
                      <Input
                        id="material"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="Es. 100% Cotone Organico..."
                        className="h-12 bg-neutral-50 border-transparent focus:bg-white focus:border-emerald-200 transition-all rounded-xl"
                      />
                    </div>
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex justify-between mb-4">
                        <Label className="text-[10px] tracking-widest uppercase font-sans text-neutral-400">
                          Condizione / Qualità
                        </Label>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {qualitySlider[0]}%
                        </span>
                      </div>
                      <Slider
                        value={qualitySlider}
                        onValueChange={setQualitySlider}
                        max={100}
                        step={1}
                        className="py-2"
                      />
                    </div>
                  </div>

                  <div onClick={handleManualSubmit} className="pt-2">
                    <HoverBorderGradient
                      containerClassName={cn(
                        "rounded-full w-full",
                        (analyzing || !brand) && "opacity-50 pointer-events-none",
                      )}
                      className="bg-[#e4ffec] text-emerald-950 w-full flex justify-center py-4 font-bold tracking-widest uppercase text-sm"
                    >
                      {analyzing ? "Avvio protocollo..." : "Calcola Impatto"}
                    </HoverBorderGradient>
                  </div>
                </TabsContent>
              </Tabs>

              {/* FASE DI ANALISI */}
              <AnimatePresence>
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-10 text-center"
                  >
                    <ScanningRadar />
                    <motion.p
                      key={scanStatus}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-xs text-emerald-600 mt-6 uppercase tracking-widest font-bold font-mono"
                    >
                      {`> ${scanStatus}`}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* RISULTATO SCORE */}
              <AnimatePresence>
                {score !== null && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mt-10 relative overflow-hidden"
                  >
                    <div className="bg-white border border-neutral-100 rounded-[2rem] p-10 text-center shadow-2xl relative z-10">
                      {/* Badge Livello */}
                      <div
                        className={cn(
                          "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 text-white",
                          getScoreDetails(score).bg,
                        )}
                      >
                        {getScoreDetails(score).label}
                      </div>

                      <div className="relative inline-block">
                        <h2
                          className={cn("font-serif text-8xl md:text-9xl leading-none", getScoreDetails(score).color)}
                        >
                          {score}
                        </h2>
                        <span className="absolute -right-6 top-2 text-2xl text-neutral-300 font-sans">/100</span>
                      </div>

                      <div className="h-1 w-full bg-neutral-100 rounded-full mt-8 mb-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={cn("h-full rounded-full", getScoreDetails(score).bg)}
                        />
                      </div>

                      <p className="text-neutral-500 text-sm font-sans max-w-sm mx-auto leading-relaxed">
                        {getScoreDetails(score).text}
                      </p>

                      <div className="mt-8 flex justify-center gap-2 text-xs text-emerald-600/60 font-mono">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Materials Verified
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Supply Chain
                        </span>
                      </div>
                    </div>
                    {/* Glow effect dietro la card */}
                    <div
                      className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-3xl opacity-20 -z-10",
                        getScoreDetails(score).bg,
                      )}
                    ></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* SEZIONE 2: LINK A SOSTENIBILITÀ (Con Roadmap 4 Pilastri) */}
      <section className="py-24 bg-white border-t border-neutral-100 relative overflow-hidden">
        {/* Decorazione sfondo */}
        <Gem className="absolute -left-10 top-20 w-64 h-64 text-emerald-50 rotate-45 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
            <div className="w-full md:w-5/12 space-y-8 text-center md:text-left">
              <h2 className="font-serif text-4xl md:text-5xl text-neutral-900">Come funziona il punteggio?</h2>
              <p className="text-lg text-neutral-600 font-sans leading-relaxed">
                Il nostro algoritmo si basa sui 4 pilastri della sostenibilità Emeraldress. Un ciclo virtuoso che
                trasforma lo scarto in bellezza e garantisce un futuro rigenerabile.
              </p>
              <div className="flex justify-center md:justify-start pt-2">
                <Link to="/sostenibilita">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    className="bg-white text-emerald-950 flex items-center gap-2 font-medium"
                  >
                    <Gem className="w-4 h-4" />
                    APPROFONDISCI I PILASTRI
                  </HoverBorderGradient>
                </Link>
              </div>
            </div>

            {/* Visual Roadmap (4 Pilastri) */}
            <div className="w-full md:w-7/12">
              <div className="bg-neutral-50/80 backdrop-blur-sm rounded-[2.5rem] p-10 border border-neutral-100 relative">
                {/* Linea di connessione tratteggiata */}
                <div className="absolute top-[3.25rem] left-12 right-12 h-0.5 border-t-2 border-dashed border-emerald-200 hidden md:block" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 relative">
                  {pillars.map((pillar, index) => (
                    <div key={index} className="flex flex-col items-center text-center relative group cursor-default">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10, backgroundColor: "#fff" }}
                        className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center mb-4 relative z-10 shadow-sm transition-colors duration-300"
                      >
                        <pillar.icon className="w-7 h-7 text-emerald-600" />
                      </motion.div>
                      <h4 className="font-serif text-lg text-emerald-950 mb-1">{pillar.title}</h4>
                      <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-sans font-bold">
                        {pillar.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE 3: LINK A COLLEZIONI (Visual Banner) */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center group">
        {/* Background Image Parallax Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/vestito%20bianco%201.jpeg"
            alt="Fashion Collection"
            className="w-full h-full object-cover brightness-[0.6] transition-transform duration-[3s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-1 bg-emerald-400 mx-auto mb-8 rounded-full shadow-[0_0_10px_#34d399]" />
            <span className="text-emerald-200 tracking-[0.4em] uppercase text-xs font-bold mb-6 block">
              Shop The Look
            </span>
            <h2 className="font-serif text-5xl md:text-7xl mb-10 drop-shadow-lg">Indossa la Trasparenza</h2>
            <div className="flex justify-center">
              <Link to="/collezioni">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-10 py-5 font-bold tracking-widest uppercase text-sm"
                >
                  Scopri la Collezione
                  <Shirt className="w-4 h-4" />
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default EmeraldScanner;
