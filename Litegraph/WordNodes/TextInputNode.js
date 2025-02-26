export function _TextInputNode() {
    return class TextInputNode {
      constructor() {
        this.addOutput("", "string");
        this.properties = { text: "",
          geheim: false,
          widgetVisible: true,
        };
        this.constructor.collapsable = false;
        this.textInput_widget = this.addWidget("text", "", "", (v) => {
          // Ersetze die speziellen Zeichen
          this.properties.text = v
              .replace(/ä/g, "ae")
              .replace(/ö/g, "oe")
              .replace(/ü/g, "ue")
              .replace(/Ä/g, "Ae")
              .replace(/Ö/g, "Oe")
              .replace(/Ü/g, "Ue")
              .replace(/ß/g, "ss");
        });
        this.title = "Text Eingabe";
        //this.text = "";

        this.displayedText = "";
        this.size = [220, 150];
        this.padding = 15; // Abstand vom Rand der Box
        this.paddingtop = 40;
        this.color = srcNodesColor;
        this.bgcolor = textAnzeigeColor;

      }
  
      //Minimale Größe Festlegen
      onResize() {
       
       if (this.size[0] < 220) {
        this.size[0] = 220
        }
       if (this.size[1] < 150) {
          this.size[1] = 150
        }
     }

      onExecute() {
        if (this.properties.widgetVisible == false || this.properties.widgetVisible == "false" ) {
          this.widgets = []; // Alle Widgets entfernen
          this.paddingtop = 0;
        } else if ((this.properties.widgetVisible == true || this.properties.widgetVisible == "true") && this.widgets.length === 0) {
          // Widget neu zeichnen, wenn es vorher entfernt wurde
          this.widgets = [this.textInput_widget];
          this.paddingtop = 40;
        }
   
        if (this.properties.geheim == "true") {
          this.flags.collapsed = true;
            this.properties.text = "\u200B" + this.properties.text;
        } else {
          if (this.properties.text.includes("\u200B")) {
          this.properties.text = this.properties.text.replace(/\u200B/g, "");
          }
          //console.log(this.properties.text);
        }

        const inputText = this.properties.text;

        this.setOutputData(0, this.properties.text);
        
            
        // Wenn Text vorhanden ist, anzeigen; andernfalls Text löschen
        if (inputText !== undefined) {
            this.displayedText = inputText;
        } else {
            this.displayedText = ""; // Text zurücksetzen, wenn keine Eingabe vorhanden
        }
        //console.log(this.displayedText);

      }
      
      onDrawForeground(ctx) {
        if (this.flags && this.flags.collapsed) {
            return; // Zeichne nichts, wenn die Node collapsed ist
           }
         // Zeichne die Input- und Output-Slots
         const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
         const inputPosX = labelInputPosX;
         const nodeWidth = this.size[0];
         const outputPosX = nodeWidth;
         const width = labelWidth;
         const height = labelHeight;
         const inputPosY = 14;    
 
         ctx.beginPath();
         ctx.moveTo(outputPosX, inputPosY - height / 2);
         ctx.lineTo(outputPosX - width, inputPosY - height / 2);
         ctx.arc(outputPosX - width, inputPosY, height / 2, 0, 2 * Math.PI, true);
         ctx.lineTo(outputPosX - width, inputPosY + height / 2);
         ctx.lineTo(outputPosX, inputPosY + height / 2);
         ctx.closePath();
         ctx.fillStyle = outLabelsColor;
         ctx.fill();   
              
        // Dynamische Größe der Textbox an die Größe der Node anpassen
        const boxWidth = this.size[0] - 2 * this.padding;
        const boxHeight = this.size[1] - 2 * this.padding;
    
        // Zeichne das "Fenster" (weiße Box) als Hintergrund für den Text
        //ctx.fillStyle = textAnzeigeColor;
        //ctx.fillRect(this.padding, this.padding, boxWidth, boxHeight);
    
        // Rahmen für das "Fenster" zeichnen
        // ctx.strokeStyle = "#000000";
        // ctx.lineWidth = 1;
        //ctx.strokeRect(this.padding , this.padding + this.paddingtop, boxWidth, 0);

        ctx.beginPath();
        ctx.moveTo(this.padding, this.padding + this.paddingtop);
        ctx.lineTo(  this.size[0] - this.padding ,this.padding + this.paddingtop);
        ctx.strokeStyle = inLabelsColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    
        // Text-Styles einstellen
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000000";
    
        const words = this.displayedText.split(" "); // Zerlege den Text in Wörter
        //console.log(words);
        const lineHeight = 14; // Höhe für jede Textzeile
        let y = this.padding + lineHeight +   this.paddingtop; // Anfangsposition für die erste Zeile
        let line = ""; // Aktuelle Zeile, die aufgebaut wird
    
        // Iteriere über jedes Wort und prüfe, ob es in die Zeile passt
        for (let word of words) {
            const testLine = line + word + " ";
            const testWidth = ctx.measureText(testLine).width;
    
            // Wenn die Zeile zu lang wird, zeichne die aktuelle Zeile und starte eine neue
            if (testWidth > boxWidth) {
                ctx.fillText(line, this.padding + 5, y);
                line = word + " "; // Starte die neue Zeile mit dem aktuellen Wort
                y += lineHeight; // Verschiebe die vertikale Position nach unten
    
                // Wenn die maximale Höhe erreicht wird, Text abschneiden
                if (y + lineHeight > this.size[1] - this.padding) {
                    ctx.fillText("(...)", this.padding + 5, y);
                    return;
                }
            } else {
                line = testLine; // Füge das Wort zur aktuellen Zeile hinzu
            }
        }
    
        // Zeichne die verbleibende Zeile, wenn noch Platz ist
        if (line && y <= this.size[1] - this.padding) {
            ctx.fillText(line, this.padding + 5, y);
        }
       
        }
    };
  }