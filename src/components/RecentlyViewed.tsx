"use client";

import Link from "next/link";
import ImageFallback from "./ImageFallback";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface RecentlyViewedProps {
  excludeId?: string;
  title?: string;
  compact?: boolean;
  className?: string;
}

const RecentlyViewed = ({
  excludeId,
  title = "Visti di recente",
  compact = false,
  className,
}: RecentlyViewedProps) => {
  const { products } = useRecentlyViewed(excludeId);

  if (products.length === 0) return null;

  return (
    <section className={className ?? (compact ? "" : "mt-12 md:mt-16 pb-8")}>
      <h2
        className={
          compact
            ? "text-[10px] tracking-[0.3em] uppercase text-emerald-700/60 mb-3"
            : "font-serif text-lg md:text-xl tracking-wide mb-6"
        }
      >
        {title}
      </h2>

      <div className="-mx-4 sm:mx-0">
        <div
          className="flex gap-3 px-4 sm:px-0 overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:overflow-visible"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug ?? p.id}`}
              className={`group block shrink-0 snap-start ${
                compact ? "w-32" : "w-36 sm:w-auto"
              }`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted mb-2">
                <ImageFallback
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p
                className={
                  compact
                    ? "text-xs text-emerald-950 truncate"
                    : "font-serif text-xs md:text-sm truncate"
                }
              >
                {p.name}
              </p>
              <p className="text-muted-foreground text-xs font-sans mt-0.5">
                €{Number(p.price).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
