import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export interface RelatedLink {
  to: string;
  label: string;
  desc: string;
  eyebrow?: string;
}

interface RelatedLinksProps {
  title?: string;
  intro?: string;
  links: RelatedLink[];
  variant?: "light" | "mint";
}

const RelatedLinks = ({
  title = "Continua a esplorare",
  intro,
  links,
  variant = "light",
}: RelatedLinksProps) => {
  const bg = variant === "mint" ? "bg-[#e4ffec]" : "bg-white";
  return (
    <section
      aria-label="Link correlati"
      className={`${bg} border-t border-emerald-100/60 py-20 md:py-28`}
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="text-[11px] tracking-[0.35em] uppercase font-bold text-emerald-600 mb-4 font-sans">
            Esplora
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 leading-tight">
            {title}
          </h2>
          {intro && (
            <p className="mt-5 text-emerald-900/70 font-sans text-base md:text-lg leading-relaxed">
              {intro}
            </p>
          )}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-emerald-100/70 border border-emerald-100/70">
          {links.map((link) => (
            <li key={link.to} className={`${bg}`}>
              <Link
                to={link.to}
                className="group flex flex-col h-full p-6 md:p-8 transition-colors hover:bg-emerald-50/60"
              >
                {link.eyebrow && (
                  <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-600/80 font-sans mb-3">
                    {link.eyebrow}
                  </span>
                )}
                <span className="font-serif text-2xl text-emerald-950 mb-3 flex items-start justify-between gap-3">
                  {link.label}
                  <ArrowUpRight className="w-4 h-4 text-emerald-700 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="text-[0.85em] text-emerald-900/70 font-['Alice'] leading-relaxed">
                  {link.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RelatedLinks;