// Full HTML email templates — sent directly to n8n without wrapper

export const TEASER_LAUNCH_HTML = `<!DOCTYPE html>
<html lang="it" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>Emeraldress - Lancio Ufficiale</title>
  <style>
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .mobile-stack { display: block !important; width: 100% !important; padding-bottom: 20px !important; }
      .mobile-pad { padding: 20px 15px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, Helvetica, sans-serif;">

  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        
        <table role="presentation" class="email-container" width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#e4ffec; border-radius: 30px; overflow: hidden; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          
          <tr>
            <td class="mobile-pad" style="padding: 30px 40px 20px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <img src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-logo-esteso.png" alt="Emeraldress" width="150" style="display: block; border: 0; max-width: 150px; height: auto;">
                  </td>
                  <td align="right">
                    <span style="background-color: #ffffff; color: #064e3b; padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-left: 5px;">Exclusive</span>
                    <span style="background-color: #ffffff; color: #064e3b; padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-left: 5px;">Eco</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 20px;" class="mobile-pad">
              <div style="background-color: #a7f3d0; border-radius: 150px 150px 20px 20px; overflow: hidden; font-size: 0; line-height: 0;">
                <img src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-vision.webp" alt="Emeraldress Vision" width="520" style="display: block; width: 100%; max-width: 520px; height: auto; border: 0;">
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" class="mobile-pad" style="padding: 10px 40px 30px; color: #022c22;">
              <img src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-logo-touch-collection.svg" alt="Touch Collection" width="140" style="display: block; border: 0; max-width: 140px; margin: 0 auto 20px auto; height: auto;">

              <h1 style="margin: 0 0 15px 0; font-size: 34px; line-height: 1.1; font-weight: 800;">
                L'Attesa sta per<br>Terminare
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; font-weight: normal;">
                Tra esattamente una settimana sveleremo la nostra prima linea. Capi disegnati per chi cerca l'eccellenza, realizzati con materiali <strong style="color: #064e3b;">100% sostenibili</strong> e processi produttivi che rispettano l'ambiente.
              </p>
              <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6;">
                Un nuovo modo di concepire l'eleganza: consapevole, esclusiva e senza compromessi.
              </p>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td align="center" style="border-radius: 30px; background-color: #064e3b;">
                    <a href="#" style="font-size: 14px; font-weight: bold; font-family: Arial, sans-serif; color: #e4ffec; text-decoration: none; padding: 15px 30px; border: 1px solid #064e3b; border-radius: 30px; display: inline-block;">
                      Scopri l'Anteprima
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 40px;" class="mobile-pad">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                <tr>
                  <td style="padding: 30px 25px;">
                    
                    <h2 style="margin: 0 0 25px 0; font-size: 24px; color: #022c22; text-align: center; font-weight: 800;">I nostri Valori</h2>
                    
                    <div style="border-radius: 15px; margin-bottom: 30px; text-align: center;">
                      <img src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-socialdress-2.webp" alt="Dettaglio Capo" width="300" style="display: block; width: 100%; max-width: 300px; height: auto; border: 0; border-radius: 15px; margin: 0 auto;">
                    </div>

                    <div style="font-size: 13px; color: #064e3b; line-height: 1.6; text-align: left;">
                      
                      <p style="margin: 0 0 15px 0;">
                        <strong style="font-size: 14px; color: #022c22; display: block; margin-bottom: 3px; letter-spacing: 0.5px;">LA FIBRA</strong>
                        Il cuore di Emeraldress è un tessuto tecnico di nuova generazione: una fibra rigenerata creata a partire da materiali di scarto pre e post-consumo - come reti da pesca e scarti tessili.
                      </p>
                      
                      <p style="margin: 0 0 15px 0;">
                        <strong style="font-size: 14px; color: #022c22; display: block; margin-bottom: 3px; letter-spacing: 0.5px;">IL PROCESSO</strong>
                        I materiali di scarto vengono scomposti a livello molecolare e trasformati in nuovo filato. Questo processo di rigenerazione consente di ottenere un materiale chimicamente identico al nylon vergine.
                      </p>
                      
                      <p style="margin: 0 0 15px 0;">
                        <strong style="font-size: 14px; color: #022c22; display: block; margin-bottom: 3px; letter-spacing: 0.5px;">CIRCOLARITÀ</strong>
                        Tutto è prodotto in modo circolare e responsabile, riducendo drasticamente l'impatto ambientale rispetto alla produzione tradizionale, dando nuova vita a ciò che andrebbe distrutto.
                      </p>
                      
                      <p style="margin: 0 0 25px 0;">
                        <strong style="font-size: 14px; color: #022c22; display: block; margin-bottom: 3px; letter-spacing: 0.5px;">SECONDA PELLE</strong>
                        Una volta rigenerato, il filo crea un tessuto ad alta densità, straordinariamente morbido, traspirante e modellante, perfetto per dare vita a capi dal fitting impeccabile che si adattano come una seconda pelle.
                      </p>

                    </div>

                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 2px solid #e4ffec;">
                      <tr>
                        <td align="center" style="padding-top: 20px;">
                          <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #022c22;">Caratteristiche del Tessuto:</p>
                          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #064e3b; line-height: 1.8;">
                            BIELASTICO &nbsp;&bull;&nbsp; FIBRA RICICLATA &nbsp;&bull;&nbsp; MANTENIMENTO DELLA FORMA &nbsp;&bull;&nbsp; OTTIMA COPERTURA &nbsp;&bull;&nbsp; PERFETTA VESTIBILITÀ &nbsp;&bull;&nbsp; PROTEZIONE DAI RAGGI UV &nbsp;&bull;&nbsp; RESISTENTE AL CLORO &nbsp;&bull;&nbsp; RESISTENTE AL PILLING &nbsp;&bull;&nbsp; TRASPIRANTE
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" class="mobile-pad" style="padding: 10px 40px 40px; color: #022c22;">
              <h2 style="margin: 0 0 15px 0; font-size: 26px; line-height: 1.2; font-weight: bold;">
                Edizione Estremamente<br>Limitata
              </h2>
              <p style="margin: 0 0 25px 0; font-size: 14px;">
                La produzione etica richiede tempi lenti e curati. Per questo motivo, i capi della Touch Collection saranno disponibili in tiratura limitata.
              </p>
              
              <div style="background-color: #022c22; color: #e4ffec; border-radius: 20px; padding: 20px 10px; margin: 0 auto 25px auto; max-width: 380px; box-sizing: border-box;">
                <p style="margin: 0 0 15px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; opacity: 0.8;">Le vendite aprono tra:</p>
                
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
                  <tr>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold;">07</td>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; width: 5%;">:</td>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold;">00</td>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; width: 5%;">:</td>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold;">00</td>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: bold; width: 5%;">:</td>
                    <td align="center" style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold;">00</td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size: 9px; opacity: 0.7; padding-top: 5px;">GIORNI</td>
                    <td></td>
                    <td align="center" style="font-size: 9px; opacity: 0.7; padding-top: 5px;">ORE</td>
                    <td></td>
                    <td align="center" style="font-size: 9px; opacity: 0.7; padding-top: 5px;">MINUTI</td>
                    <td></td>
                    <td align="center" style="font-size: 9px; opacity: 0.7; padding-top: 5px;">SECONDI</td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 25px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; font-weight: bold;">
                L'acquisto sarà sbloccato solo allo scadere del timer.<br>Preparati prima del Sold-Out.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="width: 100%; max-width: 300px;">
                <tr>
                  <td align="center" style="border-radius: 30px; background-color: #064e3b;">
                    <a href="#" style="font-size: 14px; font-weight: bold; font-family: Arial, sans-serif; color: #e4ffec; text-decoration: none; padding: 15px 30px; border-radius: 30px; display: block;">
                      Salva l'Evento in Calendario
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 0;">
              <div style="margin-top: -25px; margin-bottom: -45px; position: relative; z-index: 1;">
                <img src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/bicchiere.png" alt="Brindisi" width="140" style="display: block; max-width: 140px; height: auto; border: 0; opacity: 0.95;">
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #ffffff; padding: 60px 40px 40px 40px; text-align: center; position: relative; z-index: 10;" class="mobile-pad">
              
              <img src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg" alt="ED" width="45" style="display: block; margin: 0 auto 15px auto; border: 0; max-width: 45px; height: auto;">
              
              <p style="margin: 0 0 25px 0; font-size: 14px; color: #047857; font-weight: bold;">Vestire con Consapevolezza.</p>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 0 12px;">
                    <a href="https://www.instagram.com/emeraldress_/" target="_blank" style="color: #064e3b; font-weight: bold; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Instagram</a>
                  </td>
                  <td style="padding: 0 12px;">
                    <a href="https://www.tiktok.com/@emeraldress_" target="_blank" style="color: #064e3b; font-weight: bold; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">TikTok</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 10px; line-height: 1.6; color: #6b7280;">
                Hai ricevuto questa email perché fai parte della community esclusiva Emeraldress.<br>
                Se non desideri più ricevere i nostri aggiornamenti, puoi <a href="#" style="color: #6b7280; text-decoration: underline;">disiscriverti qui</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/** Registry of full-HTML templates (bypass wrapper) */
export const FULL_HTML_TEMPLATES: Record<string, { subject: string; html: string }> = {
  teaser: {
    subject: "Qualcosa di straordinario sta per arrivare...",
    html: TEASER_LAUNCH_HTML,
  },
};
