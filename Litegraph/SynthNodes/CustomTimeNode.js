
export function _CustomTimeNode() { return (
  class CustomTimeNode {
    constructor() {
      this.color = srcNodesColor;
      this.bgcolor = bgColor2;
      
      this.addOutput("in ms", "object");
      this.addOutput("in sec", "object");
      this.properties = { rightSide: "t", leftSide: "t", uvName: "t"};
      //console.log(this.lastbtpress); 

      //this.nameWidget = this.addWidget("text","Variablenname","t","rightSide");
      this.lastbtpress = 0;

      this.title = "Time";
      this.desc = "Time";

      this.addWidget(
        "button",          // Typ des Widgets
        "t=0",             // Beschriftung auf dem Button
        null,              // Kein Standardwert notwendig
        () => {            // Callback-Funktion für den Button
          //console.log("Button gedrückt!");  // Aktion, die bei einem Klick auf den Button ausgeführt wird
          this.lastbtpress = this.graph.globaltime            // Ruft eine Methode auf, die die Funktion ausführt
        }
      );

      this.size = [100, 80]; // Etwas größere Größe, damit genug Platz für die Gleichung ist

    }

    onExecute = function() {
      this.time = Math.round((parseFloat(this.graph.globaltime - this.lastbtpress) + Number.EPSILON) * 100) / 100;// Zeitzurücksetzen + Rundung


      var outputSec = {
        value: this.time,
        rightSide: this.properties["rightSide"],
        leftSide: this.properties["leftSide"], 
        uvName: this.properties["rightSide"],
        uvValue: this.time,
        isNumberNode: "UV",
      }
      var outputMil = {
        value: this.time * 1000,
        rightSide: this.properties["rightSide"],
        leftSide: this.properties["leftSide"],
        uvName: this.properties["rightSide"],
        uvValue: this.time * 1000,
        isNumberNode: "UV",
      }
      this.setOutputData(0, outputMil);
      this.setOutputData(1, outputSec);
    };

    onDrawBackground(ctx) {
     
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
      for(let i=0; i<2; i++){

        const inputPosY = (i) * NODE_SLOT_HEIGHT + 14;
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

    getTitle() {
      let title = "Zeit"
      if(this.properties["rightSide"]){
        title = title + " " + this.properties["rightSide"];
      }
      return title;
    };
  }
)}