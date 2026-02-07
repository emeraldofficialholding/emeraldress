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

type MarqueeBandProps = {
  children: React.ReactNode;
  direction?: "left" | "right";
  baseVelocity?: number;
};

function MarqueeBand({ children, direction = "left", baseVelocity = 0.5 }: MarqueeBandProps) {
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
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="overflow-hidden whitespace-nowrap flex flex-nowrap cursor-pointer"
      onMouseEnter={() => { isHovered.current = true; setHovered(true); }}
      onMouseLeave={() => { isHovered.current = false; setHovered(false); }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-4 flex-nowrap"
        style={{ x }}
        animate={{ scale: hovered ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="block">{children}</span>
        ))}
      </motion.div>
    </div>
  );
}

const TrustMarquee = () => (
  <section>
    <div className="bg-primary py-4">
      <MarqueeBand baseVelocity={0.5} direction="left">
        <span className="text-primary-foreground font-serif text-lg md:text-2xl tracking-widest">
          EMERALDRESS • MADE IN ITALY • LUSSO CONSAPEVOLE • FIBRA RIGENERATA •{" "}
        </span>
      </MarqueeBand>
    </div>
    <div className="bg-accent py-4">
      <MarqueeBand baseVelocity={0.5} direction="right">
        <span className="text-accent-foreground font-serif text-lg md:text-2xl tracking-widest">
          SOSTENIBILITÀ CERTIFICATA • ECONYL® TECHNOLOGY • SPEDIZIONI GREEN • OCEAN CLEANUP •{" "}
        </span>
      </MarqueeBand>
    </div>
  </section>
);

export default TrustMarquee;
