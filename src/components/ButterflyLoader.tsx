const ButterflyLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <svg
      className="animate-butterfly w-12 h-12 text-primary"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M32 16 C20 4, 4 12, 12 28 C16 36, 28 40, 32 32" />
      <path d="M32 16 C44 4, 60 12, 52 28 C48 36, 36 40, 32 32" />
      <path d="M32 32 C24 40, 12 52, 20 56 C28 60, 30 44, 32 40" />
      <path d="M32 32 C40 40, 52 52, 44 56 C36 60, 34 44, 32 40" />
      <line x1="32" y1="16" x2="32" y2="56" />
    </svg>
    <span className="text-muted-foreground text-sm tracking-widest uppercase font-sans">Caricamento…</span>
  </div>
);

export default ButterflyLoader;
