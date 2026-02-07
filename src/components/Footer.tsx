import { Link } from "react-router-dom";
const Footer = () => <footer className="bg-foreground text-background py-16 mt-20">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-serif text-lg tracking-[0.2em] mb-4">EMERALDRESS</h3>
          <p className="text-sm opacity-70 leading-relaxed font-sans">
            Timeless Elegance, Modern Sensuality.<br />
            Lusso consapevole dal cuore del Mediterraneo.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase font-sans font-medium mb-4 opacity-70">Navigazione</h4>
          <div className="flex flex-col gap-2">
            {[{
            to: "/collezioni",
            label: "Collezioni"
          }, {
            to: "/chisiamo",
            label: "Chi Siamo"
          }, {
            to: "/sostenibilita",
            label: "Sostenibilità"
          }, {
            to: "/emeraldscanner",
            label: "Emerald Scanner"
          }].map(l => <Link key={l.to} to={l.to} className="text-sm font-sans opacity-70 hover:opacity-100 transition-opacity">
                {l.label}
              </Link>)}
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase font-sans font-medium mb-4 opacity-70">Contatti</h4>
          <p className="text-sm opacity-70 font-sans leading-relaxed">
            info@emeraldress.it<br />
            Milano, Italia
          </p>
        </div>
      </div>
      <div className="border-t border-background/20 mt-12 pt-8 text-center">
        <p className="text-xs opacity-50 font-sans">© 2026 EMERALDRESS. Tutti i diritti riservati by @KREA</p>
      </div>
    </div>
  </footer>;
export default Footer;