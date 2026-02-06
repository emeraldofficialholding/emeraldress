import { useProducts } from "@/hooks/useProducts";
import ButterflyLoader from "./ButterflyLoader";
import ImageFallback from "./ImageFallback";
import FloatingButterflies from "./FloatingButterflies";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ClassicsSection = () => {
  const { data: products, isLoading } = useProducts("classics");

  return (
    <section className="py-20 bg-accent relative">
      <FloatingButterflies />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-sans mb-2">Senza tempo</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">I Classici</h2>
              <Link
                to="/collezioni"
                className="inline-block border border-foreground px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-sans hover:bg-foreground hover:text-background transition-all duration-500"
              >
                Scopri di più
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-9">
            {isLoading ? (
              <ButterflyLoader />
            ) : (
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {products?.map((product) => (
                    <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <Link to={`/product/${product.id}`} className="group block">
                        <div className="aspect-[3/4] overflow-hidden bg-muted mb-3 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                          <ImageFallback
                            src={product.images[0]}
                            hoverSrc={product.images[1]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-serif text-sm">{product.name}</h3>
                        <p className="text-muted-foreground text-sm font-sans mt-1">€{Number(product.price).toFixed(2)}</p>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex -left-4" />
                <CarouselNext className="hidden lg:flex -right-4" />
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassicsSection;
