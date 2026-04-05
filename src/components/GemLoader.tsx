const logoED = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg";

const GemLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative">
      <img
        src={logoED}
        alt="Emeraldress"
        className="w-14 h-14 object-contain animate-pulse"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <img
          src={logoED}
          alt=""
          className="w-14 h-14 object-contain opacity-0"
          style={{
            animation: "gem-shimmer 1.8s ease-in-out infinite",
          }}
        />
      </span>
    </div>
    <span className="text-muted-foreground text-sm tracking-widest uppercase font-sans">
      Caricamento…
    </span>
    <style>{`
      @keyframes gem-shimmer {
        0%   { opacity: 0; transform: scale(0.9); }
        50%  { opacity: 0.5; transform: scale(1.15); }
        100% { opacity: 0; transform: scale(0.9); }
      }
    `}</style>
  </div>
);

export default GemLoader;
