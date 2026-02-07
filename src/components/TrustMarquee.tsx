const items = ["MADE IN ITALY", "FIBRA RIGENERATA", "SOSTENIBILITÀ CERTIFICATA", "SPEDIZIONI GREEN"];
const TrustMarquee = () => {
  const text = items.join(" • ") + " • ";
  return <section className="border-y border-border overflow-hidden my-0 py-[35px]">
      <div className="flex whitespace-nowrap animate-marquee">
        {[0, 1].map(i => <span key={i} className="text-sm tracking-[0.3em] uppercase font-sans text-muted-foreground mr-0">
            {text}
          </span>)}
      </div>
    </section>;
};
export default TrustMarquee;