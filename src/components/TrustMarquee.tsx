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
import logoED from "@/assets/logo-ed.png";

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

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const isHovered = useRef(false);
  const [hovered, setHovered] = useState(false);

  const directionFactor = useRef(direction === "right" ? -1 : 1);

  useAnimationFrame((_t, delta) => {
    if (isHovered.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

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
      className={cn("overflow-hidden whitespace-nowrap flex flex-nowrap cursor-pointer w-[110%] -ml-[5%]", className)}
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
    <section className="overflow-hidden bg-white relative border-b border-emerald-100/30 py-0">
      <div className="relative z-10">
        <MarqueeBand baseVelocity={0.8} direction="left" className="bg-[#e4ffec] border-y border-emerald-100/50">
          {/* Sostituito font-serif con font-sans e font-medium per una leggibilità perfetta in movimento */}
          <span className="text-emerald-950 font-sans font-medium text-base md:text-lg tracking-[0.15em] mx-4 flex items-center gap-8">
            SUSTAINABLE FASHION <img src={logoED} alt="" className="h-4 w-auto object-contain" />
            ECO LUXURY <img src={logoED} alt="" className="h-4 w-auto object-contain" />
            MADE IN ITALY <img src={logoED} alt="" className="h-4 w-auto object-contain" />
            ECOLOGICAL FABRICS <img src={logoED} alt="" className="h-4 w-auto object-contain" />
            LUSSO SOSTENIBILE <img src={logoED} alt="" className="h-4 w-auto object-contain" />
            COSTA SMERALDA STYLE <img src={logoED} alt="" className="h-4 w-auto object-contain" />
            ECO FRIENDLY <img src={logoED} alt="" className="h-4 w-auto object-contain" />
          </span>
        </MarqueeBand>
      </div>
    </section>
  );
};

export default TrustMarquee;
