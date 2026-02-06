import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/supabaseCustom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Upload, Leaf } from "lucide-react";
import ScanningRadar from "@/components/ScanningRadar";

const EmeraldScanner = () => {
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [qualitySlider, setQualitySlider] = useState([50]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleManualSubmit = async () => {
    setAnalyzing(true);
    setScore(null);
    // Simulate scanning delay
    await new Promise((r) => setTimeout(r, 2500));
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
    toast.success(`Punteggio sostenibilità: ${mockScore}/100`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setAnalyzing(true);
    setScore(null);

    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("scanner_uploads")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Errore durante il caricamento.");
      setUploading(false);
      setAnalyzing(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("scanner_uploads").getPublicUrl(filePath);
    await new Promise((r) => setTimeout(r, 2500));
    const mockScore = Math.floor(Math.random() * 40) + 60;

    await supabase.from("scanner_requests").insert({
      image_url: urlData.publicUrl,
      input_type: "photo",
      sustainability_score: mockScore,
    });

    setUploading(false);
    setAnalyzing(false);
    setScore(mockScore);
    toast.success(`Punteggio sostenibilità: ${mockScore}/100`);
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Leaf className="w-10 h-10 text-primary mb-4" />
            <h1 className="font-serif text-3xl md:text-4xl mb-4">Emerald Scanner</h1>
            <p className="text-muted-foreground font-sans leading-relaxed mb-6">
              Analizza la sostenibilità del tuo capo. Carica una foto o inserisci manualmente le informazioni
              per ottenere un punteggio di sostenibilità basato su materiali, produzione e impatto ambientale.
            </p>
            <div className="aspect-video bg-accent rounded-sm overflow-hidden flex items-center justify-center">
              <span className="font-serif text-accent-foreground text-lg">Moda Consapevole</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="photo">Carica Foto</TabsTrigger>
                <TabsTrigger value="manual">Inserimento Manuale</TabsTrigger>
              </TabsList>

              <TabsContent value="photo" className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-sm p-12 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-sans mb-4">Trascina o carica un'immagine</p>
                  <label className="cursor-pointer">
                    <span className="inline-block border border-foreground px-4 py-2 text-xs tracking-widest uppercase font-sans hover:bg-foreground hover:text-background transition-all">
                      Scegli file
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                {uploading && <p className="text-sm text-muted-foreground">Caricamento in corso…</p>}
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brand" className="text-xs tracking-widest uppercase font-sans">Brand</Label>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Es. Stella McCartney" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="material" className="text-xs tracking-widest uppercase font-sans">Materiale</Label>
                    <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Es. Cotone organico" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="garment" className="text-xs tracking-widest uppercase font-sans">Tipo di capo</Label>
                    <Input id="garment" value={garmentType} onChange={(e) => setGarmentType(e.target.value)} placeholder="Es. Abito lungo" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs tracking-widest uppercase font-sans">Qualità percepita</Label>
                    <Slider value={qualitySlider} onValueChange={setQualitySlider} max={100} step={1} className="mt-3" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{qualitySlider[0]}%</p>
                  </div>
                </div>
                <Button
                  onClick={handleManualSubmit}
                  disabled={analyzing || !brand}
                  className="w-full"
                  size="lg"
                >
                  {analyzing ? "Analisi in corso…" : "Analizza Sostenibilità"}
                </Button>
              </TabsContent>
            </Tabs>

            {analyzing && <ScanningRadar />}

            {score !== null && !analyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-accent rounded-sm text-center"
              >
                <p className="text-xs tracking-widest uppercase font-sans text-muted-foreground mb-2">Punteggio Sostenibilità</p>
                <p className="font-serif text-5xl text-accent-foreground">{score}<span className="text-2xl">/100</span></p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default EmeraldScanner;
