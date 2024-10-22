let tempStorage = new FormData();

export const add = async (ctx) => {
  const formData = await ctx.request.formData();
  const step = ctx.url.searchParams.get("step");

  for (const [key, value] of formData1.entries()) {
    tempStorage.append(key, value);
  }

  if (step === "one") {
    /*redirect to next step*/
  }
  if (step === "final") {
    const dataText = {
      name: tempStorage.get("name"),
    };

    /** for each image save in databank */
  }
};

/** 
neues
FUNCTION new()
 Formular mit Standard-Daten rendern
 RÜCKGABE Formular als HTML
END

neues erstellen
FUNCTION create(Request)
 Daten := Formulardaten aus Request
 Fehler := Formulardaten überprüfen
 WENN Fehler vorhanden DANN
 Formular mit Daten und Fehlermeldungen rendern
 RÜCKGABE Formular als HTML
 SONST
 Daten speichern
 RÜCKGABE Umleitung zu anderer Seite 1
 END
END

alte Werte anzeigen 
FUNCTION new(Request)
 Id aus URL ermitteln
 Daten laden
 WENN Daten vorhanden DANN
 Formular mit Daten rendern
 RÜCKGABE Formular als HTML
 SONST
 RÜCKGABE Fehlerseite 404
 ENDE
END

geønedrte Daten verarbeiten 
FUNCTION update(Request)
 Daten := Formulardaten aus Request
 Id aus Request ermitteln
 Fehler := Formulardaten überprüfen
 WENN Fehler vorhanden DANN
 Formular mit Daten und Fehlermeldungen rendern
 RÜCKGABE Formular als HTML
 SONST
 geänderte Daten speichern
 RÜCKGABE Umleitung zu anderer Seite
 END
END

--> Ist Formular und Id gültig? (CSFR-Token)
• Darf Nutzer_in Datensatz ändern/erzeugen?
• Fehler bei Aufereitung / Berechtigungen?
*/
