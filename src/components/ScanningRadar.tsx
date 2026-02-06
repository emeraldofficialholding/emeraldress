import { motion } from "framer-motion";

const ScanningRadar = () => (
  <div className="relative w-48 h-48 mx-auto my-8">
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
    {/* Middle ring */}
    <div className="absolute inset-6 rounded-full border border-primary/15" />
    {/* Inner ring */}
    <div className="absolute inset-12 rounded-full border border-primary/10" />
    {/* Center dot */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-primary/40" />
    </div>
    {/* Sweeping radar line */}
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
        style={{
          background: "linear-gradient(90deg, hsl(var(--primary)), transparent)",
        }}
      />
    </motion.div>
    {/* Pulse effect */}
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-primary/30"
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

export default ScanningRadar;
