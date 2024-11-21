

export function _uvNode() {
  return (
    class uvNode {
      constructor() {

        this.color = srcNodesColor;
        this.bgcolor = bgColor2;
        this.addOutput("value", "object");
        this.properties = { value: 1.0, rightSide: "x"};
        this.numberWidget = this.addWidget("number", "Wert", 1, "value", { precision: 2 });
        this.nameWidget = this.addWidget("text", "Unabhängige", "x", "rightSide");
        this.widgets_up = true;
        //this.color = "#4C7468"; //Titelfarbe
        //this.bgcolor = "#9FA8B4"; //Hintergrundfarbe
         this.shape = LiteGraph.ROUND_SHAPE; // Runde Ecken
         this.size = [180, 60];
         
      }

      onExecute() {
        // Hier wird die Rundung wie gewünscht angewendet
        const roundedValue = Math.round((parseFloat(this.properties["value"]) + Number.EPSILON) * 100) / 100;

        var output = {
          value: roundedValue,
          uvValue: roundedValue,
          rightSide: this.properties["rightSide"],
          leftSide: this.properties["rightSide"],
          uvName: this.properties["rightSide"],
          isNumberNode: "UV",
          // funcList: ""
        }
        this.setOutputData(0, output);
      }

      getTitle() {
        let title = "Unabhängige"
        if (this.properties["rightSide"]) {
          title = title + " " + this.properties["rightSide"];
        }
        return title;
      }

      setValue(v) {
        this.setProperty("value", v);
        console.log("in setValue");
      }

      onDrawBackground(ctx) {
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