import { motion } from "framer-motion";

const butterflies = [
  { x: "10%", y: "20%", size: 40, duration: 18, delay: 0 },
  { x: "70%", y: "60%", size: 32, duration: 22, delay: 3 },
  { x: "85%", y: "15%", size: 28, duration: 20, delay: 6 },
  { x: "30%", y: "75%", size: 36, duration: 25, delay: 2 },
];

const FloatingButterflies = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {butterflies.map((b, i) => (
      <motion.svg
        key={i}
        className="absolute text-primary/10"
        style={{ left: b.x, top: b.y, width: b.size, height: b.size }}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        animate={{
          y: [0, -20, 10, -15, 0],
          x: [0, 15, -10, 8, 0],
          rotate: [0, 10, -8, 5, 0],
        }}
        transition={{
          duration: b.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: b.delay,
        }}
      >
        <path d="M32 16 C20 4, 4 12, 12 28 C16 36, 28 40, 32 32" />
        <path d="M32 16 C44 4, 60 12, 52 28 C48 36, 36 40, 32 32" />
        <path d="M32 32 C24 40, 12 52, 20 56 C28 60, 30 44, 32 40" />
        <path d="M32 32 C40 40, 52 52, 44 56 C36 60, 34 44, 32 40" />
        <line x1="32" y1="16" x2="32" y2="56" />
      </motion.svg>
    ))}
  </div>
);

export default FloatingButterflies;
