import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Pagina non trovata | Emeraldress</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <main className="flex min-h-[80vh] items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-emerald-600 mb-4">
            Errore 404
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-emerald-950 mb-6">
            Pagina non trovata
          </h1>
          <p className="font-sans text-emerald-900/70 leading-relaxed mb-10">
            La pagina che cerchi non esiste o è stata spostata. Torna alla home o esplora la nostra collezione.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-emerald-950 text-white font-sans text-xs tracking-[0.25em] uppercase hover:bg-emerald-800 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/collezioni"
              className="px-6 py-3 border border-emerald-950 text-emerald-950 font-sans text-xs tracking-[0.25em] uppercase hover:bg-[#e4ffec] transition-colors"
            >
              Collezioni
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
