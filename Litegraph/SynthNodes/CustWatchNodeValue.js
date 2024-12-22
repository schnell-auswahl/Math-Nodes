export function _CustWatchNodeValue() { return(
    class CustWatchNodeValue {
      constructor() {
        this.size = [100, 30];
        //this.color = "#CE8A53"; //Titelfarbe
        this.color = fbNodesColor;
        //this.bgcolor = "#FFFFFF"; //Hintergrundfarbe
        this.bgcolor = bgColor2;

        this.addInput("","object");
        //this.addInput("UV", "object");
        this.inputData = 0;
        this.minWidthX = 180;
        this.minWidthY = 30;
        this.title = "Wert";
        this.desc = "Show value of input";
        
        this.properties = {
          FormulaFromInput: "",   
          uvValueFromInput: 0,
          uvNameFromInput: "", 
          displayValue: 0
        };



        this.oldFormula = "";
        this.olduvValue = 0;
        this.olduvNameFromInput = "";

       

      }
  
      onExecute() {

        this.inputs[0].color_off = "#000000";


        if (this.getInputData(0)) {
          this.inputData = this.getInputData(0);
          this.properties.FormulaFromInput = this.inputData["rightSide"];
          this.properties.uvValueFromInput = this.inputData["uvValue"]; // Gegen UV Value tauschen
          this.properties.uvNameFromInput = this.inputData["uvName"]; 

          

          if ( this.oldFormula != this.properties.FormulaFromInput || this.olduvValue != this.properties.uvValueFromInput || this.olduvNameFromInput != this.properties.uvNameFromInput) {
           
            try {
              this._func = new Function(this.properties.uvNameFromInput,"return " + this.properties.FormulaFromInput); // Erstelle neue Funktion -> To Do funktion vorher sicher machen

              this.properties.displayValue = this._func(this.properties.uvValueFromInput); // Wert aus Funktion ausrechen
              //console.log("this._func lautet",this._func);
              //console.log("rechnentest",this._func(1));
              this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg

              this.oldFormula = this.properties.FormulaFromInput;
              this.olduvValue = this.properties.uvValueFromInput;
              this.olduvNameFromInput = this.properties.uvNameFromInput;
              this.inputs[0].color_on = adjustColor("#00FF00","#FF0000",this.properties.displayValue);
            }
            catch (err) {
              console.error("Fehler in der Formel:", err); // Fehlerbehandlung bei Problemen mit der Formel
              this.boxcolor = "red"; // Fehlerfarbmarkierung
            }


          }  
        }
      };
  
      getTitle() {
        if (this.flags.collapsed) { //Nochmal checken was das heißt
            return this.inputs[0].label;
        }
        return this.title;
      };
  
      roundtoString = function(o) {
        if (o == null) {
            return "";
        } 
        //else if (!o["value"] || o["value"] == null) {
          //  return "Fehler";
        //}
         else {
            var num = o;
            num = Math.round((num + Number.EPSILON) * 100) / 100;
            return num.toString();
        }
      };
  
      onDrawForeground = function(ctx) {
        if (this.flags && this.flags.collapsed) {
          return; // Zeichne nichts, wenn die Node collapsed ist
         }
        //show the current value
        // Färbe den Eingang oder zeichne einen Kreis darum
        const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;

        // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
        const inputPosX = labelInputPosX;

        // Relativer y-Wert basierend auf Titelhöhe und Slot-Höhe
        const inputPosY = (0) * NODE_SLOT_HEIGHT + 14;

          // Parameter für die Trichterform
        const width = labelWidth; // Breite der Basis (linke Seite)
        const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)


        //Draw text:

        this.displayString = this.roundtoString(this.properties.displayValue);
        //this.inputs[0].label = displayString;
        // const lableLength = this.displayString.length;
        // //console.log(displayString);
        // //console.log(lableLength);
        // const minWidthX = 100; // Standardbreite des Knotens
        // const extraWidthPerChar = 8; // Zusätzliche Breite pro Zeichen über der Standardlänge

        // // Berechne die neue Breite, wenn der Titel länger ist als 20 Zeichen
      

        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        const textinfo = ctx.measureText(this.displayString);
        console.log(textinfo.width);
  
        //Setze die Knotengröße neu
        if (this.getInputData(0) && textinfo.width + 4 * inputPosX > this.minWidthX ){
          this.size = [textinfo.width + 4 * inputPosX , this.size[1]];
        } else 
        this.size[0] = this.minWidthX;

      
    const lineWidth = this.size[0]; // Breite der Node

    // Zeilenbereiche und zugehörige Farben
    const ranges = [10, 100, 1000, 100000, 10000000]; // Bereichsgrenzen
    const colors = ["#FFCCCC", "#FF9999", "#FF6666", "#FF3333", "#FF1111"]; // Farben pro Bereich

    // Hintergrund einfärben
    let remainingValue = this.properties.displayValue;
    

    for (let i = 0; i < ranges.length; i++) {
        const rangeStart = i === 0 ? 0 : ranges[i - 1];
        const rangeEnd = ranges[i];
        const rangeHeight = NODE_SLOT_HEIGHT; // Höhe einer Zeile
        const topY =  i * rangeHeight;

        // Berechnung des Anteils in der aktuellen Zeile
        let fillRatio = 0;
        if (this.properties.displayValue > rangeStart) {
            const effectiveValue = Math.min(this.properties.displayValue, rangeEnd);
            fillRatio = (effectiveValue - rangeStart) / (rangeEnd - rangeStart);
            //remainingValue -= (rangeEnd - rangeStart);
            if (i * NODE_SLOT_HEIGHT > this.minWidthY){
            this.size[1] = (i+1) * NODE_SLOT_HEIGHT +5 ;
            }
            
        }

        // Zeichne den eingefärbten Bereich der Zeile
        ctx.beginPath();
        ctx.rect(0, topY, lineWidth * fillRatio, rangeHeight);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.closePath();
    }

// Text nach Hintergrund schreiben, aber vorher berechnen
ctx.fillStyle = "#FFFFFF";    
ctx.fillText(
      this.displayString,
      2 * inputPosX,
      LiteGraph.NODE_SLOT_HEIGHT
      //(this.size[1] + LiteGraph.NODE_TITLE_HEIGHT) * 0.5
      );


        // Beginne mit dem Zeichnen des Dreiecks
        ctx.beginPath();

        // Input Trichter
        ctx.moveTo(0, inputPosY - height / 2);
        ctx.lineTo(inputPosX ,inputPosY - height / 2);
        ctx.arc(inputPosX,inputPosY,height / 2 ,0, 2 * Math.PI)
        ctx.lineTo(inputPosX ,inputPosY + height / 2);
        ctx.lineTo(0 ,inputPosY + height / 2);
        ctx.lineTo(0 ,inputPosY + height / 2);
        ctx.closePath();

        // Füllen des Trichters
        ctx.fillStyle = inLabelsColor;
        ctx.fill();

        

      };
    }
  )}