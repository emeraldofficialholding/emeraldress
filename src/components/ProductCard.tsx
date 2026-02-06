import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ImageFallback from "./ImageFallback";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-muted mb-3 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <ImageFallback
          src={product.images[0]}
          hoverSrc={product.images[1]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <h3 className="font-serif text-sm md:text-base">{product.name}</h3>
      <p className="text-muted-foreground text-sm font-sans mt-1">€{Number(product.price).toFixed(2)}</p>
    </Link>
  </motion.div>
);

export default ProductCard;
