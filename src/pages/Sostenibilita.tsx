import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Dati aggiornati in 4 STEP (Recupero - Rigenerazione - Creazione - Circolarità)
const slides = [
  {
    id: 1,
    percentage: "0%",
    title: "RECUPERO",
    verticalText: "Dallo Scarto alla Risorsa",
    description:
      "Non attingiamo a nuove risorse fossili. Il nostro processo inizia dal recupero di materiali di scarto pre e post-consumo, come reti da pesca abbandonate nei mari e scarti tessili industriali, ripulendo l'ambiente mentre creiamo bellezza.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1000", // Reti/Mare
  },
  {
    id: 2,
    percentage: "100%",
    title: "RIGENERAZIONE",
    verticalText: "Nuova Vita alla Fibra",
    description:
      "Attraverso un processo di depolimerizzazione avanzato, i materiali recuperati vengono trasformati in un nuovo filato rigenerato. Il risultato è un tessuto chimicamente identico al nylon vergine, puro e performante, ma a impatto zero.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000", // Texture Fibra/Tecnologia
  },
  {
    id: 3,
    percentage: "ITALY",
    title: "CREAZIONE",
    verticalText: "Manifattura Etica",
    description:
      "La sostenibilità è anche umana. Ogni capo Emeraldress è confezionato esclusivamente in Italia da laboratori locali. Valorizziamo l'artigianalità sartoriale e garantiamo condizioni di lavoro etiche e controllate.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000", // Mani/Sartoria
  },
  {
    id: 4,
    percentage: "RE-USE",
    title: "CIRCOLARITÀ",
    verticalText: "Packaging di Valore",
    description:
      "Non crediamo nel 'usa e getta'. Il nostro packaging è una custodia di design pensata per essere riutilizzata per proteggere i tuoi capi o per i tuoi viaggi. Anche le dust bag sono realizzate in materiale riciclato, chiudendo il cerchio.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000", // Packaging/Scatola/Minimal
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

                      {/* Testo Verticale */}
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
                      {/* Dato Gigante */}
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

          {/* Bottoni di Navigazione Quadrati */}
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
