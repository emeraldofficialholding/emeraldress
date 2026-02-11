import { useProducts } from "@/hooks/useProducts";
import ButterflyLoader from "./ButterflyLoader";
import ImageFallback from "./ImageFallback";
import FloatingButterflies from "./FloatingButterflies";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

const ClassicsSection = () => {
  const { data: products, isLoading } = useProducts("classics");

  return (
    <section className="py-24 bg-[#F9FAF9] relative overflow-hidden">
      {/* Sfondo Decorativo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(#059669 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      ></div>
      <div className="absolute -left-20 top-40 w-96 h-96 bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none" />

      <FloatingButterflies />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Colonna Sinistra (Intro) */}
          <div className="lg:col-span-3 lg:sticky lg:top-32 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block w-12 h-1 bg-emerald-500 mb-6 rounded-full" />
              <p className="text-xs tracking-[0.25em] uppercase text-emerald-700 font-bold font-sans mb-3">
                Senza tempo
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-6 leading-tight">
                I Classici <br /> <span className="italic text-emerald-600">Eterni</span>
              </h2>
              <p className="text-neutral-500 font-sans text-sm mb-8 leading-relaxed max-w-xs mx-auto lg:mx-0">
                Capi iconici che trascendono le stagioni. Realizzati per durare una vita e raccontare la tua storia.
              </p>

              <Link
                to="/collezioni"
                className="group inline-flex items-center gap-2 border-b border-neutral-900 pb-1 text-sm uppercase tracking-widest hover:text-emerald-700 hover:border-emerald-700 transition-all duration-300"
              >
                Scopri di più
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>
          </div>

          {/* Colonna Destra (Carousel) */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <ButterflyLoader />
              </div>
            ) : (
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {products?.map((product) => (
                    <CarouselItem key={product.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                      <Link to={`/product/${product.id}`} className="group block h-full">
                        <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 rounded-sm shadow-sm border border-neutral-100 transition-all duration-500 group-hover:shadow-xl group-hover:border-emerald-100">
                          {/* Immagini */}
                          <ImageFallback
                            src={product.images[0]}
                            hoverSrc={product.images[1]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />

                          {/* Badge "Shop" che appare all'hover */}
                          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white text-emerald-900 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Info Prodotto */}
                        <div className="text-center lg:text-left px-2">
                          <h3 className="font-serif text-lg text-neutral-900 group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                            <p className="text-emerald-600 font-sans text-sm font-medium">
                              €{Number(product.price).toFixed(2)}
                            </p>
                            <span className="w-1 h-1 rounded-full bg-neutral-300" />
                            <p className="text-neutral-400 text-xs uppercase tracking-wider">Classic</p>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Bottoni Navigazione Customizzati */}
                <div className="hidden lg:flex absolute -top-16 right-0 gap-2">
                  <CarouselPrevious className="static translate-y-0 border-neutral-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" />
                  <CarouselNext className="static translate-y-0 border-neutral-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" />
                </div>
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassicsSection;
