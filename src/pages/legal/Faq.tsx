import LegalLayout from "./LegalLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, Package, Globe2, Clock, CreditCard, Ruler } from "lucide-react";

const shippingHighlights = [
  { icon: Truck, title: "Spedizione Italia", desc: "3–5 giorni lavorativi con corriere espresso tracciato." },
  { icon: Globe2, title: "Spedizione UE", desc: "5–10 giorni lavorativi in tutta l'Unione Europea." },
  { icon: Package, title: "Packaging dedicato", desc: "Confezione riutilizzabile, in linea con la nostra filosofia." },
  { icon: Clock, title: "Tempi di evasione", desc: "Ordini gestiti entro 1–2 giorni lavorativi dal pagamento." },
];

const faqs = [
  {
    q: "Quali metodi di pagamento accettate?",
    a: "Accettiamo le principali carte di credito e debito (Visa, Mastercard, American Express), Apple Pay, Google Pay e altri metodi disponibili tramite il nostro processore Stripe. Tutti i pagamenti sono protetti e crittografati.",
  },
  {
    q: "Come faccio a scegliere la taglia corretta?",
    a: "Ogni capo è disponibile nelle taglie XS/S, S/M e M/L. La scelta della taglia è obbligatoria al momento dell'acquisto. Per qualsiasi dubbio sulla vestibilità puoi scriverci a emeraldresshop@gmail.com e ti consiglieremo personalmente.",
  },
  {
    q: "Quanto costa la spedizione?",
    a: "Le spese di spedizione vengono calcolate in fase di checkout in base alla destinazione. Spediamo in Italia e in tutta l'Unione Europea con corriere espresso tracciato.",
  },
  {
    q: "Quanto tempo impiega l'ordine ad arrivare?",
    a: "Gli ordini vengono evasi entro 1–2 giorni lavorativi dalla conferma del pagamento. La consegna avviene in 3–5 giorni lavorativi in Italia e in 5–10 giorni lavorativi nei Paesi UE.",
  },
  {
    q: "Posso modificare o annullare un ordine?",
    a: "Puoi richiedere modifiche o annullamento entro poche ore dall'acquisto, prima che l'ordine venga preparato per la spedizione. Scrivici il prima possibile a emeraldresshop@gmail.com indicando il numero d'ordine.",
  },
  {
    q: "Come traccio la mia spedizione?",
    a: "Una volta affidato il pacco al corriere riceverai via email il numero di tracking con cui potrai monitorare la consegna in tempo reale.",
  },
  {
    q: "Posso effettuare un reso?",
    a: "Sì. Hai 14 giorni dalla ricezione del prodotto per esercitare il diritto di recesso. Trovi tutte le indicazioni nella pagina Politica di Reso.",
  },
  {
    q: "I capi sono davvero realizzati con materiali sostenibili?",
    a: "Sì. Emeraldress utilizza fibre rigenerate ottenute da reti da pesca e scarti tessili pre e post-consumo, lavorate attraverso un processo di rigenerazione molecolare. Scopri di più nella sezione Sostenibilità.",
  },
  {
    q: "Come prendermi cura dei capi Emeraldress?",
    a: "Consigliamo lavaggio a mano in acqua fredda con detergente delicato, asciugatura all'aria e lontano da fonti di calore dirette. Evitare candeggina, asciugatrice e stiratura diretta sul tessuto.",
  },
];

const Faq = () => {
  return (
    <LegalLayout
      eyebrow="Supporto"
      title="FAQ & Spedizioni"
      intro="Tutto quello che devi sapere su ordini, spedizioni, pagamenti e cura dei nostri capi. Se non trovi la risposta che cerchi, il nostro team è a tua disposizione."
      metaTitle="FAQ & Spedizioni | Emeraldress"
      metaDescription="Tempi di consegna, metodi di pagamento, taglie e cura dei capi Emeraldress. Tutte le risposte ufficiali del nostro servizio clienti."
    >
      {/* Highlights spedizioni */}
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {shippingHighlights.map((item) => (
          <div
            key={item.title}
            className="border border-emerald-100 rounded-2xl p-5 bg-[#e4ffec]/30 hover:bg-[#e4ffec]/60 transition-colors"
          >
            <item.icon className="w-5 h-5 text-emerald-600 mb-3" strokeWidth={1.5} />
            <p className="font-serif text-emerald-950 text-lg mb-1">{item.title}</p>
            <p className="text-sm text-emerald-900/70 font-sans leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>Spedizioni</h2>
      <p>
        Emeraldress spedisce in tutta Italia e nei Paesi dell'Unione Europea tramite corrieri
        espresso tracciati. Gli ordini vengono evasi entro <strong>1–2 giorni lavorativi</strong>
        {" "}dalla conferma del pagamento; la consegna avviene generalmente in{" "}
        <strong>3–5 giorni lavorativi</strong> per l'Italia e in{" "}
        <strong>5–10 giorni lavorativi</strong> per gli altri Paesi UE.
      </p>
      <p>
        Le spese di spedizione vengono calcolate automaticamente in fase di checkout in base alla
        destinazione e al peso del collo. Una volta affidato il pacco al corriere, il cliente riceve
        via email un codice di tracciamento per monitorare lo stato della consegna.
      </p>
      <p>
        Eventuali ritardi dovuti a cause di forza maggiore, festività o disservizi del corriere non
        sono imputabili a Emeraldress.
      </p>

      <h2>Pagamenti</h2>
      <p>
        I pagamenti sono gestiti da <strong>Stripe</strong>, leader internazionale nei pagamenti
        online, con la massima sicurezza grazie al protocollo SSL e alla conformità PCI DSS.
        Accettiamo carte di credito e debito (Visa, Mastercard, American Express), Apple Pay,
        Google Pay e altri metodi resi disponibili dal processore.
      </p>
      <p>
        Emeraldress non conserva in alcun modo i dati delle carte di pagamento.
      </p>

      <h2>Taglie e vestibilità</h2>
      <p>
        I capi Emeraldress sono disponibili nelle taglie <strong>XS/S</strong>,{" "}
        <strong>S/M</strong> e <strong>M/L</strong>. La selezione della taglia è obbligatoria
        prima di completare l'acquisto. Grazie al tessuto bielastico ad alta densità, i capi si
        adattano al corpo come una seconda pelle, garantendo un fit impeccabile.
      </p>

      <h2>Domande frequenti</h2>
      <div className="not-prose mt-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-emerald-100">
              <AccordionTrigger className="text-left font-sans text-emerald-950 hover:text-emerald-700 hover:no-underline py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-emerald-900/75 font-sans leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <h2>Hai bisogno di assistenza?</h2>
      <p>
        Il nostro servizio clienti è disponibile per consulenze personalizzate, informazioni su
        ordini, taglie e materiali. Scrivici a{" "}
        <a href="mailto:emeraldresshop@gmail.com">emeraldresshop@gmail.com</a> e ti risponderemo
        entro 24 ore lavorative.
      </p>
    </LegalLayout>
  );
};

export default Faq;
