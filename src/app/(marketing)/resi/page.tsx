import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Politica di Reso",
  description:
    "Diritto di recesso entro 14 giorni, procedura di reso e modalità di rimborso per gli acquisti effettuati su Emeraldress.",
  alternates: { canonical: "/resi" },
};

export default function ResiPage() {
  return (
    <LegalLayout
      eyebrow="Supporto"
      title="Politica di Reso"
      intro="Il diritto di recesso e la procedura per restituire un capo Emeraldress, nel pieno rispetto della normativa europea a tutela del consumatore."
      relatedLinks={[
        { to: "/", label: "Home", desc: "Torna al manifesto e all'esperienza Emeraldress.", eyebrow: "Inizio" },
        { to: "/faq", label: "FAQ & Spedizioni", desc: "Tempi di consegna, pagamenti, taglie e cura dei capi.", eyebrow: "Supporto" },
        { to: "/termini", label: "Termini e Condizioni", desc: "Condizioni generali di vendita e d'uso del sito.", eyebrow: "Legale" },
        { to: "/privacy", label: "Privacy Policy", desc: "Trattamento dei dati personali secondo il GDPR.", eyebrow: "Legale" },
      ]}
    >
      <h2>1. Diritto di recesso</h2>
      <p>
        Ai sensi degli articoli 52 e seguenti del D.Lgs. 206/2005 (Codice del Consumo), il cliente
        consumatore ha diritto di recedere dal contratto di acquisto, senza alcuna penalità e senza
        specificarne il motivo, entro <strong>14 giorni</strong> dalla data di ricezione del prodotto.
      </p>

      <h2>2. Come esercitare il recesso</h2>
      <p>
        Per esercitare il diritto di recesso è sufficiente inviare entro 14 giorni dalla consegna
        una comunicazione scritta all&apos;indirizzo email{" "}
        <a href="mailto:emeraldresshop@gmail.com">emeraldresshop@gmail.com</a> indicando:
      </p>
      <ul>
        <li>numero d&apos;ordine e data di acquisto;</li>
        <li>nome, cognome e indirizzo del cliente;</li>
        <li>prodotto/i che si intende restituire;</li>
        <li>IBAN per il rimborso (se differente dal metodo di pagamento originario).</li>
      </ul>
      <p>Riceverai una conferma con le istruzioni operative per la restituzione.</p>

      <h2>3. Condizioni per il reso</h2>
      <p>
        Per essere accettato, il capo restituito deve rispettare tre condizioni inderogabili:
      </p>
      <ul>
        <li><strong>mai indossato</strong> — il capo deve essere integro, non utilizzato e non lavato;</li>
        <li><strong>mai sporcato</strong> — assenza di macchie, profumi, trucco, deodorante o qualsiasi alterazione;</li>
        <li><strong>mai senza etichetta</strong> — il cartellino originale deve essere ancora attaccato e il packaging interno conservato.</li>
      </ul>
      <p>
        Il reso deve inoltre essere accompagnato dalla ricevuta o dal riferimento d&apos;ordine.
        Per ragioni di igiene e sicurezza, non vengono accettati resi di capi che presentino segni
        d&apos;uso, alterazioni, profumi, macchie o etichette rimosse.
      </p>

      <h2>4. Spese di restituzione</h2>
      <p>
        Le <strong>spese di spedizione</strong> per la restituzione del prodotto sono a carico del
        cliente. Consigliamo di affidarsi a un corriere tracciato: Emeraldress non è responsabile
        per pacchi smarriti, danneggiati o non consegnati durante il trasporto di reso.
      </p>

      <h2>5. Rimborso</h2>
      <p>
        Una volta ricevuto e verificato il prodotto, Emeraldress provvederà al rimborso entro{" "}
        <strong>14 giorni</strong> utilizzando lo stesso metodo di pagamento usato per l&apos;acquisto,
        salvo diverso accordo con il cliente. I tempi di accredito effettivo possono variare in
        base all&apos;istituto bancario o al circuito di pagamento.
      </p>
      <p>
        Le spese di spedizione originarie verranno rimborsate solo in caso di reso integrale
        dell&apos;ordine, e nei limiti previsti dalla normativa vigente.
      </p>

      <h2>6. Prodotti difettosi o non conformi</h2>
      <p>
        Qualora il prodotto ricevuto risultasse difettoso, danneggiato o non conforme all&apos;ordine,
        ti preghiamo di contattarci entro <strong>7 giorni</strong> dalla consegna allegando foto
        del difetto. In questi casi le spese di restituzione e l&apos;eventuale sostituzione sono
        interamente a carico di Emeraldress.
      </p>

      <h2>7. Esclusioni</h2>
      <p>
        Il diritto di recesso non si applica, ai sensi dell&apos;art. 59 del Codice del Consumo, ai
        prodotti realizzati su misura, personalizzati o sigillati per motivi igienici una volta
        aperti dal consumatore.
      </p>

      <h2>8. Contatti</h2>
      <p>
        Per qualsiasi richiesta relativa a un reso scrivi a{" "}
        <a href="mailto:emeraldresshop@gmail.com">emeraldresshop@gmail.com</a>. Il nostro team è a
        tua disposizione per assisterti in ogni fase della procedura.
      </p>
    </LegalLayout>
  );
}
