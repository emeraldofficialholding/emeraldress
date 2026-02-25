import { useState, useEffect, useRef, useCallback } from "react";
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
  X,
  ChartNoAxesCombined,
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

type ScannerPhase = "input" | "uploading" | "waiting" | "result";

const EmeraldScanner = () => {
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [qualitySlider, setQualitySlider] = useState([50]);
  const [urlDellaFotoCaricata, setUrlDellaFotoCaricata] = useState("");

  const [phase, setPhase] = useState<ScannerPhase>("input");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [resultDiagnosis, setResultDiagnosis] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Polling logic
  const startPolling = useCallback((id: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("scanner_requests")
          .select("sustainability_score, diagnosis_result")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Polling error:", error);
          return;
        }

        if (data && data.sustainability_score !== null && data.diagnosis_result !== null) {
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setResultScore(data.sustainability_score);
          setResultDiagnosis(data.diagnosis_result);
          setPhase("result");
        }
      } catch (err) {
        console.error("Polling exception:", err);
      }
    }, 3000);
  }, []);

  const resetScanner = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = null;
    setPhase("input");
    setRecordId(null);
    setResultScore(null);
    setResultDiagnosis(null);
    setBrand("");
    setMaterial("");
    setGarmentType("");
    setQualitySlider([50]);
    setUrlDellaFotoCaricata("");
  };

  const submitToBackend = async (imageUrl: string) => {
    setPhase("uploading");

    try {
      // Insert into scanner_requests
      const { data: record, error } = await supabase
        .from("scanner_requests")
        .insert({ image_url: imageUrl, input_type: "image" })
        .select()
        .maybeSingle();

      if (error) {
        console.error("Errore Supabase:", error);
        toast.error(`DB Error: ${error.message} — ${error.details || ""}`, { duration: 10000 });
        setPhase("input");
        return;
      }

      if (!record) {
        toast.error("Errore: il record non è stato creato.", { duration: 10000 });
        setPhase("input");
        return;
      }

      // Call n8n webhook
      const webhookRes = await fetch("https://n8n.kreareweb.com/webhook/krea-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: { id: record.id, image_url: record.image_url },
        }),
      });

      if (!webhookRes.ok) {
        const text = await webhookRes.text();
        console.error("Webhook error:", webhookRes.status, text);
        toast.error(`Webhook fallito (${webhookRes.status})`, { duration: 10000 });
        setPhase("input");
        return;
      }

      // Switch to waiting phase and start polling
      setRecordId(record.id);
      setPhase("waiting");
      startPolling(record.id);
    } catch (err: any) {
      console.error("Errore:", err);
      toast.error(`Errore imprevisto: ${err?.message || String(err)}`, { duration: 10000 });
      setPhase("input");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhase("uploading");

    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${crypto.randomUUID()}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("scanner_uploads")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error(`Upload fallito: ${uploadError.message}`);
        setPhase("input");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("scanner_uploads")
        .getPublicUrl(filePath);

      await submitToBackend(urlData.publicUrl);
    } catch (err: any) {
      console.error("Errore:", err);
      toast.error(`Errore imprevisto: ${err?.message || String(err)}`, { duration: 10000 });
      setPhase("input");
    }
  };

  const handleManualSubmit = async () => {
    if (!urlDellaFotoCaricata) {
      toast.error("Per favore, carica un'immagine prima di analizzare");
      return;
    }
    await submitToBackend(urlDellaFotoCaricata);
  };

  // Score visual helpers
  const getScoreColor = (s: number) => {
    if (s >= 80) return { ring: "stroke-emerald-500", text: "text-emerald-600", label: "ECCELLENTE" };
    if (s >= 60) return { ring: "stroke-emerald-400", text: "text-emerald-500", label: "BUONO" };
    return { ring: "stroke-amber-500", text: "text-amber-600", label: "MIGLIORABILE" };
  };

  const pillars = [
    { title: "Recupero", icon: Waves, desc: "Reti & Plastica" },
    { title: "Rigenerazione", icon: TestTube, desc: "Filo Puro" },
    { title: "Creazione", icon: Scissors, desc: "Made in Italy" },
    { title: "Circolarità", icon: Repeat, desc: "Riuso Infinito" },
  ];

  return (
    <main className="bg-neutral-50 min-h-screen relative overflow-hidden font-sans">
      {/* TEXTURE BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

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
          }
        >
          {/* INTERFACCIA IPAD */}
          <div className="h-full w-full bg-neutral-50 relative flex flex-col overflow-hidden">
            {/* Header iPad */}
            <div className="h-12 shrink-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {phase === "input" && "SYSTEM READY"}
                {phase === "uploading" && "UPLOADING..."}
                {phase === "waiting" && "AI PROCESSING..."}
                {phase === "result" && "ANALYSIS COMPLETE"}
              </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative w-full h-full p-6 md:p-8 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {/* ─── STATE: INPUT ─── */}
                {phase === "input" && (
                  <motion.div
                    key="input-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-xl h-full flex flex-col"
                  >
                    <Tabs defaultValue="photo" className="w-full h-full flex flex-col">
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-white p-1 rounded-full shadow-sm border border-neutral-100 shrink-0">
                        <TabsTrigger
                          value="photo"
                          className="rounded-full text-xs py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all"
                        >
                          Carica Foto
                        </TabsTrigger>
                        <TabsTrigger
                          value="manual"
                          className="rounded-full text-xs py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all"
                        >
                          Manuale
                        </TabsTrigger>
                      </TabsList>

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
                                  <Label htmlFor="brand" className="text-[10px] uppercase text-neutral-400 mb-1 block">Brand</Label>
                                  <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Es. Gucci" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg" />
                                </div>
                                <div>
                                  <Label htmlFor="garment" className="text-[10px] uppercase text-neutral-400 mb-1 block">Tipo</Label>
                                  <Input id="garment" value={garmentType} onChange={(e) => setGarmentType(e.target.value)} placeholder="Es. Camicia" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg" />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="material" className="text-[10px] uppercase text-neutral-400 mb-1 block">Materiale</Label>
                                <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Es. 100% Cotone" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg" />
                              </div>
                              <div className="pt-2">
                                <div className="flex justify-between mb-2">
                                  <Label className="text-[10px] uppercase text-neutral-400">Qualità Percepita</Label>
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{qualitySlider[0]}%</span>
                                </div>
                                <Slider value={qualitySlider} onValueChange={setQualitySlider} max={100} step={1} />
                              </div>
                            </div>
                            <div onClick={handleManualSubmit} className="mt-4">
                              <HoverBorderGradient
                                containerClassName={cn("rounded-full w-full", !brand && "opacity-50 pointer-events-none")}
                                className="bg-[#e4ffec] text-emerald-950 w-full flex justify-center py-3 font-bold tracking-widest uppercase text-xs"
                              >
                                Avvia Analisi
                              </HoverBorderGradient>
                            </div>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </motion.div>
                )}

                {/* ─── STATE: UPLOADING / WAITING (Luxury Loading) ─── */}
                {(phase === "uploading" || phase === "waiting") && (
                  <motion.div
                    key="waiting-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center w-full h-full gap-10"
                  >
                    {/* Elegant circular spinner */}
                    <div className="relative w-28 h-28">
                      {/* Outer static ring */}
                      <div className="absolute inset-0 rounded-full border border-neutral-200" />
                      {/* Animated arc */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112">
                        <motion.circle
                          cx="56"
                          cy="56"
                          r="52"
                          fill="none"
                          strokeWidth="1.5"
                          stroke="url(#emerald-gradient)"
                          strokeLinecap="round"
                          strokeDasharray="326.73"
                          strokeDashoffset="245"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                          style={{ transformOrigin: "center" }}
                        />
                        <defs>
                          <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#34d399" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center gem icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Gem className="w-7 h-7 text-emerald-600/60" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Elegant text */}
                    <div className="text-center space-y-3 max-w-sm">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-serif text-xl md:text-2xl text-neutral-800 italic leading-snug"
                      >
                        {phase === "uploading"
                          ? "Preparazione dell'analisi..."
                          : "L'Intelligenza Artificiale sta analizzando il DNA del capo..."}
                      </motion.p>
                      {phase === "waiting" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-sans"
                        >
                          Analisi in corso
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ─── STATE: RESULT (Luxury Card) ─── */}
                {phase === "result" && resultScore !== null && (
                  <motion.div
                    key="result-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-lg h-full flex flex-col items-center justify-center"
                  >
                    <div className="bg-white w-full rounded-[2rem] p-8 md:p-10 text-center shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] border border-neutral-100 relative overflow-hidden">
                      {/* Subtle top accent line */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

                      {/* Score circle */}
                      <div className="relative w-36 h-36 mx-auto mb-6 mt-2">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                          {/* Background circle */}
                          <circle cx="72" cy="72" r="64" fill="none" strokeWidth="2" className="stroke-neutral-100" />
                          {/* Score arc */}
                          <motion.circle
                            cx="72"
                            cy="72"
                            r="64"
                            fill="none"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className={getScoreColor(resultScore).ring}
                            strokeDasharray={`${2 * Math.PI * 64}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - resultScore / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                          />
                        </svg>
                        {/* Number in center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className={cn("font-serif text-5xl md:text-6xl leading-none", getScoreColor(resultScore).text)}
                          >
                            {resultScore}
                          </motion.span>
                        </div>
                      </div>

                      {/* Label */}
                      <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-sans mb-1">
                        Sustainability Score
                      </p>
                      <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-6", getScoreColor(resultScore).text)}>
                        {getScoreColor(resultScore).label}
                      </p>

                      {/* Diagnosis text */}
                      {resultDiagnosis && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="mb-8"
                        >
                          <div className="w-8 h-px bg-neutral-200 mx-auto mb-5" />
                          <p className="font-serif text-sm md:text-base text-neutral-600 leading-relaxed max-w-sm mx-auto italic">
                            {resultDiagnosis}
                          </p>
                        </motion.div>
                      )}

                      {/* Separator */}
                      <div className="w-8 h-px bg-neutral-200 mx-auto mb-6" />

                      {/* Reset button */}
                      <button
                        onClick={resetScanner}
                        className="inline-flex items-center gap-2.5 border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-sans transition-all duration-300"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Scansiona un nuovo capo
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* SEZIONE 2: LINK A SOSTENIBILITÀ */}
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
                  <HoverBorderGradient containerClassName="rounded-full" className="bg-white text-emerald-950 flex items-center gap-2 font-medium">
                    <Gem className="w-4 h-4" />
                    APPROFONDISCI I PILASTRI
                  </HoverBorderGradient>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-7/12">
              <div className="bg-neutral-50/80 backdrop-blur-sm rounded-[2.5rem] p-10 border border-neutral-100 relative">
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
                      <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-sans font-bold">{pillar.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE 3: LINK A COLLEZIONI */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/NERO%20CLASSIC/NERO%20CLASSIC%20(6).png"
            alt="Fashion Collection"
            className="w-full h-full object-cover brightness-[0.6] transition-transform duration-[3s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-1 bg-emerald-400 mx-auto mb-8 rounded-full shadow-[0_0_10px_#34d399]" />
            <span className="text-emerald-200 tracking-[0.4em] uppercase text-xs font-bold mb-6 block">Shop The Look</span>
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
