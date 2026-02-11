"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "@/lib/utils";

type MarqueeBandProps = {
  children: React.ReactNode;
  direction?: "left" | "right";
  baseVelocity?: number;
  className?: string;
};

function MarqueeBand({ children, direction = "left", baseVelocity = 0.5, className }: MarqueeBandProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // Adjusted wrap logic for smoother infinite loop with longer text
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const isHovered = useRef(false);
  const [hovered, setHovered] = useState(false);

  const directionFactor = useRef(direction === "right" ? -1 : 1);

  useAnimationFrame((_t, delta) => {
    if (isHovered.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Invert direction based on scroll velocity
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className={cn("overflow-hidden whitespace-nowrap flex flex-nowrap cursor-pointer w-[110%] -ml-[5%]", className)} // Wider width to handle rotation without cutting off
      onMouseEnter={() => {
        isHovered.current = true;
        setHovered(true);
      }}
      onMouseLeave={() => {
        isHovered.current = false;
        setHovered(false);
      }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-8 flex-nowrap py-4"
        style={{ x }}
        animate={{ scale: hovered ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Render multiple times to ensure seamless loop on large screens */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="block">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const TrustMarquee = () => {
  return (
    <section className="py-20 overflow-hidden bg-white relative">
      {/* Prima Banda - Inclinata verso l'alto (Rotazione Negativa) */}
      <div className="relative z-10 rotate-[-2deg] origin-center my-4">
        <MarqueeBand
          baseVelocity={0.8}
          direction="left"
          className="bg-[#e4ffec] border-y border-emerald-100/50 shadow-sm"
        >
          <span className="text-emerald-950 font-serif text-xl md:text-3xl tracking-[0.15em] mx-4 flex items-center gap-8">
            EMERALDRESS <span className="text-emerald-400 text-sm">●</span>
            MADE IN ITALY <span className="text-emerald-400 text-sm">●</span>
            LUSSO CONSAPEVOLE <span className="text-emerald-400 text-sm">●</span>
            FIBRA RIGENERATA <span className="text-emerald-400 text-sm">●</span>
            SARTORIA DIGITALE <span className="text-emerald-400 text-sm">●</span>
            ZERO WASTE <span className="text-emerald-400 text-sm">●</span>
            ARTIGIANATO SARDO <span className="text-emerald-400 text-sm">●</span>
          </span>
        </MarqueeBand>
      </div>

      {/* Seconda Banda - Inclinata verso il basso (Rotazione Positiva) */}
      <div className="relative z-10 rotate-[2deg] origin-center -mt-8">
        <MarqueeBand
          baseVelocity={0.8}
          direction="right"
          className="bg-[#e4ffec] border-y border-emerald-100/50 shadow-sm"
        >
          <span className="text-emerald-950 font-serif text-xl md:text-3xl tracking-[0.15em] mx-4 flex items-center gap-8">
            SOSTENIBILITÀ CERTIFICATA <span className="text-emerald-400 text-sm">●</span>
            ECONYL® TECHNOLOGY <span className="text-emerald-400 text-sm">●</span>
            SPEDIZIONI GREEN <span className="text-emerald-400 text-sm">●</span>
            OCEAN CLEANUP <span className="text-emerald-400 text-sm">●</span>
            ECONOMIA CIRCOLARE <span className="text-emerald-400 text-sm">●</span>
            ETHICAL FASHION <span className="text-emerald-400 text-sm">●</span>
            TRASPARENZA TOTALE <span className="text-emerald-400 text-sm">●</span>
          </span>
        </MarqueeBand>
      </div>
    </section>
  );
};

export default TrustMarquee;
