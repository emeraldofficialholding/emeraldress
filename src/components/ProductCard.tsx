"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import ImageFallback from "./ImageFallback";
import FullscreenProductViewer from "./FullscreenProductViewer";
import type { Product } from "@/hooks/useProducts";
import { PriceTag } from "./PriceTag";

interface ProductCardProps {
  product: Product;
  index?: number;
  /** Lista completa per swipe orizzontale tra prodotti nel viewer. */
  siblings?: Product[];
}

const ProductCard = ({ product, index = 0, siblings }: ProductCardProps) => {
  const href = `/product/${product.slug ?? product.id}`;
  const [fullscreen, setFullscreen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Mobile (<lg): apri viewer fullscreen anziche' navigare subito.
    // Su desktop il click segue il <Link> normalmente.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      e.preventDefault();
      setFullscreen(true);
    }
  };

  const list = siblings && siblings.length > 0 ? siblings : [product];
  const initialIndex = Math.max(
    0,
    list.findIndex((p) => p.id === product.id),
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <Link href={href} onClick={handleClick} className="group block">
          <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-emerald-50/60 to-white mb-3 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
            <ImageFallback
              src={product.images?.[0]}
              hoverSrc={product.images?.[1]}
              alt={`${product.name} — Emeraldress abbigliamento sostenibile di lusso`}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <h3 className="font-serif text-sm md:text-base">{product.name}</h3>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            <PriceTag price={product.price} salePrice={product.sale_price} />
          </p>
        </Link>
      </motion.div>

      {fullscreen && (
        <FullscreenProductViewer
          products={list}
          initialIndex={initialIndex}
          onDismiss={() => setFullscreen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
