export function _FunctionNode() {
  return (
    class FunctionNode {
      constructor() {
        // Füge den Hauptinput für die unabhängige Variable (UV) hinzu, Typ "object"
        this.addInput("UV", "object");
        
        // Füge den Output hinzu, der das Ergebnis liefert, Typ "object"
        this.addOutput("", "object");

        // Füge vier zusätzliche Eingänge für Parameter hinzu, Typ "object"
        for (let i = 0; i < 4; i++) {
          this.addInput("", "object"); // Eingänge ohne Label
        }

        // Initialisierung der Eigenschaften
        this.properties = {
          formula: "", // Die Funktionsgleichung als String für Widget-Eingabe
          glgl: "",
          glgr: "",    // Rechte Seite der Gleichung -> Wird von anderen Funktionen verwendet
          uvName: "",  // Name der unabhängigen Variable -> Wird über formeleingabe definitiert und mit Empfangener abgeglichen
          paramNames: ["", "", "", ""],  // Namen der Parameter (Platzhalter für bis zu 4 Parameter)
          paramValues: {}  // Objekt, das die Werte der Parameter speichert
        };

        // Widget für die Eingabe der Funktionsgleichung
        this.code_widget = this.addWidget(
          "text",               // Widgettyp (Textfeld)
          "",                   // Keine Initialisierung für den Wert
          "Funktionsgleichung",  // Beschreibung für das Widget
          (v, canvas, node) => { // Callback-Funktion für Eingabeänderungen
            // Funktionsname und unabhängige Variable extrahieren
            var splitted = v.split("(");
            node.properties["funcName"] = splitted[0]; // Funktionsname
            node.properties["uvName"] = splitted[1][0]; // Unabhängige Variable
            node.properties.formula = v.split("=")[1];  // Rechte Seite der Gleichung speichern
          }
        );

        // Funktionsobjekt und alte Parameternamen zur Überprüfung
        this._func = null;
        this.oldParamNames = [];

        // Titel und Beschreibung für den Knoten
        this.title = "Funktion";
        this.desc = "Compute formula"; // Beschreibung des Knotens
        this.size = [160, 150]; // Größe des Knotens in Pixeln
      }

      // Diese Methode fügt eine alte Gleichung an die neue Gleichung an, basierend auf der unabhängigen Variablen
      _insertString(oldString, formula, uvName){
        if(oldString.length < 1) { // Wenn keine alte Gleichung vorhanden ist, gib die aktuelle Formel zurück
          return formula;
        }
        var outputString = ""; // Initialisiere den Ergebnisstring
        var parts = formula.split(uvName); // Teile die Formel an den Positionen der unabhängigen Variablen
        for (let i=0; i < parts.length - 1; i++){
          // Füge die Teile der neuen Gleichung mit der alten an den Stellen der unabhängigen Variablen ein
          outputString = outputString + parts[i] + "(" + oldString + ")";
        }
        // Füge den letzten Teil der Formel hinzu
        outputString = outputString + parts[parts.length-1];
        return outputString; // Rückgabe der neuen zusammengesetzten Gleichung
      }

      // Liefert den Titel des Knotens basierend auf der Funktionsgleichung
      getTitle() {
        // Wenn die Funktionsgleichung, unabhängige Variable und Funktionsname vorhanden sind
        if(this.properties["formula"] && this.properties["uvName"] && this.properties["funcName"]){
          // Setze den Titel entsprechend der vollständigen Funktionsbeschreibung
          let title = this.properties["funcName"] + "(" + this.properties["uvName"] + ") = " + this.properties["formula"];
          return title;
        } else {
          // Standardtitel, falls nicht alle Informationen vorhanden sind
          return "Funktion";
        }
      }

      // Zeichnet den Hintergrund und passt die Labels der Eingänge/Ausgänge dynamisch an
      onDrawBackground() {
        // Setze das Label des ersten Eingangs basierend auf der unabhängigen Variablen (UV)
        if(this.properties["uvName"]){
          this.inputs[0].label = this.properties["uvName"];
        } else {
          this.inputs[0].label = "UV"; // Standardmäßig "UV", falls kein Name gesetzt ist
        }
        // Setze die Labels der Parameter-Eingänge basierend auf den Parameternamen
        for(let i=1; i<5; i++){
          this.inputs[i].label = this.properties["paramNames"][i];
        }
        // Setze das Label des Ausgangs basierend auf der Funktionsgleichung
        if(this.properties["uvName"] && this.properties["funcName"]){
          this.outputs[0].label = this.properties["funcName"] + "(" + this.properties["uvName"] + ")";
        }
      }

      // Führt die Berechnung durch, wenn die Eingabedaten vorliegen
      onExecute() {
        // Überprüfe, ob Daten im ersten Eingang vorhanden sind (für UV)
        if (this.getInputData(0)) {
          var inputData = this.getInputData(0);
          var x = inputData["value"]; // Wert der unabhängigen Variablen (x)
          var receivedGlgl = inputData["glgl"];  // Neu: empfange glgl
          var glgr = inputData["glgr"]; // Zusatzinformationen zur Gleichung
          var uvName = inputData["uvName"]; // Name der unabhängigen Variablen

          // Speichere die Hauptunabhängige Variable (x) und Zusatzinfos in den Eigenschaften
          if (x != null) {
            this.properties["x"] = x;
          } else {
            x = this.properties["x"];
          }

          if (glgr != null) {
            this.properties["glgr"] = glgr;
          } else {
            glgr = this.properties["glgr"];
          }

         // Definiere glgl als funcName(glgl)
          if (this.properties["funcName"]) { //Wenn funcName definiert ist, ist glg funcName(übergebener funcName)
            this.properties["glgl"] = `${this.properties["funcName"]}(${receivedGlgl})`;
          }





          // Überprüfe, ob eine falsche Variable angeschlossen ist (UV-Name stimmt nicht überein)
          if (this.properties["uvName"].length > 0 && this.properties["uvName"] != uvName){
            this.boxcolor = "red"; // Markiere den Knoten rot, wenn ein Fehler vorliegt
            // Erstelle eine neue Gleichung basierend auf der alten und gebe sie aus
            var newString = this._insertString(this.properties["glgr"], this.properties["formula"], this.properties["uvName"]);
            this.setOutputData(0, {value: null, glgl: this.properties["glgl"], glgr: newString, uvName: this.properties["uvName"]});
          } else {

            // Verarbeite die zusätzlichen Parameter, die von den Eingängen geliefert werden
            let paramNames = [];
            let paramValues = {};
            for (let i = 0; i < 4; i++) {
              const paramInput = this.getInputData(i + 1); // Hole die Daten vom jeweiligen Eingang
              if (paramInput) {
                const paramName = paramInput["glgl"];  // Name des Parameters
                const paramValue = paramInput["value"]; // Wert des Parameters

                if (paramName && paramValue !== undefined) {
                  paramNames.push(paramName);           // Speichere den Parameternamen
                  this.properties["paramNames"][i + 1] = paramName;
                  paramValues[paramName] = paramValue;  // Speichere den Parameterwert
                }
              }
            }

            // Speichere die Parameterwerte in den Eigenschaften des Knotens
            this.properties["paramValues"] = paramValues;

            // Dynamische Ausführung der Formel
            let formula = this.properties.formula;
            let newString = this._insertString(this.properties["glgr"], this.properties["formula"], this.properties["uvName"]);
            try {
              // Wenn die Funktion noch nicht definiert ist oder sich die Formel/Parameter geändert haben, erstelle die Funktion neu
              if (!this._func || this._func_code !== formula || this.oldParamNames != paramNames) {
                const funcBody = `return ${formula};`; // Der Funktionskörper basiert auf der Formel
                // Erstelle eine neue Funktion, die die unabhängige Variable und die Parameter verwendet
                this._func = new Function(this.properties["uvName"], ...paramNames, funcBody);
                this.oldParamNames = paramNames; // Speichere die aktuellen Parameternamen
                this._func_code = formula;      // Speichere die aktuelle Formel
              }

              // Führe die Funktion aus, indem die Werte von x und den Parametern übergeben werden
              let paramValuesArray = paramNames.map(name => paramValues[name]); // Werte der Parameter als Array
              let value = this._func(x, ...paramValuesArray); // Berechne den Funktionswert

              // Setze das Ergebnis als Output des Knotens
              this.setOutputData(0, { value: value, glgl: this.properties["glgl"], glgr: newString, uvName: this.properties.uvName });
              this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg
            } catch (err) {
              console.error("Fehler in der Formel:", err); // Fehlerbehandlung bei Problemen mit der Formel
              this.boxcolor = "red"; // Fehlerfarbmarkierung
              this.setOutputData(0, { value: null, glgl: this.properties["glgl"], glgr: newString, uvName: this.properties.uvName });
            }
          }
        }
      }
    }
  );
}