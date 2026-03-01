import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  ChartNoAxesCombined,
  ImageIcon,
  X,
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import GemLoader from "@/components/GemLoader";

type ScannerPhase = "input" | "uploading" | "waiting" | "result";

const EmeraldScanner = () => {
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [perceivedQuality, setPerceivedQuality] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [phase, setPhase] = useState<ScannerPhase>("input");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [resultDiagnosis, setResultDiagnosis] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetScanner = () => {
    setPhase("input");
    setRecordId(null);
    setResultScore(null);
    setResultDiagnosis(null);
    setBrand("");
    setMaterial("");
    setGarmentType("");
    setPerceivedQuality("");
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    const hasFile = Boolean(selectedFile);
    const hasText = [brand, material, garmentType, perceivedQuality].some((value) => value.trim().length > 0);

    if (!hasFile && !hasText) {
      toast.error("Inserisci almeno una foto o compila i dettagli del capo");
      return;
    }

    setPhase("uploading");

    try {
      let imageUrl: string | null = null;

      // Step 1: Upload image only if selectedFile exists
      if (selectedFile) {
        const rawName = selectedFile.name.replace(/\.[^/.]+$/, "");
        const safeName = rawName
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase();
        const rawExt = selectedFile.name.split(".").pop() ?? "jpg";
        const safeExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const filePath = `${crypto.randomUUID()}-${safeName || "scanner-upload"}.${safeExt}`;

        const { error: uploadError } = await supabase.storage
          .from("scanner_uploads")
          .upload(filePath, selectedFile, {
            contentType: selectedFile.type || `image/${safeExt}`,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Errore durante il caricamento dell'immagine. Riprova.");
          setPhase("input");
          return;
        }

        const { data: urlData } = supabase.storage.from("scanner_uploads").getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      // Step 2: Compute text_content and input_type
      const hasImage = Boolean(imageUrl);
      const hasText = [brand, material, garmentType, perceivedQuality].some((v) => v.trim().length > 0);
      const textParts: string[] = [];
      if (brand.trim()) textParts.push(`Brand: ${brand.trim()}`);
      if (material.trim()) textParts.push(`Materiale: ${material.trim()}`);
      if (garmentType.trim()) textParts.push(`Tipo: ${garmentType.trim()}`);
      if (perceivedQuality.trim()) textParts.push(`Qualità: ${perceivedQuality.trim()}`);
      const textContent = textParts.length > 0 ? textParts.join(", ") : null;
      const inputType = hasImage && hasText ? "both" : hasImage ? "image" : "text";

      // Step 3: Insert with .select().single()
      console.log("Verifica Connessione: puntando a", import.meta.env.VITE_SUPABASE_URL);
      const { data, error } = await supabase
        .from("scanner_requests")
        .insert([
          {
            image_url: imageUrl,
            text_content: textContent,
            input_type: inputType,
            brand: brand.trim() || null,
            garment_type: garmentType.trim() || null,
            material: material.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Errore Supabase Insert:", error);
        toast.error("Errore DB: " + error.message);
        setPhase("input");
        return;
      }

      if (!data?.id) {
        console.error("Record ID mancante dopo insert", data);
        toast.error("Errore nel recupero dell'ID analisi. Riprova.");
        setPhase("input");
        return;
      }

      // Step 4: Call n8n webhook with enriched payload (synchronous)
      setRecordId(data.id);
      setPhase("waiting");

      const webhookPayload = {
        id: data.id,
        image_url: imageUrl || null,
        input_type: inputType,
        brand: brand.trim() || null,
        material: material.trim() || null,
        garment_type: garmentType.trim() || null,
      };

      console.log("Webhook payload:", webhookPayload);

      const webhookRes = await fetch("https://n8n.kreareweb.com/webhook/scanner-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });

      if (!webhookRes.ok) {
        console.error("Webhook error:", webhookRes.status);
        toast.error("Errore di comunicazione con l'AI. Riprova.");
        setPhase("input");
        return;
      }

      const aiResult = await webhookRes.json();
      console.log("Webhook response (sincrona):", aiResult);

      // Step 5: Update UI directly from webhook response
      const webhookScore = typeof aiResult.sustainability_score === 'number' ? aiResult.sustainability_score : null;
      const webhookDiagnosis = aiResult.diagnosis_result || null;

      if (webhookScore !== null && webhookScore > 0 && webhookDiagnosis) {
        setResultScore(webhookScore);
        setResultDiagnosis(webhookDiagnosis);
        setPhase("result");
        return;
      }

      // Fallback: read directly from Supabase if webhook data is incomplete
      console.warn("Webhook data incomplete, falling back to DB read...", { webhookScore, webhookDiagnosis });
      const { data: dbRow } = await supabase
        .from("scanner_requests")
        .select("sustainability_score, diagnosis_result")
        .eq("id", data.id)
        .single();

      console.log("DB fallback row:", dbRow);

      const dbScore = typeof dbRow?.sustainability_score === 'number' ? dbRow.sustainability_score : null;
      const dbDiagnosis = dbRow?.diagnosis_result || null;

      if (dbScore !== null && dbScore > 0) {
        setResultScore(dbScore);
        setResultDiagnosis(dbDiagnosis);
      } else {
        setResultScore(null);
        setResultDiagnosis(null);
      }
      setPhase("result");
    } catch (err: any) {
      console.error("Errore:", err);
      // Last resort: try reading from DB if we have a recordId
      if (recordId) {
        try {
          const { data: dbRow } = await supabase
            .from("scanner_requests")
            .select("sustainability_score, diagnosis_result")
            .eq("id", recordId)
            .single();
          if (dbRow?.sustainability_score && dbRow.sustainability_score > 0) {
            setResultScore(dbRow.sustainability_score);
            setResultDiagnosis(dbRow.diagnosis_result);
            setPhase("result");
            return;
          }
        } catch (_) { /* ignore */ }
      }
      toast.error("Si è verificato un errore imprevisto. Riprova.");
      setPhase("input");
    }
  };

  // ─── Safe diagnosis parser (bulletproof) ───
  const parseDiagnosis = (rawResult: any): string | null => {
    if (!rawResult) return null;
    // Already a clean string — use directly
    if (typeof rawResult === 'string') {
      const trimmed = rawResult.trim();
      if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
      // Try JSON parse in case it's a stringified object
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') return parsed;
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed.diagnosis || parsed.text || parsed.diagnosis_result || JSON.stringify(parsed);
        }
      } catch (_) {
        // Not JSON — it's a plain text string, use as-is
      }
      return trimmed;
    }
    // It's an object
    if (typeof rawResult === 'object' && rawResult !== null) {
      return rawResult.diagnosis || rawResult.text || rawResult.diagnosis_result || "Analisi completata.";
    }
    return null;
  };

  // Score visual helpers
  const getScoreLabel = (s: number) => {
    if (s >= 71) return { ring: "stroke-emerald-700", text: "text-emerald-800", label: "ECCELLENZA SOSTENIBILE", labelColor: "text-emerald-800" };
    if (s >= 26) return { ring: "stroke-emerald-400/50", text: "text-emerald-500/50", label: "SCELTA CONSAPEVOLE", labelColor: "text-emerald-500/50" };
    return { ring: "stroke-stone-500", text: "text-stone-600", label: "DA RIVALUTARE", labelColor: "text-stone-600" };
  };

  const pillars = [
    { title: "Recupero", icon: Waves, desc: "Reti & Plastica" },
    { title: "Rigenerazione", icon: TestTube, desc: "Filo Puro" },
    { title: "Creazione", icon: Scissors, desc: "Made in Italy" },
    { title: "Circolarità", icon: Repeat, desc: "Riuso Infinito" },
  ];

  return (
    <main className="bg-neutral-50 min-h-screen relative overflow-x-hidden font-sans" style={{ scrollBehavior: 'smooth' }}>
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
          <div className="h-full w-full bg-neutral-50 relative flex flex-col overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
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
            <div className="flex-1 relative w-full p-6 md:p-8 flex flex-col items-center justify-start overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              <AnimatePresence mode="wait">
                {/* ─── STATE: INPUT ─── */}
                {phase === "input" && (
                  <motion.div
                    key="input-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col"
                  >
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-8 flex flex-col h-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                        {/* LEFT: Drop Zone */}
                        <div
                          ref={dropZoneRef}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className="border-2 border-dashed border-neutral-200 bg-neutral-50/50 rounded-2xl flex flex-col items-center justify-center relative group hover:bg-white hover:border-emerald-300 transition-all duration-300 min-h-[200px]"
                        >
                          {previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                              <div className="relative">
                                <img
                                  src={previewUrl}
                                  alt="Anteprima immagine caricata"
                                  className="w-44 h-44 object-cover rounded-full border border-emerald-200 shadow-[0_10px_35px_-15px_rgba(5,150,105,0.65)]"
                                />
                                <button
                                  onClick={removeFile}
                                  className="absolute -top-2 -right-2 w-7 h-7 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-emerald-600" />
                              </div>
                              <h3 className="font-serif text-base text-neutral-900 mb-1">Carica Foto</h3>
                              <p className="text-[11px] text-neutral-400 font-sans mb-4">Trascina o seleziona un'immagine</p>
                              <label className="cursor-pointer relative z-10">
                                <span className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2 rounded-full text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-900/20 transform hover:-translate-y-0.5 font-sans">
                                  <ScanLine className="w-3 h-3" /> Seleziona File
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                              </label>
                            </>
                          )}
                        </div>

                        {/* RIGHT: Text Fields */}
                        <div className="flex flex-col justify-center space-y-4 font-sans">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="brand" className="text-[10px] uppercase text-neutral-400 mb-1 block tracking-wider font-sans">Brand</Label>
                              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Es. Gucci" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg font-sans" />
                            </div>
                            <div>
                              <Label htmlFor="garment" className="text-[10px] uppercase text-neutral-400 mb-1 block tracking-wider font-sans">Tipo Capo</Label>
                              <Input id="garment" value={garmentType} onChange={(e) => setGarmentType(e.target.value)} placeholder="Es. Camicia" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg font-sans" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="material" className="text-[10px] uppercase text-neutral-400 mb-1 block tracking-wider font-sans">Materiale</Label>
                            <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Es. 100% Cotone" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg font-sans" />
                          </div>
                          <div>
                            <Label htmlFor="quality" className="text-[10px] uppercase text-neutral-400 mb-1 block tracking-wider font-sans">Qualità Percepita</Label>
                            <Input id="quality" value={perceivedQuality} onChange={(e) => setPerceivedQuality(e.target.value)} placeholder="Es. Alta, Media, Bassa" className="h-10 text-sm bg-neutral-50 border-transparent focus:bg-white rounded-lg font-sans" />
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6" onClick={handleSubmit}>
                        <HoverBorderGradient
                          containerClassName="rounded-full w-full"
                           className="bg-[#e4ffec] text-emerald-950 w-full flex justify-center py-3.5 font-bold tracking-widest uppercase text-xs font-sans"
                        >
                          <ScanLine className="w-4 h-4 mr-2" />
                          Avvia Analisi
                        </HoverBorderGradient>
                      </div>
                    </div>
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
                    className="flex flex-col items-center justify-center w-full h-full gap-8"
                  >
                    <GemLoader />

                    <div className="text-center space-y-3 max-w-sm">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-serif text-xl md:text-2xl text-neutral-800 italic leading-snug"
                      >
                    {phase === "uploading"
                          ? "Preparazione dell'analisi..."
                          : "La nostra consulente tessile sta analizzando la fibra..."}
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
                {phase === "result" && (() => {
                  const score = resultScore;
                  const diagnosisText = parseDiagnosis(resultDiagnosis);
                  const isValid = score !== null && score > 0 && diagnosisText && diagnosisText.trim().length > 0;

                  if (!isValid) {
                    return (
                      <motion.div
                        key="result-fallback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md h-full flex flex-col items-center justify-center text-center px-6"
                      >
                        <div className="bg-white rounded-[2rem] p-10 md:p-14 border border-neutral-100 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.06)]">
                          <Gem className="w-10 h-10 text-emerald-300 mx-auto mb-6" />
                          <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed italic max-w-sm mx-auto">
                            L'analisi di questo capo richiede un livello di dettaglio superiore. Ti invitiamo a ricaricare l'immagine o a scansionare un nuovo articolo.
                          </p>
                          <div className="w-10 h-px bg-stone-200 mx-auto my-8" />
                          <button
                            onClick={resetScanner}
                            className="bg-neutral-900 text-white rounded-md px-8 py-3 font-serif uppercase text-sm tracking-wider transition-all hover:bg-stone-800"
                          >
                            Scansiona un nuovo capo
                          </button>
                        </div>
                      </motion.div>
                    );
                  }

                  const sc = getScoreLabel(score!);

                  return (
                    <motion.div
                      key="result-state"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full max-w-lg flex flex-col items-center justify-start py-4 pb-20"
                    >
                      <div className="bg-white w-full rounded-[2rem] p-8 md:p-10 text-center shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] border border-neutral-100 relative overflow-hidden">
                        {/* Subtle top accent */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

                        {/* Score circle */}
                        <div className="relative w-36 h-36 mx-auto mb-4 mt-2">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                            <circle cx="72" cy="72" r="64" fill="none" strokeWidth="1" className="stroke-neutral-100" />
                            <motion.circle
                              cx="72" cy="72" r="64" fill="none" strokeWidth="1.5" strokeLinecap="round"
                              className={sc.ring}
                              strokeDasharray={`${2 * Math.PI * 64}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - score! / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              className={cn("font-serif text-5xl font-light leading-none", sc.text)}
                            >
                              {score}
                            </motion.span>
                          </div>
                        </div>

                        {/* Dynamic label */}
                        <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-sans mb-1">
                          Sustainability Score
                        </p>
                        <p className={cn("text-xs uppercase tracking-[0.3em] font-sans mb-6", sc.labelColor)}>
                          {sc.label}
                        </p>

                        {/* Diagnosis text */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="mb-6 px-4 md:px-10"
                        >
                          <div className="w-8 h-px bg-stone-200 mx-auto mb-5" />
                          <p
                            className="font-serif text-sm md:text-base text-stone-800 text-center max-w-xs mx-auto"
                            style={{ lineHeight: 1.8, letterSpacing: '0.01em' }}
                          >
                            {diagnosisText}
                          </p>
                        </motion.div>

                        {/* ─── "Il Nostro Standard" Comparison ─── */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-100/50 mb-6"
                        >
                          <p className="font-serif italic text-base text-stone-700 mb-5">Il Nostro Standard</p>
                          
                          <div className="space-y-4">
                            {/* User score bar */}
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans w-24 text-right shrink-0">Il tuo capo</span>
                              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-stone-400 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
                                />
                              </div>
                              <span className="text-xs font-serif text-stone-600 w-12 text-left">{score}/100</span>
                            </div>
                            {/* Emeraldress bar */}
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-sans w-24 text-right shrink-0">Emeraldress</span>
                              <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-emerald-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
                                />
                              </div>
                              <span className="text-xs font-serif text-emerald-700 w-12 text-left">100/100</span>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-stone-500 font-sans mt-4 leading-relaxed tracking-wide">
                            Produzione Etica · Tessuti Rigenerati ECONYL® · Zero Sprechi
                          </p>

                          {/* Low-score educational note */}
                          {score! < 50 && (
                            <p className="text-[10px] text-stone-500 font-sans mt-4 italic leading-relaxed tracking-wide">
                              Scegliere fibre riciclate certificate Emeraldress riduce l'impatto ambientale fino al 78% rispetto ai tessuti vergini, garantendo traspirabilità assoluta e rispetto per la pelle.
                            </p>
                          )}
                        </motion.div>

                        {/* Reset button */}
                        <button
                          onClick={resetScanner}
                          className="bg-neutral-900 text-white rounded-md px-8 py-3 font-serif uppercase text-sm tracking-wider transition-all hover:bg-stone-800"
                        >
                          Scansiona un nuovo capo
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
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
