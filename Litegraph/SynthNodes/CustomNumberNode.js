

export function _CustNumberNode() {
  return (
    class CustNumberNode {
      constructor() {
        this.color = paramNodesColor;
        this.bgcolor = bgColor2;
        this.addOutput("value", "object");
        this.properties = { value: 1.0, rightSide: "a"};
        this.numberWidget = this.addWidget("number", "Wert", 1, "value", { precision: 2 });
        this.nameWidget = this.addWidget("text", "Parametername", "a", (v) => {
          //console.log("Callback wurde aufgerufen");
          const lowerCaseValue = v.toLowerCase();
          if (lowerCaseValue.length === 0) {
            console.error("Invalid input: Input cannot be empty.");
            this.nameWidget.value = this.properties["rightSide"];
            return;
          }
          const firstChar = lowerCaseValue.charAt(0);
          if (!/^[a-z]$/.test(firstChar)) {
            console.error("Invalid input: Only single letters are allowed.");
            this.nameWidget.value = this.properties["rightSide"];
            return;
          }
          let correctedValue;
          if (firstChar === 'e' || firstChar === 'i') {
            correctedValue = this.properties["rightSide"];
          } else {
            correctedValue = firstChar;
          }
          this.properties["rightSide"] = correctedValue;
          this.nameWidget.value = correctedValue; // Aktualisiert den Wert im Widget
        });

        this.widgets_up = true;
// Animation

        this.lastbtpress = 0;
        this.outputValue = 0;
        this.animationActive = false;
        this.addWidget(
          "button",          // Typ des Widgets
          "Animieren",             // Beschriftung auf dem Button
          null,              // Kein Standardwert notwendig
          () => {            // Callback-Funktion für den Button
            //console.log("Button gedrückt!");  // Aktion, die bei einem Klick auf den Button ausgeführt wird
            this.lastbtpress = this.graph.globaltime;       // Ruft eine Methode auf, die die Funktion ausführt

            if (this.animationActive == true) {
              this.animationActive = false;
              //console.log(this.animationActive);
            } else {
              this.animationActive = true;
              //console.log(this.animationActive);
            }
            

          }
        )

        //this.color = "#4C7468"; //Titelfarbe
        //this.bgcolor = "#9FA8B4"; //Hintergrundfarbe
         this.shape = LiteGraph.ROUND_SHAPE; // Runde Ecken
         this.size = [180, 80];
      }

      onExecute() {

           // Hier wird die Rundung wie gewünscht angewendet
           const roundedValue = Math.round((parseFloat(this.properties["value"]) + Number.EPSILON) * 100) / 100;
           const animatedValue = Math.round((parseFloat(this.graph.globaltime - this.lastbtpress+roundedValue) + Number.EPSILON) * 100) / 100;// Zeitzurücksetzen + Rundung
   
           if (this.animationActive) {
           this.outputValue = animatedValue;
           //console.log(this.outputValue);
           } else {
             this.outputValue = roundedValue;
           }

        var output = {
          value: this.outputValue,
          uvValue: this.outputValue,
          rightSide: this.outputValue,
          leftSide: this.properties["rightSide"],
          uvName: "",
          isNumberNode: "Parameter",
          toToolTip: () => {
          
            // Tooltip zusammensetzen
            const tooltip = `${this.properties["rightSide"]} = ${Math.floor(this.outputValue * 10) / 10}`;
            return tooltip;
        }
          // funcList: ""
        }
        this.setOutputData(0, output);
        this.outputs[0].color_off = "#000000";
        this.outputs[0].color_on = adjustColor("#00FF00","#FF0000",this.outputValue);
      }

      getTitle() {
        let title = "Parameter"
        if (this.properties["rightSide"] && !this.animationActive) {
          title = title + " " + this.properties["rightSide"];
        } else if (this.properties["rightSide"] && this.animationActive) {
          title = this.properties["rightSide"] + " = "  + Math.floor(this.outputValue * 10) / 10;
        }
        return title;
      }

      setValue(v) {
        this.setProperty("value", v);
        console.log("in setValue");
      }

     
      onDrawForeground(ctx) {

        if (this.flags && this.flags.collapsed) {
          return; // Zeichne nichts, wenn die Node collapsed ist
         }
        // Rundung auf 3 Dezimalstellen für die Anzeige, unabhängig von der Berechnung
        this.outputs[0].label = this.properties["value"].toFixed(3);

                // Färbe den Eingang oder zeichne einen Kreis darum
        const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
        // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
        const inputPosX = labelInputPosX;
        const nodeWidth = this.size[0];      
        const outputPosX = nodeWidth; // Rechter Rand der Node
          // Parameter für die Trichterform
        const width = labelWidth; // Breite der Basis (linke Seite)
        const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)

        const inputPosY = (0) * NODE_SLOT_HEIGHT + 14;

        //Output:
        // Berechnung der x-Position auf der rechten Seite der Node
        ctx.beginPath();
        ctx.moveTo(outputPosX, inputPosY - height / 2);              // Obere rechte Ecke
        ctx.lineTo(outputPosX - width, inputPosY - height / 2);      // Nach links zur Basis
        ctx.arc(outputPosX - width,inputPosY,height / 2 ,0, 2 * Math.PI,true)
        ctx.lineTo(outputPosX - width, inputPosY + height / 2);      // Nach unten zur linken Unterkante
        ctx.lineTo(outputPosX, inputPosY + height / 2); 
        ctx.closePath();
        ctx.fillStyle = outLabelsColor;
        ctx.fill();


        
      }
    }
  );
}