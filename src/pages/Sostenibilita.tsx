import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Dati delle slide (ne ho create 3 basandomi sull'esempio)
const slides = [
  {
    id: 1,
    percentage: "oltre 20%",
    title: "ENERGIA RISPARMIATA",
    verticalText: "Efficienza Energetica",
    description:
      "Oggi, grazie all'utilizzo di fonti rinnovabili ed energia autoprodotta, per realizzare 1 kg di tessuto utilizziamo quasi il 20% di energia in meno rispetto al 2012. Un risparmio energetico concreto, reso possibile dall'adozione di sistemi illuminanti di ultima generazione.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000", // Esempio: Luce artistica
  },
  {
    id: 2,
    percentage: "100%",
    title: "NYLON RIGENERATO",
    verticalText: "ECONYL® System",
    description:
      "Non usiamo petrolio vergine. Ogni filo dei nostri costumi proviene dal recupero di reti da pesca fantasma e scarti di tessuto pre-consumer. La qualità è identica, ma il pianeta ringrazia.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1000", // Esempio: Reti/Mare
  },
  {
    id: 3,
    percentage: "-40%",
    title: "EMISSIONI CO2",
    verticalText: "Carbon Footprint",
    description:
      "Grazie alla filiera corta interamente italiana e all'uso di materiali rigenerati, abbiamo abbattuto drasticamente l'impronta carbonica rispetto alla produzione di costumi sintetici tradizionali.",
    image: "https://images.unsplash.com/photo-1611273426761-53c8577a20fa?auto=format&fit=crop&q=80&w=1000", // Esempio: Foglia/Natura
  },
];

const Sostenibilita = () => {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-20 pb-10">
      <div className="container mx-auto px-4 h-full">
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="p-1">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center min-h-[600px]">
                    {/* COLONNA SINISTRA: Immagine + Testo Verticale */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="relative h-[400px] lg:h-[600px] w-full overflow-hidden group"
                    >
                      {/* Immagine */}
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Testo Verticale (Layout identico alla foto) */}
                      <div className="absolute top-0 left-0 h-full w-16 bg-white/90 backdrop-blur-sm flex items-center justify-center border-r border-emerald-100">
                        <span
                          className="text-emerald-900 font-serif tracking-widest uppercase text-sm whitespace-nowrap"
                          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
                        >
                          {slide.verticalText}
                        </span>
                      </div>
                    </motion.div>

                    {/* COLONNA DESTRA: Contenuto Testuale */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-center lg:text-left py-10 lg:py-0 px-6 lg:px-0"
                    >
                      {/* Percentuale Gigante (Stile Foto) */}
                      <h2 className="text-[5rem] md:text-[8rem] leading-none font-serif text-emerald-600 font-medium mb-4">
                        {slide.percentage}
                      </h2>

                      {/* Titolo */}
                      <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-neutral-900 mb-8">
                        {slide.title}
                      </h3>

                      {/* Separatore */}
                      <div className="w-24 h-1 bg-emerald-600 mx-auto lg:mx-0 mb-8"></div>

                      {/* Descrizione */}
                      <p className="text-neutral-600 font-sans text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Bottoni di Navigazione (Stile quadrato rosso/verde come in foto) */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
            <div className="pointer-events-auto">
              <CarouselPrevious className="relative left-0 md:-left-12 h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-none" />
            </div>
            <div className="pointer-events-auto">
              <CarouselNext className="relative right-0 md:-right-12 h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-none" />
            </div>
          </div>
        </Carousel>
      </div>
    </main>
  );
};

export default Sostenibilita;
