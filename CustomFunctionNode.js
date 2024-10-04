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
          leftSide: "", // Linke Seite der Gleichung -> Wird dynamisch erzeugt
          rightSide: "",    // Rechte Seite der Gleichung -> Wird von der Eingabe extrahiert
          uvName: "",  // Name der unabhängigen Variablen -> Wird aus der Funktionsgleichung extrahiert
          paramNames: ["", "", "", ""],  // Namen der Parameter (Platzhalter für bis zu 4 Parameter)
          paramValues: {},  // Objekt, das die Werte der Parameter speichert
          evaluatedFormula: "",   // Neu: Hinzufügen der Property für die ausgewertete Formel
          uvError: false // Status für UV-Fehler
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
        //this.color = "#4C7468"; //Titelfarbe
        //this.bgcolor = "#9FA8B4"; //Hintergrundfarbe
      }

      // Diese Methode fügt eine alte Gleichung an die neue Gleichung an, basierend auf der unabhängigen Variablen
      _combineOldAndNewEquations(oldEquation, newFormula, variableName){
        // Wenn keine alte Gleichung vorhanden ist, gib die aktuelle Formel zurück
        if(oldEquation.length < 1) {
          return newFormula;
        }
       
        let resultString = ""; // Initialisiere den Ergebnisstring
        let formulaParts = newFormula.split(variableName); // Teile die Formel an den Positionen der unabhängigen Variablen
        for (let i=0; i < formulaParts.length - 1; i++){
          // Füge die Teile der neuen Gleichung mit der alten an den Stellen der unabhängigen Variablen ein
          if (oldEquation == variableName){
            resultString += formulaParts[i] + oldEquation;
          }
          else {
            resultString += formulaParts[i] + "(" + oldEquation + ")";
          }
        }
        // Füge den letzten Teil der Formel hinzu
        resultString += formulaParts[formulaParts.length-1];
        return resultString; // Rückgabe der neuen zusammengesetzten Gleichung
      }

      // Liefert den Titel des Knotens basierend auf der Funktionsgleichung
      getTitle() {
        // Wenn ein Fehler mit der UV aufgetreten ist, setze den Titel auf "Fehler mit UV"
        if (this.properties.uvError) {
          return "UV stimmt nicht";
        }
        
        // Wenn die Funktionsgleichung, UV und Funktionsname vorhanden sind
        if (this.properties["evaluatedFormula"] && this.properties["uvName"] && this.properties["funcName"]) {
          // Setze den Titel entsprechend der vollständigen Funktionsbeschreibung
          return `${this.properties["funcName"]}(${this.properties["uvName"]}) = ${this.properties["evaluatedFormula"]}`;
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
          var uvValue = inputData["value"]; // Wert der unabhängigen Variablen (x)
          var leftSideEquation = inputData["leftSide"];  // Neu: empfange die linke Seite der Gleichung
          var rightSideEquation = inputData["rightSide"]; // Zusatzinformationen zur Gleichung
          var uvNameFromInput = inputData["uvName"]; // Name der unabhängigen Variablen

          // Speichere die Hauptunabhängige Variable (x) und Zusatzinfos in den Eigenschaften
          this.properties["x"] = uvValue ?? this.properties["x"];
          this.properties["rightSide"] = rightSideEquation ?? this.properties["rightSide"];

          // Definiere die linke Seite der Gleichung als funcName(leftSide)
          if (this.properties["funcName"]) {
            this.properties["leftSide"] = `${this.properties["funcName"]}(${leftSideEquation})`;
          }

          // Überprüfe, ob die angeschlossene UV mit der erwarteten UV übereinstimmt
          if (this.properties["uvName"] != uvNameFromInput){
            this.boxcolor = "red"; // Markiere den Knoten rot, wenn ein Fehler vorliegt
            this.properties.uvError = true;  // Setze den Fehlerstatus auf "true"
          } else {
            this.properties.uvError = false;

            // Verarbeite die Parameter, die von den Eingängen geliefert werden
            let paramNames = [];
            let paramValues = {};
            for (let i = 0; i < 4; i++) {
              const paramInput = this.getInputData(i + 1); // Hole die Daten vom jeweiligen Eingang
              if (paramInput) {
                const paramName = paramInput["leftSide"];  // Name des Parameters
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
            
            // Kopiere die originale Formel
            let evaluatedFormula = this.properties.formula;

            // Ersetze Parameter und UV in der Formel durch Werte oder Ausdrücke
            paramNames.forEach((paramName, index) => {
              let escapedParamName = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // Maskiere alle speziellen Zeichen
              if (paramName.includes(this.properties["uvName"])) {
                let rightSideFromInput = this.getInputData(index + 1)["rightSide"];
                evaluatedFormula = evaluatedFormula.replace(new RegExp(escapedParamName, 'g'), "(" + rightSideFromInput + ")" );
              } else {
                if (paramValues[paramName] > 0) {
                  evaluatedFormula = evaluatedFormula.replace(new RegExp(escapedParamName, 'g'), paramValues[paramName]);
                } 
                // else if (paramValues[paramName] == 0) {
                //   evaluatedFormula = evaluatedFormula.replace(new RegExp(escapedParamName, 'g'), "");
                // }                 
                else {
                  evaluatedFormula = evaluatedFormula.replace(new RegExp(escapedParamName, 'g'),"(" + paramValues[paramName]+ ")");
                }

              }
            });

            // Speichere die ausgewertete Formel in der neuen Property
            this.properties["evaluatedFormula"] = evaluatedFormula;

            // Erstelle die neue zusammengesetzte Gleichung
            let finalEquation = this._combineOldAndNewEquations(this.properties["rightSide"], this.properties["evaluatedFormula"], this.properties["uvName"]);
            
            try {
              // Erstelle die Funktion dynamisch, wenn sich die Formel oder Parameter geändert haben
              if (!this._func || this._func_code !== evaluatedFormula || this.oldParamNames != paramNames) {
                const funcBody = `return ${evaluatedFormula};`; // Der Funktionskörper basiert auf der Formel
                this._func = new Function(this.properties["uvName"], funcBody); // Erstelle neue Funktion
                this.oldParamNames = paramNames; // Speichere die aktuellen Parameternamen
                this._func_code = evaluatedFormula; // Speichere die aktuelle Formel
              }

              // Führe die Funktion aus und berechne das Ergebnis
              let paramValuesArray = paramNames.map(name => paramValues[name]);
              let value = this._func(uvValue, ...paramValuesArray);

              // Setze das Ergebnis als Output des Knotens
              this.setOutputData(0, { value: value, leftSide: this.properties["leftSide"], rightSide: finalEquation, uvName: this.properties.uvName, evaluatedFormula: this.properties["evaluatedFormula"] });
              this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg
            } catch (err) {
              console.error("Fehler in der Formel:", err); // Fehlerbehandlung bei Problemen mit der Formel
              this.boxcolor = "red"; // Fehlerfarbmarkierung
              this.setOutputData(0, { value: null, leftSide: this.properties["leftSide"], rightSide: finalEquation, uvName: this.properties.uvName });
            }
          }
        }
      }
    }
  );
}