

export function _CustNumberNode() {
  return (
    class CustNumberNode {
      constructor() {
        this.lastLogTime = 0; // Zeitstempel des letzten Logs


        this.color = paramNodesColor;
        this.bgcolor = bgColor2;
        this.addInput("value", "object");
        this.addOutput("value", "object");
        this.properties = { value: 1.0, rightSide: ""};
        this.numberWidget = this.addWidget("number", "Wert", 1, "value", { precision: 2 });
        this.nameWidget = this.addWidget("text", "Parametername", this.properties.rightSide, (v) => {
          //this.logWithThrottle("Callback wurde aufgerufen");
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

        this.leftSide = "";
        this.rightSide = "";
        this.uvValue = 0;
        this.uvName = "";
        this.InputData = null;
        this.animationOnFromInput = false;
// Animation

        this.lastbtpress = 0;
        this.outputValue = 0;
        this.animationActive = false;
        this.animationWidget = this.addWidget(
          "button",          // Typ des Widgets
          "Animieren",             // Beschriftung auf dem Button
          null,              // Kein Standardwert notwendig
          () => {            // Callback-Funktion für den Button
            //this.logWithThrottle("Button gedrückt!");  // Aktion, die bei einem Klick auf den Button ausgeführt wird
            this.lastbtpress = this.graph.globaltime;       // Ruft eine Methode auf, die die Funktion ausführt

            if (this.animationActive == true) {
              this.animationActive = false;
              //this.logWithThrottle(this.animationActive);
            } else {
              this.animationActive = true;
              //this.logWithThrottle(this.animationActive);
            }
            

          }
        )

        //this.color = "#4C7468"; //Titelfarbe
        //this.bgcolor = "#9FA8B4"; //Hintergrundfarbe
         this.shape = LiteGraph.ROUND_SHAPE; // Runde Ecken
         this.size = [180, 80];
      }

      logWithThrottle(message, data) {
        const currentTime = Date.now();
        if (currentTime - this.lastLogTime >= 4000) { // 4000 Millisekunden = 4 Sekunden
          console.log(message, data);
          this.lastLogTime = currentTime;
        }
      }

      onExecute() {
        if (this.properties.widgetVisible == false || this.properties.widgetVisible == "false" ) {
          this.widgets = []; // Alle Widgets entfernen
          this.size = [180, 35];
        } else if ((this.properties.widgetVisible == true || this.properties.widgetVisible == "true") && this.widgets.length === 0) {
          // Widget neu zeichnen, wenn es vorher entfernt wurde
          this.widgets = [ this.numberWidget ,   this.nameWidget , this.animationWidget];
          this.size = [180, 100];
        }


        if (this.isInputConnected(0)) {
          this.InputData = this.getInputData(0); // Holt den Wert der Gleichung
          //this.logWithThrottle("InputData received:", this.InputData);
          this.inputs[0].color_on = adjustColor("#00FF00","#FF0000",this.InputData["value"]);
          this.outputValue = this.InputData["value"];
          this.uvValue = this.InputData.uvValue;
          this.rightSide = this.InputData.rightSide;
          this.leftSide = this.properties["rightSide"] + "(" + this.InputData.uvName + ")";
          this.uvName = this.InputData.uvName;
          this.animationOnFromInput = this.InputData.animationOn;
          //this.logWithThrottle("Processed input data:", {
          //   outputValue: this.outputValue,
          //   uvValue: this.uvValue,
          //   rightSide: this.rightSide,
          //   leftSide: this.leftSide,
          //   uvName: this.uvName
          // });



          
       
        } else {
          //this.logWithThrottle("No input data, using properties");

           // Hier wird die Rundung wie gewünscht angewendet
           this.animationOnFromInput = false;
           const roundedValue = Math.round((parseFloat(this.properties["value"]) + Number.EPSILON) * 100) / 100;
           const animatedValue = Math.round((parseFloat(this.graph.globaltime - this.lastbtpress+roundedValue) + Number.EPSILON) * 100) / 100;// Zeitzurücksetzen + Rundung
           //this.logWithThrottle("Rounded value:", roundedValue);
           //this.logWithThrottle("Animated value:", animatedValue);
   
           if (this.animationActive) {
           this.outputValue = animatedValue;
           this.uvValue = this.outputValue;
           this.rightSide = this.outputValue;
           this.leftSide = this.properties["rightSide"];
           this.uvName = "";
           //this.logWithThrottle("Animation active, output values:", {
          //    outputValue: this.outputValue,
          //    uvValue: this.uvValue,
          //    rightSide: this.rightSide,
          //    leftSide: this.leftSide,
          //    uvName: this.uvName
          //  });
           } else {
             this.outputValue = roundedValue;
             this.uvValue = this.outputValue;
             this.rightSide = this.outputValue;
             this.leftSide = this.properties["rightSide"];
             this.uvName = "";
            //  this.logWithThrottle("Animation not active, output values:", {
            //    outputValue: this.outputValue,
            //    uvValue: this.uvValue,
            //    rightSide: this.rightSide,
            //    leftSide: this.leftSide,
            //    uvName: this.uvName
            //  });
            }

          }

        var output = {
          value: this.outputValue,
          uvValue: this.uvValue,
          rightSide: this.rightSide,
          leftSide: this.leftSide,
          uvName: this.uvName,
          isNumberNode: "Parameter",
          animationOn: this.animationOnFromInput,
          toToolTip: () => {
          
            // Tooltip zusammensetzen
            const tooltip = `${this.leftSide} = ${Math.floor(this.outputValue * 10) / 10}`;
            return tooltip;
        }
          // funcList: ""
        }
        //this.logWithThrottle("Final output:", output);
        this.setOutputData(0, output);
        this.outputs[0].color_off = "#000000";
        this.outputs[0].color_on = adjustColor("#00FF00","#FF0000",this.outputValue);
      }

      getTitle() {
        let title = "Parameter"
        if (this.properties["rightSide"] && !this.animationActive) {
          title = title + " " + this.leftSide;
        } else if (this.properties["rightSide"] && this.animationActive) {
          title = this.leftSide + " = "  + Math.floor(this.outputValue * 10) / 10;
        }
        return title;
      }

      setValue(v) {
        this.setProperty("value", v);
        //this.logWithThrottle("in setValue");
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


      // Beginne mit dem Zeichnen des Dreiecks
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


        
      }
    }
  );
}