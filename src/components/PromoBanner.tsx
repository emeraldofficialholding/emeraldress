import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface PromoBannerData {
  is_active: boolean;
  text: string;
  link: string;
  bg_color: string;
  text_color: string;
}

export default function PromoBanner() {
  const [banner, setBanner] = useState<PromoBannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase
      .from("app_settings" as any)
      .select("promo_banner")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data && (data as any).promo_banner) {
          setBanner((data as any).promo_banner as PromoBannerData);
        }
      });
  }, []);

  if (!banner || !banner.is_active || !banner.text || dismissed) return null;

  const content = (
    <span className="text-sm font-medium tracking-wide">{banner.text}</span>
  );

  return (
    <div
      className="relative flex items-center justify-center px-4 py-2 text-center"
      style={{ backgroundColor: banner.bg_color, color: banner.text_color }}
    >
      {banner.link ? (
        <Link to={banner.link} className="hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Chiudi banner"
      >
        <X className="w-4 h-4" style={{ color: banner.text_color }} />
      </button>
    </div>
  );
}
