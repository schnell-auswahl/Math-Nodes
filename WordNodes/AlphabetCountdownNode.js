export function _AlphabetCountdownNode() {
    return class AlphabetCountdownNode {
        constructor() {
            this.addInput("IN", "string");
            this.addOutput("OUT", "string");
            this.title = "Alphabet-Countdown";
            this.size = [220, 100];
            this.resizable = false; // Verhindert das Resizing
            this.description = "Ersetze jeden Buchstaben\n" +
                                "durch den vorherigen im Alphabet.\n" +
                                "A wird zu Z, B zu A usw.";
        }

        onExecute() {
            const inputText = this.getInputData(0);
            if (inputText) {
                this.setOutputData(0, this.alphabetCountdown(inputText));
            }
        }

        alphabetCountdown(text) {
            return text.replace(/[a-zA-Z]/g, (c) => {
                if (c === "a") return "z";
                if (c === "A") return "Z";
                return String.fromCharCode(c.charCodeAt(0) - 1);
            });
        }

        onDrawForeground(ctx) {
            // Zeichne eine zentrierte Beschreibung der Funktion in die Node
            ctx.font = "12px Arial";
            ctx.fillStyle = "#FFFFFF"; // Schwarzer Text

            const lineHeight = 14; // Höhe pro Zeile
            const startY = 30;    // Startabstand vom oberen Rand

            // Den Text Zeile für Zeile anzeigen und zentrieren
            const lines = this.description.split("\n");
            lines.forEach((line, index) => {
                const textWidth = ctx.measureText(line).width;
                const x = (this.size[0] - textWidth) / 2; // Zentrierte Position berechnen
                const y = startY + (index + 1) * lineHeight;
                ctx.fillText(line, x, y);
            });
        
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

         //Output:
          // Berechnung der x-Position auf der rechten Seite der Node
                   ctx.beginPath();

          // Ausgangstrichter spiegeln
          ctx.moveTo(outputPosX, inputPosY - height / 2);              // Obere rechte Ecke
          ctx.lineTo(outputPosX - width, inputPosY - height / 2);      // Nach links zur Basis
          ctx.arc(outputPosX - width,inputPosY,height / 2 ,0, 2 * Math.PI,true)
          ctx.lineTo(outputPosX - width, inputPosY + height / 2);      // Nach unten zur linken Unterkante
          ctx.lineTo(outputPosX, inputPosY + height / 2); 
                       // Nach rechts zur unteren rechten Ecke

          // Schließe den Pfad und fülle die Trichterform
          ctx.closePath();
          ctx.fillStyle = outLabelsColor;
          ctx.fill();
        
        
        
        
        }

      
    };
}