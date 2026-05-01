import LegalLayout from "./LegalLayout";

const Resi = () => {
  return (
    <LegalLayout
      eyebrow="Supporto"
      title="Politica di Reso"
      intro="Il diritto di recesso e la procedura per restituire un capo Emeraldress, nel pieno rispetto della normativa europea a tutela del consumatore."
      metaTitle="Politica di Reso | Emeraldress"
      metaDescription="Diritto di recesso entro 14 giorni, procedura di reso e modalità di rimborso per gli acquisti effettuati su Emeraldress."
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
        una comunicazione scritta all'indirizzo email{" "}
        <a href="mailto:emeraldresshop@gmail.com">emeraldresshop@gmail.com</a> indicando:
      </p>
      <ul>
        <li>numero d'ordine e data di acquisto;</li>
        <li>nome, cognome e indirizzo del cliente;</li>
        <li>prodotto/i che si intende restituire;</li>
        <li>IBAN per il rimborso (se differente dal metodo di pagamento originario).</li>
      </ul>
      <p>
        Riceverai una conferma con le istruzioni operative per la restituzione.
      </p>

      <h2>3. Condizioni per il reso</h2>
      <p>I prodotti restituiti devono:</p>
      <ul>
        <li>essere integri, non utilizzati, non lavati e non danneggiati;</li>
        <li>conservare tutte le etichette originali e il packaging interno;</li>
        <li>essere accompagnati dalla ricevuta o riferimento d'ordine.</li>
      </ul>
      <p>
        Per ragioni di igiene e sicurezza, non vengono accettati resi di capi che presentino segni
        d'uso, alterazioni, profumi, macchie o etichette rimosse.
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
        <strong>14 giorni</strong> utilizzando lo stesso metodo di pagamento usato per l'acquisto,
        salvo diverso accordo con il cliente. I tempi di accredito effettivo possono variare in
        base all'istituto bancario o al circuito di pagamento.
      </p>
      <p>
        Le spese di spedizione originarie verranno rimborsate solo in caso di reso integrale
        dell'ordine, e nei limiti previsti dalla normativa vigente.
      </p>

      <h2>6. Prodotti difettosi o non conformi</h2>
      <p>
        Qualora il prodotto ricevuto risultasse difettoso, danneggiato o non conforme all'ordine,
        ti preghiamo di contattarci entro <strong>7 giorni</strong> dalla consegna allegando foto
        del difetto. In questi casi le spese di restituzione e l'eventuale sostituzione sono
        interamente a carico di Emeraldress.
      </p>

      <h2>7. Esclusioni</h2>
      <p>
        Il diritto di recesso non si applica, ai sensi dell'art. 59 del Codice del Consumo, ai
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
};

export default Resi;
