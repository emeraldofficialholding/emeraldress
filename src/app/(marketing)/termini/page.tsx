import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Termini e Condizioni",
  description:
    "Condizioni generali di vendita e di utilizzo del sito Emeraldress: contratto, prezzi, spedizioni, recesso, garanzia e legge applicabile.",
  alternates: { canonical: "/termini" },
};

export default function TerminiPage() {
  return (
    <LegalLayout
      eyebrow="Legale"
      title="Termini e Condizioni"
      intro="Le presenti condizioni generali disciplinano l'uso del sito emeraldress.com e i contratti di vendita conclusi tra Emeraldress e i propri clienti."
      relatedLinks={[
        { to: "/", label: "Home", desc: "Torna al manifesto e all'esperienza Emeraldress.", eyebrow: "Inizio" },
        { to: "/privacy", label: "Privacy Policy", desc: "Trattamento dei dati personali secondo il GDPR.", eyebrow: "Legale" },
        { to: "/faq", label: "FAQ & Spedizioni", desc: "Tempi di consegna, pagamenti, taglie e cura dei capi.", eyebrow: "Supporto" },
        { to: "/resi", label: "Politica di Reso", desc: "Diritto di recesso entro 14 giorni e procedura completa.", eyebrow: "Supporto" },
      ]}
    >
      <h2>1. Informazioni generali</h2>
      <p>
        Il sito <strong>emeraldress.com</strong> è gestito da <strong>Emeraldress</strong>,
        attività operante esclusivamente online con riferimento territoriale in Olbia – Porto
        Cervo (Sardegna, Italia). Per qualsiasi comunicazione è possibile scrivere a{" "}
        <a href="mailto:emeraldresshop@gmail.com">emeraldresshop@gmail.com</a>.
      </p>

      <h2>2. Accettazione delle condizioni</h2>
      <p>
        L&apos;utilizzo del sito e l&apos;acquisto dei prodotti comportano l&apos;accettazione integrale delle
        presenti condizioni generali. Il cliente è invitato a leggerle attentamente prima di
        completare qualsiasi ordine. Emeraldress si riserva il diritto di modificare le presenti
        condizioni in qualsiasi momento; le modifiche saranno efficaci dal momento della loro
        pubblicazione sul sito.
      </p>

      <h2>3. Prodotti</h2>
      <p>
        I prodotti commercializzati da Emeraldress sono capi di abbigliamento appartenenti a
        collezioni in edizione limitata, realizzati con tessuti rigenerati di alta qualità. Le
        caratteristiche, i materiali e le immagini sono descritti nelle relative schede prodotto.
        Eventuali lievi differenze cromatiche tra le immagini visualizzate e il prodotto reale
        possono dipendere dalle impostazioni del dispositivo dell&apos;utente e non costituiscono
        difetto.
      </p>

      <h2>4. Disponibilità e prezzi</h2>
      <p>
        Tutti i prezzi sono espressi in <strong>Euro (€)</strong> e si intendono comprensivi di
        IVA, ove applicabile. Le spese di spedizione sono indicate separatamente in fase di
        checkout. La disponibilità dei prodotti viene aggiornata costantemente, ma Emeraldress non
        garantisce l&apos;effettiva disponibilità in tempo reale; in caso di indisponibilità
        sopravvenuta, il cliente sarà tempestivamente avvisato e l&apos;eventuale somma versata sarà
        integralmente rimborsata.
      </p>
      <p>
        Emeraldress si riserva il diritto di modificare i prezzi in qualsiasi momento; il prezzo
        applicato al singolo ordine è quello vigente al momento della conferma dell&apos;acquisto.
      </p>

      <h2>5. Conclusione del contratto</h2>
      <p>
        Il contratto di vendita si considera concluso quando Emeraldress conferma l&apos;ordine al
        cliente tramite email. La selezione della <strong>taglia</strong> è obbligatoria prima del
        completamento dell&apos;acquisto. Emeraldress si riserva il diritto di rifiutare ordini in caso
        di sospetta frode, irregolarità nei dati forniti o impossibilità di evasione.
      </p>

      <h2>6. Pagamenti</h2>
      <p>
        I pagamenti sono gestiti dal processore <strong>Stripe</strong> attraverso connessione
        sicura crittografata. Sono accettate le principali carte di credito e debito, oltre ai
        wallet digitali resi disponibili dal processore. Emeraldress non conserva in alcun modo i
        dati delle carte di pagamento.
      </p>

      <h2>7. Spedizione e consegna</h2>
      <p>
        Le condizioni di spedizione, i tempi di consegna e i costi sono dettagliati nella pagina{" "}
        <a href="/faq">FAQ &amp; Spedizioni</a>. Il rischio di perdita o danneggiamento dei
        prodotti si trasferisce al cliente nel momento in cui questi, o un terzo da lui designato,
        prende fisicamente possesso dei beni.
      </p>

      <h2>8. Diritto di recesso</h2>
      <p>
        Il cliente consumatore ha diritto di recedere dal contratto entro <strong>14 giorni</strong>{" "}
        dalla ricezione del prodotto, secondo le modalità descritte nella{" "}
        <a href="/resi">Politica di Reso</a>.
      </p>

      <h2>9. Garanzia legale di conformità</h2>
      <p>
        Tutti i prodotti venduti da Emeraldress sono coperti dalla <strong>garanzia legale di
        conformità</strong> di 24 mesi prevista dagli artt. 128 e seguenti del Codice del Consumo.
        In caso di difetto di conformità il cliente ha diritto al ripristino della conformità
        mediante riparazione o sostituzione, alla riduzione del prezzo o alla risoluzione del
        contratto, alle condizioni di legge.
      </p>

      <h2>10. Limitazione di responsabilità</h2>
      <p>
        Emeraldress non potrà essere ritenuta responsabile per disservizi, ritardi o danni
        derivanti da cause di forza maggiore, eventi imprevedibili o riconducibili a terzi (ad es.
        corrieri, fornitori di servizi di pagamento, infrastrutture tecnologiche). In ogni caso la
        responsabilità di Emeraldress è limitata al valore dell&apos;ordine effettuato.
      </p>

      <h2>11. Proprietà intellettuale</h2>
      <p>
        Tutti i contenuti del sito – inclusi marchi, loghi, immagini, testi, grafiche, video e
        layout – sono di proprietà esclusiva di Emeraldress o dei rispettivi titolari e sono
        protetti dalle norme in materia di proprietà intellettuale. È vietata qualsiasi
        riproduzione, distribuzione o utilizzo non autorizzato.
      </p>

      <h2>12. Tutela dei dati personali</h2>
      <p>
        Il trattamento dei dati personali avviene nel rispetto del Regolamento (UE) 2016/679
        (GDPR), come dettagliato nella <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>13. Legge applicabile e foro competente</h2>
      <p>
        I presenti termini e condizioni sono regolati dalla <strong>legge italiana</strong>. Per
        qualsiasi controversia che dovesse insorgere in relazione all&apos;interpretazione, esecuzione
        o risoluzione delle presenti condizioni, il foro competente è quello di{" "}
        <strong>Tempio Pausania</strong> (circondario di Olbia – Porto Cervo), salva
        l&apos;applicazione delle norme inderogabili di tutela del consumatore, che attribuiscono la
        competenza al foro del luogo di residenza o domicilio del consumatore stesso.
      </p>

      <h2>14. Risoluzione alternativa delle controversie</h2>
      <p>
        Ai sensi dell&apos;art. 14 del Reg. UE 524/2013, la Commissione Europea mette a disposizione
        dei consumatori una piattaforma per la risoluzione delle controversie online (ODR),
        accessibile all&apos;indirizzo{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <h2>15. Contatti</h2>
      <p>
        Per qualsiasi richiesta relativa alle presenti condizioni o ai propri ordini è possibile
        scrivere a <a href="mailto:emeraldresshop@gmail.com">emeraldresshop@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
