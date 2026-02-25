import { useState } from "react";
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
  Shirt,
  Waves,
  TestTube,
  Scissors,
  Repeat,
  ScanLine,
  CheckCircle2,
  RefreshCw,
  X, ChartNoAxesCombined } from
"lucide-react";
import ScanningRadar from "@/components/ScanningRadar";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const EmeraldScanner = () => {
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [qualitySlider, setQualitySlider] = useState([50]);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [scanStatus, setScanStatus] = useState("Inizializzazione...");

  // Reset function per fare una nuova scansione
  const resetScanner = () => {
    setScore(null);
    setAnalyzing(false);
    setBrand("");
    setMaterial("");
    setGarmentType("");
    setQualitySlider([50]);
  };

  // Funzione per simulare messaggi di analisi dinamici
  const runAnalysisSimulation = async () => {
    setAnalyzing(true);
    setScore(null);

    const steps = [
    "Scansione fibre tessili...",
    "Analisi ciclo di vita...",
    "Calcolo impronta carbonica...",
    "Verifica certificazioni etiche...",
    "Generazione Emerald Score..."];


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
      sustainability_score: mockScore
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

    // Start UI simulation immediately
    await runAnalysisSimulation();

    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("scanner_uploads").upload(filePath, file);

    if (uploadError) {
      toast.error("Errore caricamento.");
      setAnalyzing(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("scanner_uploads").getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;

    try {
      // 1. Insert into scanner_requests and retrieve the full record
      const { data: record, error } = await supabase
        .from("scanner_requests")
        .insert({
          image_url: imageUrl,
          input_type: "image",
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        toast.error(error.message, { style: { background: '#dc2626', color: '#fff' } });
        return;
      }

      // 2. Call n8n webhook with the record
      const webhookRes = await fetch("https://n8n.kreareweb.com/webhook/krea-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: {
            id: record.id,
            image_url: record.image_url,
          },
        }),
      });

      if (!webhookRes.ok) throw new Error("Webhook failed");

      toast.success("Foto inviata allo scanner!");
    } catch (err) {
      console.error(err);
      toast.error("Errore nell'avvio dell'analisi.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper per determinare il livello e colore
  const getScoreDetails = (s: number) => {
    if (s >= 80)
    return {
      label: "ECCELLENTE",
      color: "text-emerald-600",
      bg: "bg-emerald-500",
      text: "Questo capo rappresenta il futuro della moda."
    };
    if (s >= 60)
    return {
      label: "BUONO",
      color: "text-emerald-500",
      bg: "bg-emerald-400",
      text: "Buone pratiche di sostenibilità rilevate."
    };
    return {
      label: "MIGLIORABILE",
      color: "text-orange-500",
      bg: "bg-orange-400",
      text: "Impatto ambientale significativo."
    };
  };

  const pillars = [
  { title: "Recupero", icon: Waves, desc: "Reti & Plastica" },
  { title: "Rigenerazione", icon: TestTube, desc: "Filo Puro" },
  { title: "Creazione", icon: Scissors, desc: "Made in Italy" },
  { title: "Circolarità", icon: Repeat, desc: "Riuso Infinito" }];


  return (
    <main className="bg-neutral-50 min-h-screen relative overflow-hidden font-sans">
      {/* TEXTURE BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}>
      </div>

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
              className="relative group cursor-default">

                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-600 flex items-center justify-center shadow-2xl border border-emerald-400/30 relative z-10">
                  <ChartNoAxesCombined className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
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
          }>

          {/* INTERFACCIA IPAD (Schermo Fisso - No Scroll) */}
          <div className="h-full w-full bg-neutral-50 relative flex flex-col overflow-hidden">
            {/* Header iPad */}
            <div className="h-12 shrink-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {analyzing ? "PROCESSING..." : score ? "ANALYSIS COMPLETE" : "SYSTEM READY"}
              </span>
            </div>

            {/* Content Area - Flex Grow per occupare tutto lo spazio */}
            <div className="flex-1 relative w-full h-full p-6 md:p-8 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {/* STATE 1: INPUT (Photo or Manual) */}
                {!analyzing && score === null &&
                <motion.div
                  key="input-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-xl h-full flex flex-col">

                    <Tabs defaultValue="photo" className="w-full h-full flex flex-col">
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-white p-1 rounded-full shadow-sm border border-neutral-100 shrink-0">
                        <TabsTrigger
                        value="photo"
                        className="rounded-full text-xs py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all">

                          Carica Foto
                        </TabsTrigger>
                        <TabsTrigger
                        value="manual"
                        className="rounded-full text-xs py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all">

                          Manuale
                        </TabsTrigger>
                      </TabsList>

                      {/* Content Container che riempie lo spazio rimanente */}
                      <div className="flex-1 relative">
                        {/* TAB FOTO */}
                        <TabsContent value="photo" className="h-full mt-0">
                          <div className="h-full border-2 border-dashed border-neutral-200 bg-white/50 rounded-3xl flex flex-col items-center justify-center relative group hover:bg-white hover:border-emerald-300 transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform">
                              <Upload className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="font-serif text-lg text-neutral-900 mb-1">Drop Zone</h3>
                            <p className="text-xs text-neutral-400 font-sans mb-6">Trascina o scatta una foto</p>

                            <label className="cursor-pointer relative z-10">
                              <span className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-0.5">
                                <ScanLine className="w-3 h-3" /> Seleziona File
                              </span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                            </label>
                          </div>
                        </TabsContent>

                        {/* TAB MANUALE */}
                        <TabsContent value="manual" className="h-full mt-0">
                          <div className="h-full bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="brand" className="text-[10px] uppercase text-neutral-400 mb-1 block">
                                    Brand
                                  </Label>
                                  <Input
                                  id="brand"
                                  value={brand}
                                  onChange={(e) => setBrand(e.target.value)}
                                  placeholder="Es. Gucci"
                                  className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg" />

                                </div>
                                <div>
                                  <Label
                                  htmlFor="garment"
                                  className="text-[10px] uppercase text-neutral-400 mb-1 block">

                                    Tipo
                                  </Label>
                                  <Input
                                  id="garment"
                                  value={garmentType}
                                  onChange={(e) => setGarmentType(e.target.value)}
                                  placeholder="Es. Camicia"
                                  className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg" />

                                </div>
                              </div>

                              <div>
                                <Label htmlFor="material" className="text-[10px] uppercase text-neutral-400 mb-1 block">
                                  Materiale
                                </Label>
                                <Input
                                id="material"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="Es. 100% Cotone"
                                className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg" />

                              </div>

                              <div className="pt-2">
                                <div className="flex justify-between mb-2">
                                  <Label className="text-[10px] uppercase text-neutral-400">Qualità Percepita</Label>
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    {qualitySlider[0]}%
                                  </span>
                                </div>
                                <Slider value={qualitySlider} onValueChange={setQualitySlider} max={100} step={1} />
                              </div>
                            </div>

                            <div onClick={handleManualSubmit} className="mt-4">
                              <HoverBorderGradient
                              containerClassName={cn(
                                "rounded-full w-full",
                                !brand && "opacity-50 pointer-events-none"
                              )}
                              className="bg-[#e4ffec] text-emerald-950 w-full flex justify-center py-3 font-bold tracking-widest uppercase text-xs">

                                Avvia Analisi
                              </HoverBorderGradient>
                            </div>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </motion.div>
                }

                {/* STATE 2: ANALYZING */}
                {analyzing &&
                <motion.div
                  key="analyzing-state"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center justify-center w-full h-full">

                    <div className="scale-75 md:scale-100">
                      <ScanningRadar />
                    </div>
                    <motion.p
                    key={scanStatus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[10px] md:text-xs text-emerald-600 mt-8 uppercase tracking-widest font-bold font-mono">

                      {`> ${scanStatus}`}
                    </motion.p>
                  </motion.div>
                }

                {/* STATE 3: RESULT */}
                {score !== null && !analyzing &&
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg h-full flex flex-col items-center justify-center">

                    <div className="bg-white w-full border border-neutral-100 rounded-[2rem] p-6 md:p-8 text-center shadow-lg relative overflow-hidden">
                      {/* Close/Reset Button */}
                      <button
                      onClick={resetScanner}
                      className="absolute top-4 right-4 p-2 bg-neutral-50 hover:bg-neutral-100 rounded-full transition-colors">

                        <X className="w-4 h-4 text-neutral-400" />
                      </button>

                      <div
                      className={cn(
                        "inline-block px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase mb-4 text-white",
                        getScoreDetails(score).bg
                      )}>

                        {getScoreDetails(score).label}
                      </div>

                      <div className="relative inline-block mb-4">
                        <h2
                        className={cn("font-serif text-7xl md:text-8xl leading-none", getScoreDetails(score).color)}>

                          {score}
                        </h2>
                      </div>

                      <p className="text-neutral-500 text-xs font-sans max-w-xs mx-auto leading-relaxed mb-6">
                        {getScoreDetails(score).text}
                      </p>

                      <div className="flex justify-center gap-4 text-[10px] text-emerald-600/60 font-mono mb-6">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Materials
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Supply Chain
                        </span>
                      </div>

                      <button
                      onClick={resetScanner}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-emerald-600 transition-colors">

                        <RefreshCw className="w-3 h-3" /> Nuova Scansione
                      </button>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* SEZIONE 2: LINK A SOSTENIBILITÀ (Con Roadmap 4 Pilastri) */}
      <section className="py-24 bg-white border-t border-neutral-100 relative overflow-hidden">
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
                    className="bg-white text-emerald-950 flex items-center gap-2 font-medium">

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
                  {pillars.map((pillar, index) =>
                  <div key={index} className="flex flex-col items-center text-center relative group cursor-default">
                      <motion.div
                      whileHover={{ scale: 1.1, rotate: 10, backgroundColor: "#fff" }}
                      className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center mb-4 relative z-10 shadow-sm transition-colors duration-300">

                        <pillar.icon className="w-7 h-7 text-emerald-600" />
                      </motion.div>
                      <h4 className="font-serif text-lg text-emerald-950 mb-1">{pillar.title}</h4>
                      <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-sans font-bold">
                        {pillar.desc}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE 3: LINK A COLLEZIONI (Visual Banner) */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/NERO%20CLASSIC/NERO%20CLASSIC%20(6).png"
            alt="Fashion Collection"
            className="w-full h-full object-cover brightness-[0.6] transition-transform duration-[3s] group-hover:scale-105" />

          <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>

            <div className="w-20 h-1 bg-emerald-400 mx-auto mb-8 rounded-full shadow-[0_0_10px_#34d399]" />
            <span className="text-emerald-200 tracking-[0.4em] uppercase text-xs font-bold mb-6 block">
              Shop The Look
            </span>
            <h2 className="font-serif text-5xl md:text-7xl mb-10 drop-shadow-lg">Indossa la Trasparenza</h2>
            <div className="flex justify-center">
              <Link to="/collezioni">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-10 py-5 font-bold tracking-widest uppercase text-sm">

                  Scopri la Collezione
                  <Shirt className="w-4 h-4" />
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>);

};

export default EmeraldScanner;