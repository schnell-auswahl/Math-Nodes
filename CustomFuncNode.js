function _FunctionNode() {
    return (
      class FunctionNode {
        constructor() {
          // Hauptinput und Ausgabe
          this.addInput("in", "object");
          this.addOutput("", "object");
  
          // Zusätzliche Eingänge für Parameter (4 Eingänge)
          for (let i = 0; i < 4; i++) {
            this.addInput("param" + (i + 1), "object");
          }
  
          // Initiale Eigenschaften
          this.properties = {
            x: 1.0,
            formula: "x**2", // Initiale Formel
            str: "x",
            uvName: "",
            paramNames: [],  // Speichert die Parameternamen (a, b, ...)
            paramValues: {}  // Speichert die Parameterwerte
          };
  
          // Widget für die Formeleingabe
          this.code_widget = this.addWidget(
            "text",
            "",
            "Funktionsgleichung",
            (v, canvas, node) => {
              var splitted = v.split("(");
              node.properties["funcName"] = splitted[0];
              node.properties["uvName"] = splitted[1][0];
              node.properties.formula = v.split("=")[1]; // Speichert die Formel
            }
          );
  
          this._func = null;
  
          this.title = "Func";
          this.desc = "Compute formula";
          this.size = [160, 100];
        }
  
        onExecute() {
          if (this.getInputData(0)) {
            var inputData = this.getInputData(0);
            var x = inputData["value"];
            var str = inputData["str"];
            var uvName = inputData["uvName"];
  
            // Speichern der Hauptvariablen
            if (x != null) {
              this.properties["x"] = x;
            } else {
              x = this.properties["x"];
            }
  
            if (str != null) {
              this.properties["str"] = str;
            } else {
              str = this.properties["str"];
            }
  
            // Zusätzliche Parameter von den Eingängen holen
            let paramNames = [];
            let paramValues = {};
            for (let i = 0; i < 4; i++) {
              const paramInput = this.getInputData(i + 1); // Daten vom jeweiligen Parametereingang holen
              if (paramInput) {
                const paramName = paramInput["str"];  // Parametername aus dem Eingang
                const paramValue = paramInput["value"]; // Wert des Parameters
  
                if (paramName && paramValue !== undefined) {
                  paramNames.push(paramName);           // Parameternamen speichern
                  paramValues[paramName] = paramValue;  // Wert dem Parameternamen zuordnen
                }
              }
            }
  
            this.properties["paramNames"] = paramNames;
            this.properties["paramValues"] = paramValues;
  
            // Dynamische Formel mit Parametern ausführen
            let formula = this.properties.formula;
            try {
              // Erstellen der Funktionsdefinition mit dynamischen Parametern
              if (!this._func || this._func_code !== formula) {
                const funcBody = `return ${formula};`;
                this._func = new Function("x", "TIME", ...paramNames, funcBody);
                this._func_code = formula;
              }
  
              // Funktionsausführung: x, globale Zeit und zusätzliche Parameter übergeben
              let paramValuesArray = paramNames.map(name => paramValues[name]);
              let value = this._func(x, this.graph.globaltime, ...paramValuesArray);
  
              // Ausgabe setzen
              this.setOutputData(0, { value: value, str: this.properties.str, uvName: this.properties.uvName });
              this.boxcolor = null;
            } catch (err) {
              console.error("Fehler in der Formel:", err);
              this.boxcolor = "red";
              this.setOutputData(0, { value: null, str: this.properties.str, uvName: this.properties.uvName });
            }
          }
        }
      }
    );
  }