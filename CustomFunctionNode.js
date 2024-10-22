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
          funcName: "", 
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
            const formulaFromWidget = v.split("=")[1];  // Rechte Seite der Gleichung speichern
            node.properties.formula = formulaFromWidget
            .replace(/\^/g, "**")          // Ersetzt Potenzierung
            .replace(/sin/g, "Math.sin")   // Ersetzt Sinus
            .replace(/cos/g, "Math.cos")   // Ersetzt Kosinus
            .replace(/tan/g, "Math.tan")   // Ersetzt Tangens
            .replace(/sqrt/g, "Math.sqrt") // Ersetzt Quadratwurzel
            .replace(/log/g, "Math.log10") // Ersetzt Logarithmus zur Basis 10
            .replace(/ln/g, "Math.log")    // Ersetzt natürlicher Logarithmus
            .replace(/abs/g, "Math.abs")   // Ersetzt Absolutbetrag
            .replace(/\|([^|]+)\|/g, "Math.abs($1)") // Ersetzt |...| durch Math.abs(...)
            .replace(/exp/g, "Math.exp")  // Ersetzt Exponentialfunktion
            .replace(/\bpi\b/gi, "Math.PI") // Ersetzt pi durch Math.PI (unabhängig von Groß-/Kleinschreibung)
            .replace(/\be\b/g, "Math.E");   // Ersetzt e durch Math.E (unabhängig von Groß-/Kleinschreibung)
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

      // Hilfsfunktionen für Superscript und Subscript
      toSuperscript(text) {
        const superscriptMap = {
          '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
          '-': '⁻', '+': '⁺', '=': '⁼', '(': '⁽', ')': '⁾',
          'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 
          'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
          'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
        };
        
        return text.toString().split('').map(char => superscriptMap[char] || char).join('');
      }
      
      toSubscript(text) {
        const subscriptMap = {
          '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
          '-': '₋', '+': '₊', '=': '₌', '(': '₍', ')': '₎',
          'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
          'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
        };
        
        return text.toString().split('').map(char => subscriptMap[char] || char).join('');
      }

      toItalic(text) {
        const italicMap = {
          'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 
          'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 
          'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍',
          'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗',
          'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡',
          'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧'
        };
        
        return text.split('').map(char => italicMap[char] || char).join('');
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
        if (this.properties["evaluatedFormula"] && this.properties["uvName"] && this.properties["funcName"]) { // Setze den Titel entsprechend der vollständigen Funktionsbeschreibung
          
          let formulaForTitle = this.properties["evaluatedFormula"]
          .replace(/\s+/g, "")            // Entfernt alle Leerzeichen
          .replace(/\+/g, " + ")          // Fügt Leerzeichen um Pluszeichen ein
          .replace(/-/g, " - ")           // Fügt Leerzeichen um Minuszeichen ein
          .replace(/\*\*/g, "^")          // Ersetzt Potenzierung zurück
          .replace(/\*/g, " · ")              // setzt schönen Malpunkt mit Leerzeichen<- Wichtig: Muss nach Potenzersetzung kommen
          //.replace(/\//g," / ")         // Fügt Leerzeichen um / ein
          .replace(/Math\.sin/g, "sin") // Ersetzt Sinus zurück
          .replace(/Math\.cos/g, "cos") // Ersetzt Kosinus zurück
          .replace(/Math\.tan/g, "tan") // Ersetzt Tangens zurück
          .replace(/Math\.sqrt/g, "sqrt") // Ersetzt Quadratwurzel zurück
          .replace(/Math\.log10/g, "log") // Ersetzt Logarithmus zur Basis 10 zurück
          .replace(/Math\.log\b/g, "ln")  // Ersetzt natürlicher Logarithmus zurück
          .replace(/Math\.exp/g, "exp")   // Ersetzt Exponentialfunktion zurück
          .replace(/Math\.abs\(([^()]*|\((?:[^()]*|\([^()]*\))*\))\)/g, "|$1|") // Ersetzt Absolutbetrag und umschließt Inhalt mit |...| 
          .replace(/Math\.PI/g, "π")      // Ersetzt Math.PI durch das Symbol π
          .replace(/Math\.E/g, "e");      // Ersetzt Math.E durch das Symbol e
      
          // Erkennung und Umwandlung von Potenzierungen (x^(...)) und (x^2)
                
        // Erster Fall: Potenzierungen mit Klammern um den Exponenten
        formulaForTitle = formulaForTitle.replace(/(\(.+?\)|\w+)\^\(([^()]*|\((?:[^()]*|\([^()]*\))*\))\)/g, (match, base, exponent) => {
          return base + this.toSuperscript(exponent); // Verwende 'this.toSuperscript'
        });

        // Zweiter Fall: Potenzierungen ohne Klammern um den Exponenten
        formulaForTitle = formulaForTitle.replace(/(\(.+?\)|\w+)\^(\w+)/g, (match, base, exponent) => {
          return base + this.toSuperscript(exponent); // Verwende 'this.toSuperscript'
        });

        let titleForTitle = `${this.properties["funcName"]}(${this.properties["uvName"]}) = ${formulaForTitle}`;

        // Setze alle Buchstaben kursiv
        titleForTitle = this.toItalic(titleForTitle);
        titleForTitle = titleForTitle
        .replace(/𝑠𝑖𝑛/g,"sin")
        .replace(/𝑐𝑜𝑠/g,"cos")
        .replace(/𝑡𝑎𝑛/g,"tan")
        .replace(/𝑠𝑞𝑟𝑡/g,"sqrt")
        .replace(/𝑙𝑛/g,"ln")
        .replace(/𝑙𝑜𝑔/g,"log")
        .replace(/𝑒𝑥𝑝/g,"exp");    

                // Berechne die erforderliche Breite basierend auf der Titellänge
          const titleLength = titleForTitle.length;
          const minWidth = 160; // Standardbreite des Knotens
          const extraWidthPerChar = 8; // Zusätzliche Breite pro Zeichen über der Standardlänge

          // Berechne die neue Breite, wenn der Titel länger ist als 20 Zeichen
          const newWidth = titleLength > 20 ? minWidth + (titleLength - 20) * extraWidthPerChar : minWidth;
      
          // Setze die Knotengröße neu
          if (this.size[0] < newWidth){
            this.size = [newWidth, this.size[1]];
          }

          return titleForTitle;
          //return `${this.properties["funcName"]}(${this.properties["uvName"]}) = ${formulaForTitle}`;
          //return `${this.properties["leftSide"]} = ${this.properties["evaluatedFormula"]}`;
        } else {
          // Standardtitel, falls nicht alle Informationen vorhanden sind
          return "Funktion";
        }
      }

      // Zeichnet den Hintergrund und passt die Labels der Eingänge/Ausgänge dynamisch an
      onDrawBackground() {
        var inputData = this.getInputData(0);
        //console.log(inputData)
        // Setze das Label des ersten Eingangs basierend auf der unabhängigen Variablen (UV)
        if(this.properties["uvName"] && inputData == null){
          this.inputs[0].label = this.properties["uvName"];
        } else if(this.properties["uvName"] && inputData != null) {
          this.inputs[0].label = inputData["leftSide"]
        } else {
          this.inputs[0].label = "UV"; // Standardmäßig "UV", falls kein Name gesetzt ist
        }
        // Setze die Labels der Parameter-Eingänge basierend auf den Parameternamen
        for(let i=1; i<5; i++){
          this.inputs[i].label = this.properties["paramNames"][i];
        }
        // Setze das Label des Ausgangs basierend auf der Funktionsgleichung
        if(this.properties["uvName"] && this.properties["funcName"]){
          this.outputs[0].label = this.properties["leftSide"];
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
                  evaluatedFormula = evaluatedFormula.replace(new RegExp('\\b' + escapedParamName + '\\b', 'g'), paramValues[paramName]);
                } 
                // else if (paramValues[paramName] == 0) {
                //   evaluatedFormula = evaluatedFormula.replace(new RegExp(escapedParamName, 'g'), "");
                // }                 
                else {
                  evaluatedFormula = evaluatedFormula.replace(new RegExp('\\b' + escapedParamName + '\\b', 'g'),"(" + paramValues[paramName]+ ")");
                }
              }
            });

            // Speichere die ausgewertete Formel in der neuen Property
            this.properties["evaluatedFormula"] = evaluatedFormula;

            // Erstelle die neue zusammengesetzte Gleichung
            let finalEquation = this._combineOldAndNewEquations(this.properties["rightSide"], this.properties["evaluatedFormula"], this.properties["uvName"]);
            
            try {
              // Erstelle die Funktion dynamisch, wenn sich die Formel oder Parameter geändert haben
              if (!this._func || this._func_code !== finalEquation || this.oldParamNames != paramNames) {
                const funcBody = `return ${finalEquation};`; // Der Funktionskörper basiert auf der Formel
                this._func = new Function(this.properties["uvName"], funcBody); // Erstelle neue Funktion
                this.oldParamNames = paramNames; // Speichere die aktuellen Parameternamen
                this._func_code = finalEquation; // Speichere die aktuelle Formel
              }

              // Führe die Funktion aus und berechne das Ergebnis
              let paramValuesArray = paramNames.map(name => paramValues[name]);
              let value = this._func(uvValue, ...paramValuesArray);

              // Setze das Ergebnis als Output des Knotens
              this.setOutputData(0, {   uvValue: inputData["uvValue"],value: value, leftSide: this.properties["leftSide"], rightSide: finalEquation, uvName: this.properties.uvName, evaluatedFormula: this.properties["evaluatedFormula"] });
              this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg
            } catch (err) {
              console.error("Fehler in der Formel:", err); // Fehlerbehandlung bei Problemen mit der Formel
              this.boxcolor = "red"; // Fehlerfarbmarkierung
              this.setOutputData(0, { uvValue: inputData["uvValue"], value: null, leftSide: this.properties["leftSide"], rightSide: finalEquation, uvName: this.properties.uvName });
            }
          }
        }
      }
    }
  );
}