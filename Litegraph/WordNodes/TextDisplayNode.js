export function _TextDisplayNode() {
    return class TextDisplayNode {
        constructor() {
            this.addInput("", "string");
            this.title = "Text Anzeige";
            this.properties = { displayedText: "",
                savedText: "",
                textVisible: true
            };

            //this.displayedText = "";
            this.size = [220, 100];
            this.padding = 15; // Abstand vom Rand der Box
            this.bgcolor = fbNodesColor;
            this.color = fbNodesColor;
            this.constructor.collapsable = false;
            this.textGrey = false;
        }

     
        onExecute() {
            const inputText = this.getInputData(0);
            
            // Wenn Text vorhanden ist, anzeigen; andernfalls Text löschen
            if ( this.properties.textVisible == false || this.properties.textVisible == "false" ) {
                this.properties.displayedText = "";
                this.textGrey = false;
            } else if (inputText && inputText.includes("\u200B")) {
                this.textGrey = false;
                this.properties.displayedText = "verschlüsselt";
            } else if (inputText) {
                this.textGrey = false;
                this.properties.displayedText = inputText;
                //console.log("input text: " + inputText);
            } else {
                this.properties.displayedText = this.properties.savedText;
                this.textGrey = true;
            }
        }

        onConnectionsChange() {
            this.properties.displayedText = ""; // Text zurücksetzen, wenn keine Eingabe vorhanden
        }

             //Minimale Größe Festlegen
        onResize() {
        
            if (this.size[0] < 220) {
            this.size[0] = 220
            }
            if (this.size[1] < 100) {
            this.size[1] = 100
            }
        }


        onDrawForeground(ctx) {
            if (this.flags && this.flags.collapsed) {
                return; // Zeichne nichts, wenn die Node collapsed ist
               }
            // Dynamische Größe der Textbox an die Größe der Node anpassen
            // Zeichne die Input- und Output-Slots
            const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
            const inputPosX = labelInputPosX;
            const nodeWidth = this.size[0];
            const outputPosX = nodeWidth;
            const width = labelWidth;
            const height = labelHeight;
            const inputPosY = 14;

            ctx.beginPath();
            ctx.moveTo(0, inputPosY - height / 2);
            ctx.lineTo(inputPosX, inputPosY - height / 2);
            ctx.arc(inputPosX, inputPosY, height / 2, 0, 2 * Math.PI);
            ctx.lineTo(inputPosX, inputPosY + height / 2);
            ctx.lineTo(0, inputPosY + height / 2);
            ctx.closePath();
            ctx.fillStyle = inLabelsColor;
            ctx.fill();
           
           
           
           
           
           
           
           
            const boxWidth = this.size[0] - 2 * this.padding;
            const boxHeight = this.size[1] - 2 * this.padding;
        
            // Zeichne das "Fenster" (weiße Box) als Hintergrund für den Text
            //ctx.fillStyle = textAnzeigeColor;
            //ctx.fillRect(this.padding, this.padding, boxWidth, boxHeight);
        
            // Rahmen für das "Fenster" zeichnen
            //ctx.strokeStyle = "#000000";
            //ctx.lineWidth = 1;
            //ctx.strokeRect(this.padding, this.padding, boxWidth, boxHeight);
        
            // Text-Styles einstellen
            ctx.font = "12px Arial";
            if (this.textGrey) {
                ctx.fillStyle = "#CCCCCC";
            } else {
            ctx.fillStyle = "#FFFFFF";
            }
        
            const words = this.properties.displayedText.split(" "); // Zerlege den Text in Wörter
            const lineHeight = 14; // Höhe für jede Textzeile
            let y = this.padding + lineHeight; // Anfangsposition für die erste Zeile
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