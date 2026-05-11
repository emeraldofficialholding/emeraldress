"use client";

import { useState } from "react";

interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  hoverSrc?: string;
}

const ImageFallback = ({ src, alt, className = "", hoverSrc }: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="font-serif text-muted-foreground text-sm tracking-widest">EMERALDRESS</span>
      </div>
    );
  }

  const currentSrc = isHovered && hoverSrc ? hoverSrc : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      onMouseEnter={() => hoverSrc && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      loading="lazy"
    />
  );
};

export default ImageFallback;
