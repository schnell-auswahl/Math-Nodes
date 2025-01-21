import { manualDrawFkt } from '../createGraph.js'; // Importiere die Funktion

export function _FunctionNode() {
  return class FunctionNode {
    constructor() {
      this.color = opNodesColor;
      this.bgcolor = bgColor2;
      this.inputError = false;
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
        rightSide: "", // Rechte Seite der Gleichung -> Wird von der Eingabe extrahiert
        uvName: "", // Name der unabhängigen Variablen -> Wird aus der Funktionsgleichung extrahiert
        paramsFromWidget: ["", "", "", ""], // Parameter als String für Widget-Eingabe
        paramNames: ["", "", "", ""], // Namen der Parameter (Platzhalter für bis zu 4 Parameter)
        paramValues: [0, 0, 0, 0], // Objekt, das die Werte der Parameter speichert
        evaluatedFormula: "", // Neu: Hinzufügen der Property für die ausgewertete Formel
        uvError: false, // Status für UV-Fehler
        completeEquationfromWidget: "",
        finalEquation: "",
        widgetVisible: true,
      };

      // Widget für die Eingabe der Funktionsgleichung
      this.code_widget = this.addWidget(
        "text", // Widgettyp (Textfeld)
        "Fkt:", // Keine Initialisierung für den Wert
        "", // Beschreibung für das Widget
        (v, canvas, node) => {
          // Callback-Funktion für Eingabeänderungen

          // Überprüfung der Eingabe:
          const functionRegex = /^[a-zA-Z]\([a-zA-Z]\)\s*=\s*[-+*/^()0-9a-zA-Z\s]*$/;

          // ^                - Start des Strings
          // [a-zA-Z]        - Ein Buchstabe (Funktionsname)
          // \(               - Öffnende Klammer
          // [a-zA-Z]         - Ein einzelner Buchstabe (unabhängige Variable)
          // \)               - Schließende Klammer
          // \s*              - Null oder mehr Leerzeichen
          // =                - Gleichheitszeichen
          // \s*              - Null oder mehr Leerzeichen
          // [-+*/^()0-9a-zA-Z\s]* - Null oder mehr der folgenden Zeichen:
          //                        - Mathematische Operatoren: +, -, *, /, ^
          //                        - Klammern: (, )
          //                        - Ziffern: 0-9
          //                        - Buchstaben: a-z, A-Z
          //                        - Leerzeichen
          // $                - Ende des Strings

          if (!functionRegex.test(v)) {
            console.error(
              "Ungültige Funktionsgleichung. Bitte geben Sie eine gültige Gleichung ein."
            );
            this.boxcolor = "red"; // Fehlerfarbmarkierung
            this.inputError = true; // Setze den Fehlerstatus auf "true"
            return;
          }
          this.inputError = false; // Setze den Fehlerstatus auf "false"
          this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg

          // Funktionsname und unabhängige Variable extrahieren
          let completeEquation = v;

          var splitted = v.split("(");
          node.properties["funcName"] = splitted[0]; // Funktionsname
          node.properties["uvName"] = splitted[1][0]; // Unabhängige Variable
          const formulaFromWidget = v.split("=")[1]; // Rechte Seite der Gleichung speichern
          node.properties.formula = formulaFromWidget
            .replace(/\^/g, "**") // Ersetzt Potenzierung
            .replace(/sin/g, "Math.sin") // Ersetzt Sinus
            .replace(/cos/g, "Math.cos") // Ersetzt Kosinus
            .replace(/tan/g, "Math.tan") // Ersetzt Tangens
            .replace(/sqrt/g, "Math.sqrt") // Ersetzt Quadratwurzel
            .replace(/log/g, "Math.log10") // Ersetzt Logarithmus zur Basis 10
            .replace(/ln/g, "Math.log") // Ersetzt natürlicher Logarithmus
            .replace(/abs/g, "Math.abs") // Ersetzt Absolutbetrag
            .replace(/\|([^|]+)\|/g, "Math.abs($1)") // Ersetzt |...| durch Math.abs(...)
            .replace(/exp/g, "Math.exp") // Ersetzt Exponentialfunktion
            .replace(/\bpi\b/gi, "Math.PI") // Ersetzt pi durch Math.PI (unabhängig von Groß-/Kleinschreibung)
            .replace(/\be\b/g, "Math.E"); // Ersetzt e durch Math.E (unabhängig von Groß-/Kleinschreibung)

          // Parameter erkennen

        //   const parameterRegex = /\b[a-df-hj-z]\b(?!\()/g; // Regex für alleinstehende Buchstaben außer 'e' und 'i', die nicht von '(' gefolgt werden
        //   const parameters = formulaFromWidget.match(parameterRegex);
        //   console.log(parameters);
        //   if (parameters) {
        //     this.properties.paramsFromWidget = parameters.filter(function(param) {
        //         return param !== this.properties.uvName;
        //     }.bind(this)); // bind stellt sicher, dass 'this' korrekt referenziert wird
        // } else {
        //     this.properties.paramsFromWidget = [];
        // }
        //   if (this.properties.paramsFromWidget && this.properties.paramsFromWidget.length > 4) {
        //     console.error(
        //       "Zu viele Parameter. Maximal 4 Parameter sind erlaubt."
        //     );
        //     this.boxcolor = "red"; // Fehlerfarbmarkierung
        //     this.inputError = true; // Setze den Fehlerstatus auf "true"
        //     return;
        //   }
          this.inputError = false; // Setze den Fehlerstatus auf "false"
          this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg
          this.properties.completeEquationfromWidget = completeEquation;
          //this.properties.paramsFromWidget = parameters
          // Starte den Render-Timer für 5000ms (5 Sekunden)
           
            manualDrawFkt(400);
           
        }
      );

      // Funktionsobjekt und alte Parameternamen zur Überprüfung
      this._func = null;
      this.oldParamNames = [];

      this.lastRenderedEquation = null; // Speichert die zuletzt gerenderte Gleichung
      this.renderedImage = null; // Speichert das gerenderte Bild
      this.offsetX = 30; // Verschiebung des Equation renderings
      this.offsetY = 3 * LiteGraph.NODE_SLOT_HEIGHT;

      // Titel und Beschreibung für den Knoten
      this.title = "Funktion";
      this.desc = "Compute formula"; // Beschreibung des Knotens
      this.minwidth = 160;
      this.size = [this.minwidth, 150]; // Größe des Knotens in Pixeln
      this.resizable = false;

      //this.color = "#4C7468"; //Titelfarbe
      //this.bgcolor = "#9FA8B4"; //Hintergrundfarbe
    }

    // Diese Methode fügt eine alte Gleichung an die neue Gleichung an, basierend auf der unabhängigen Variablen
    _combineOldAndNewEquations(oldEquation, newFormula, variableName) {
      // Wenn keine alte Gleichung vorhanden ist, gib die aktuelle Formel zurück
      if (oldEquation.length < 1) {
        return newFormula;
      }

      let resultString = ""; // Initialisiere den Ergebnisstring

      // Erstelle einen regulären Ausdruck, der das variableName nur dann findet,
      // wenn es nicht Teil eines anderen Wortes ist
      const regex = new RegExp(`\\b${variableName}\\b`, "g");

      // Ersetze alle Vorkommen von variableName basierend auf dem regulären Ausdruck
      resultString = newFormula.replace(regex, (match) => {
        // Prüfe, ob oldEquation nur die unabhängige Variable ist
        return oldEquation === variableName ? oldEquation : `(${oldEquation})`;
      });

      return resultString; // Rückgabe der neuen zusammengesetzten Gleichung
    }

    // Liefert den Titel des Knotens basierend auf der Funktionsgleichung
    getTitle() {
      // Wenn ein Fehler mit der UV aufgetreten ist, setze den Titel auf "Fehler mit UV"
      if (this.properties.uvError) {
        return "UV stimmt nicht";
      }

      // Wenn die Funktionsgleichung, UV und Funktionsname vorhanden sind
      if (
        this.properties["formula"] &&
        this.properties["uvName"] &&
        this.properties["funcName"]
      ) {
        // Setze den Titel entsprechend der vollständigen Funktionsbeschreibung

        return "Funktion " + this.properties.funcName;
        //return `${this.properties["funcName"]}(${this.properties["uvName"]}) = ${formulaForTitle}`;
        //return `${this.properties["leftSide"]} = ${this.properties["evaluatedFormula"]}`;
      } else {
        // Standardtitel, falls nicht alle Informationen vorhanden sind
        return "Funktion";
      }
    }

    // Zeichnet den Hintergrund und passt die Labels der Eingänge/Ausgänge dynamisch an
    onDrawForeground(ctx) {
      if (this.flags && this.flags.collapsed) {
        return; // Zeichne nichts, wenn die Node collapsed ist
      }
      var inputData = this.getInputData(0);
      //console.log(inputData)
      // Setze das Label des ersten Eingangs basierend auf der unabhängigen Variablen (UV)
      if (this.properties["uvName"] && inputData == null) {
        this.inputs[0].label = this.properties["uvName"];
      } else if (this.properties["uvName"] && inputData != null) {
        this.inputs[0].label = inputData["leftSide"];
      } else {
        this.inputs[0].label = "UV"; // Standardmäßig "UV", falls kein Name gesetzt ist
      }

      // Färbe den Eingang oder zeichne einen Kreis darum
      const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
      // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
      const inputPosX = labelInputPosX;
      const nodeWidth = this.size[0];
      const outputPosX = nodeWidth; // Rechter Rand der Node
      // Parameter für die Trichterform
      const width = labelWidth; // Breite der Basis (linke Seite)
      const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)

      const inputPosY = 0 * NODE_SLOT_HEIGHT + 14;

      ctx.beginPath();
      // Input Trichter
      ctx.moveTo(0, inputPosY - height / 2);
      ctx.lineTo(inputPosX, inputPosY - height / 2);
      ctx.arc(inputPosX, inputPosY, height / 2, 0, 2 * Math.PI);
      ctx.lineTo(inputPosX, inputPosY + height / 2);
      ctx.lineTo(0, inputPosY + height / 2);
      ctx.lineTo(0, inputPosY + height / 2);
      ctx.closePath();
      // Füllen des Trichters
      ctx.fillStyle = inLabelsColor;
      ctx.fill();

      //Output:
      // Berechnung der x-Position auf der rechten Seite der Node
      ctx.beginPath();

      // Ausgangstrichter spiegeln
      ctx.moveTo(outputPosX, inputPosY - height / 2); // Obere rechte Ecke
      ctx.lineTo(outputPosX - width, inputPosY - height / 2); // Nach links zur Basis
      ctx.arc(outputPosX - width, inputPosY, height / 2, 0, 2 * Math.PI, true);
      ctx.lineTo(outputPosX - width, inputPosY + height / 2); // Nach unten zur linken Unterkante
      ctx.lineTo(outputPosX, inputPosY + height / 2);
      // Nach rechts zur unteren rechten Ecke

      // Schließe den Pfad und fülle die Trichterform
      ctx.closePath();
      ctx.fillStyle = outLabelsColor;
      ctx.fill();

      // Setze die Labels der Parameter-Eingänge basierend auf den Parameternamen und Zeichne die Formen darum
      for (let i = 0; i < 4; i++) {
      //   if (this.properties.paramsFromWidget && this.properties.paramsFromWidget[i]) {
      //     this.inputs[i + 1].label = this.properties.paramsFromWidget[i];
      // } else 
      
      if (this.properties["paramNames"] && this.properties["paramNames"][i]) {
          this.inputs[i + 1].label = this.properties["paramNames"][i];
      } else { 
          this.inputs[i + 1].label = ""; // Standardmäßig leer
      }

        const inputPosY = (i + 1) * NODE_SLOT_HEIGHT + 14;

        ctx.beginPath();
        // Input Trichter
        ctx.moveTo(0, inputPosY - height / 2);
        ctx.lineTo(inputPosX, inputPosY - height / 2);
        ctx.arc(inputPosX, inputPosY, height / 2, 0, 2 * Math.PI);
        ctx.lineTo(inputPosX, inputPosY + height / 2);
        ctx.lineTo(0, inputPosY + height / 2);
        ctx.lineTo(0, inputPosY + height / 2);
        ctx.closePath();
        // Füllen des Trichters
        ctx.fillStyle = paramLabelsColor;
        ctx.fill();
      }

      let inputLabelmaxLength = 0;
      let currentInputLabelLength = 0;
      //let outputLabelmaxLength = 0;
      //let currentOutputLabelLength = 0;

      for (let i = 0; i < 5; i++) {
        // Berechne die Länge des aktuellen Labels
        if (!this.inputs[i].label) {
          currentInputLabelLength = 0;
        } else {
          currentInputLabelLength = this.inputs[i].label.length;
        }

        // Aktualisiere maxLength, falls das aktuelle Label länger ist
        if (currentInputLabelLength > inputLabelmaxLength) {
          inputLabelmaxLength = currentInputLabelLength;
        }
      }

      ////console.log("Maximale Länge der Labels:", inputLabelmaxLength);

      // Setze das Label des Ausgangs basierend auf der Funktionsgleichung
      if (
        this.properties["uvName"] &&
        this.properties["funcName"] &&
        this.getInputData(0)
      ) {
        this.outputs[0].label = this.properties["leftSide"];
      } else if (this.properties["uvName"] && this.properties["funcName"]) {
        this.outputs[0].label = `${this.properties["funcName"]}(${this.properties.uvName})`;
      }

      //latex rendering
      let equation = this.properties.completeEquationfromWidget;

      // Prüfen, ob die Gleichung sich geändert hat
      if (this.lastRenderedEquation !== equation) {
        this.lastRenderedEquation = equation;

        let latexEquation = "";
        if (equation) {
          latexEquation = convertToLatex(equation);

          // Gleichung rendern und Bild speichern

          this.renderedImage = renderWithMathJax(latexEquation, "white"); // Kein Canvas hier notwendig

          setTimeout(() => {
            this.Pause = true;
          }, 100);
        }
      }

      if (this.Pause == false) {
        return;
      }
      if (this.renderedImage) {
        if (
          this.renderedImage.width +
            2 * this.offsetX +
            2 * inputLabelmaxLength * 8 >
          this.minwidth
        ) {
          this.size[0] =
            this.renderedImage.width +
            2 * this.offsetX +
            2 * inputLabelmaxLength * 8;
        }
        if (
          this.renderedImage.height < 2 * this.offsetY &&
          this.properties.widgetVisible == false
        ) {
          this.size[1] = 2 * this.offsetY;
        } else if (this.renderedImage.height < 2 * this.offsetY) {
          this.size[1] = 2 * this.offsetY + NODE_SLOT_HEIGHT;
        } else {
          this.size[1] = this.renderedImage.height + this.offsetY;
        }

        // Zeichne das Bild mit skalierter Größe
        ctx.drawImage(
          this.renderedImage,
          this.offsetX + inputLabelmaxLength * 8,
          this.offsetY - (1 / 2) * this.renderedImage.height //zentrierung i der node
        );
        this.Pause == false;
      }
    }

    // Führt die Berechnung durch, wenn die Eingabedaten vorliegen
    onExecute() {
      if (this.properties.widgetVisible == false) {
        this.widgets = []; // Alle Widgets entfernen
      }

      this.inputs[0].color_off = "#000000";
      this.outputs[0].color_off = "#000000";

      if (this.getInputData(0)) {
        var inputData = this.getInputData(0);
        var uvValue = inputData["value"]; // Wert der unabhängigen Variablen (x)
        var leftSideFromInput = inputData["leftSide"]; // Neu: empfange die linke Seite der Gleichung
        var rightSideFromInput = inputData["rightSide"]; // Zusatzinformationen zur Gleichung
        var uvNameFromInput = inputData["uvName"]; // Name der unabhängigen Variablen

        this.inputs[0].color_off = "#000000";
        this.inputs[0].color_on = adjustColor(
          "#00FF00",
          "#FF0000",
          inputData["value"]
        );

        // Speichere die Hauptunabhängige Variable (x) und Zusatzinfos in den Eigenschaften
        //this.properties["x"] = uvValue ?? this.properties["x"];
        this.properties["rightSide"] =
          rightSideFromInput ?? this.properties["rightSide"];

        // Definiere die linke Seite der Gleichung als funcName(leftSide)
        if (this.properties["funcName"]) {
          this.properties[
            "leftSide"
          ] = `${this.properties["funcName"]}(${leftSideFromInput})`;
        }

        // Überprüfe, ob die angeschlossene UV mit der erwarteten UV übereinstimmt
        if (this.properties["uvName"] != uvNameFromInput) {
          this.boxcolor = "red"; // Markiere den Knoten rot, wenn ein Fehler vorliegt
          this.properties.uvError = true; // Setze den Fehlerstatus auf "true"
        } else {
          this.properties.uvError = false;

          // Verarbeite die Parameter, die von den Eingängen geliefert werden
          let paramNames = ["", "", "", ""];
          let paramValues = [0, 0, 0, 0];
          for (let i = 0; i < 4; i++) {
            const paramInput = this.getInputData(i + 1); // Hole die Daten vom jeweiligen Eingang
            this.inputs[i + 1].color_off = "#000000";

            if (paramInput !== null && paramInput !== undefined) {
              const paramName = paramInput["leftSide"]; // Name des Parameters
              const paramValue = paramInput["value"]; // Wert des Parameters

              //console.log(paramName);
              //console.log(paramValue);

              if (
                paramName &&
                paramValue !== null &&
                paramValue !== undefined
              ) {
                this.inputs[i + 1].color_on = adjustColor(
                  "#00FF00",
                  "#FF0000",
                  paramValue
                );


                paramNames[i] = paramName; // Speichere den Parameternamen
                this.properties["paramNames"] = paramNames;
                //console.log(paramNames);

                paramValues[i] = paramValue; // Speichere den Parameterwert
                // Speichere die Parameterwerte in den Eigenschaften des Knotens
                this.properties["paramValues"] = paramValues;
                //console.log(paramValues);
              }
            } else {
              //paramNames[i+1]=""; //Lösche den Parameternamen
              paramNames[i] = "";
              this.properties["paramNames"] = paramNames;
              paramValues[i] = 0;
              // Speichere die Parameterwerte in den Eigenschaften des Knotens
              this.properties["paramValues"] = paramValues;
            }
          }

          // Kopiere die originale Formel
          let evaluatedFormula = this.properties.formula;

          // Ersetze Parameter und UV in der Formel durch Werte oder Ausdrücke
          for (let i = 0; i < 4; i++) {
            //paramNames.forEach((paramName, index) => {
            //console.log(paramNames[i] +" Index "+ i)
            let escapedParamName = paramNames[i].replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            ); // Maskiere alle speziellen Zeichen

            if (paramNames[i].includes(this.properties["uvName"])) {
              let rightSideFromInput = this.getInputData(i + 1)["rightSide"];
              //console.log(this.title +"indes "+ i + "rightSidefrominput" + rightSideFromInput)

              evaluatedFormula = evaluatedFormula.replace(
                new RegExp(escapedParamName, "g"),
                "(" + rightSideFromInput + ")"
              );
              //console.log(this.title + "Formula: " + evaluatedFormula)
            } else if (paramNames[i]) {
              if (paramValues[i] > 0) {
                evaluatedFormula = evaluatedFormula.replace(
                  new RegExp("\\b" + escapedParamName + "\\b", "g"),
                  paramValues[i]
                );
              }
              // else if (paramValues[paramName] == 0) {
              //   evaluatedFormula = evaluatedFormula.replace(new RegExp(escapedParamName, 'g'), "");
              // }
              else {
                evaluatedFormula = evaluatedFormula.replace(
                  new RegExp("\\b" + escapedParamName + "\\b", "g"),
                  "(" + paramValues[i] + ")"
                );
              }
            }
          }

          // Speichere die ausgewertete Formel in der neuen Property
          this.properties["evaluatedFormula"] = evaluatedFormula;

          // Erstelle die neue zusammengesetzte Gleichung
          let finalEquation = this._combineOldAndNewEquations(
            this.properties["rightSide"],
            this.properties["evaluatedFormula"],
            this.properties["uvName"]
          );
          this.properties.finalEquation = finalEquation;

          try {
            // Erstelle die Funktion dynamisch, wenn sich die Formel oder Parameter geändert haben
            if (
              !this._func ||
              this._func_code !== finalEquation ||
              this.oldParamNames != paramNames
            ) {
              const funcBody = `return ${finalEquation};`; // Der Funktionskörper basiert auf der Formel
              this._func = new Function(this.properties["uvName"], funcBody); // Erstelle neue Funktion
              this.oldParamNames = paramNames; // Speichere die aktuellen Parameternamen
              this._func_code = finalEquation; // Speichere die aktuelle Formel
            }

            // Führe die Funktion aus und berechne das Ergebnis
            let paramValuesArray = paramNames.map((name) => paramValues[name]);
            let value = this._func(uvValue, ...paramValuesArray);

            // Setze das Ergebnis als Output des Knotens
            this.setOutputData(0, {
              uvValue: inputData["uvValue"],
              value: value,
              leftSide: this.properties["leftSide"],
              rightSide: finalEquation,
              uvName: this.properties.uvName,
              animationOn: inputData["animationOn"],
              evaluatedFormula: this.properties["evaluatedFormula"],
              toToolTip: () => {
                const uvName = this.properties.uvName;
                const leftSide = this.properties.leftSide;

                // RegExp für isolierte Vorkommen von uvName (z.B. x, aber nicht in xara oder 2*x)
                const uvRegex = new RegExp(`\\b${uvName}\\b`, "g");

                // Ersetzen der isolierten Vorkommen von uvName in leftSide
                const modifiedLeftSide = leftSide.replace(uvRegex, uvName);

                // Tooltip zusammensetzen
                const tooltip = `${modifiedLeftSide} = ${
                  Math.round(value * 10) / 10
                }`;
                return tooltip;
              },
            });

            // Färbe den Ausgang grün, wenn die Berechnung erfolgreich war und auch sonst kein Fehler Vorliegt
            if (this.inputError != true) {
              this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg
            }
           

            this.outputs[0].color_on = adjustColor("#00FF00", "#FF0000", value);
          } catch (err) {
            //console.error("Fehler in der Formel:", err); // Fehlerbehandlung bei Problemen mit der Formel
            this.boxcolor = "red"; // Fehlerfarbmarkierung
            //this.setOutputData(0, { uvValue: inputData["uvValue"], value: null, leftSide: this.properties["leftSide"], rightSide: finalEquation, uvName: this.properties.uvName });
          }
        }
      }
    }
  };
}
