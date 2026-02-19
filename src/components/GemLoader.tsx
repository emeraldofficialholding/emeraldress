const GemLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <svg
      className="w-12 h-12"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="shimmerGrad" x1="-100%" y1="0%" x2="200%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="transparent" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-2 0"
            to="2 0"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </linearGradient>
        <clipPath id="gemClip">
          <polygon points="32,4 58,22 50,58 14,58 6,22" />
        </clipPath>
      </defs>

      {/* Main gem shape */}
      <polygon
        points="32,4 58,22 50,58 14,58 6,22"
        fill="url(#gemGrad)"
        opacity="0.95"
      >
        <animate
          attributeName="opacity"
          values="0.85;1;0.85"
          dur="2s"
          repeatCount="indefinite"
        />
      </polygon>

      {/* Inner facets */}
      <line x1="32" y1="4" x2="6" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="32" y1="4" x2="58" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="32" y1="4" x2="32" y2="34" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      <line x1="6" y1="22" x2="32" y2="34" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
      <line x1="58" y1="22" x2="32" y2="34" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
      <line x1="6" y1="22" x2="14" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <line x1="58" y1="22" x2="50" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <line x1="32" y1="34" x2="14" y2="58" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
      <line x1="32" y1="34" x2="50" y2="58" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

      {/* Shimmer overlay */}
      <rect
        x="0" y="0" width="64" height="64"
        fill="url(#shimmerGrad)"
        clipPath="url(#gemClip)"
      />

      {/* Outline */}
      <polygon
        points="32,4 58,22 50,58 14,58 6,22"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
    </svg>
    <span className="text-muted-foreground text-sm tracking-widest uppercase font-sans">
      Caricamento…
    </span>
  </div>
);

export default GemLoader;
