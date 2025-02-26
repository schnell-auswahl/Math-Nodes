export function _TextDisplayNode() {
    return class TextDisplayNode {
        constructor() {
            this.addInput("", "string");
            this.title = "Text Anzeige";
            this.properties = { 
                displayedText: "",
                savedText: "",
                textVisible: true,
                currentInputText: "" // Neues Property für den aktuellen Eingabetext
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
            
            // Aktuellen Eingabetext verarbeiten
            if (this.properties.textVisible == false || this.properties.textVisible == "false") {
                this.properties.currentInputText = "";
                this.textGrey = false;
            } else if (inputText && inputText.includes("\u200B")) {
                this.properties.currentInputText = "verschlüsselt";
                this.textGrey = false;
            } else if (inputText) {
                this.properties.currentInputText = inputText;
                this.textGrey = false;
            } else {
                this.properties.currentInputText = ""; // Kein aktueller Input
            }
            
            // Für die Kompatibilität mit bestehenden Code, setzen wir displayedText auf den aktuellen Text
            this.properties.displayedText = this.properties.currentInputText;
            
            // Dynamische Größenanpassung der Node basierend auf dem Text
            this.adjustNodeSize();
        }
        
        // Neue Methode zur Größenanpassung
        adjustNodeSize() {
            const ctx = document.createElement("canvas").getContext("2d");
            ctx.font = "12px Arial";
            
            const boxWidth = this.size[0] - 2 * this.padding;
            let totalHeight = 2 * this.padding; // Start mit Padding oben und unten
            
            // Höhe für aktuellen Input-Text
            if (this.properties.currentInputText) {
                totalHeight += this.calculateTextHeight(ctx, this.properties.currentInputText, boxWidth);
            }
            
            // Höhe für Trennlinie + Abstand
            if (this.properties.currentInputText && this.properties.savedText) {
                totalHeight += 20; // 10px vor und 10px nach der Trennlinie
            }
            
            // Höhe für gespeicherten Text
            if (this.properties.savedText) {
                totalHeight += this.calculateTextHeight(ctx, this.properties.savedText, boxWidth);
            }
            
            // Minimalhöhe sicherstellen
            totalHeight = Math.max(totalHeight, 100);
            
            this.size[1] = totalHeight;
        }

        onConnectionsChange() {
            this.properties.currentInputText = ""; // Nur den aktuellen Input zurücksetzen
            this.properties.displayedText = ""; // Für Kompatibilität
            this.adjustNodeSize(); // Größe anpassen nach Änderung
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
            
            // Text-Styles einstellen
            ctx.font = "12px Arial";
            
            // Zeichnen des aktuellen Input-Texts
            let y = this.padding + 14; // Anfangsposition für die erste Zeile
            let hasInputText = false;
            
            if (this.properties.currentInputText) {
                hasInputText = true;
                ctx.fillStyle = "#FFFFFF"; // Weißer Text für aktuellen Input
                this.drawMultilineText(ctx, this.properties.currentInputText, this.padding + 5, y, boxWidth, boxHeight / 2);
                y += this.calculateTextHeight(ctx, this.properties.currentInputText, boxWidth);
            }
            
            // Trennstrich zeichnen, wenn sowohl Input als auch gespeicherter Text vorhanden sind
            if (hasInputText && this.properties.savedText) {
                //y += 10; // Abstand vor dem Strich
                ctx.beginPath();
                ctx.moveTo(this.padding, y);
                ctx.lineTo(this.size[0] - this.padding, y);
                ctx.strokeStyle = "#CCCCCC"; // Grauer Strich
                ctx.lineWidth = 1;
                ctx.stroke();
                y += 20; // Abstand nach dem Strich
            }
            
            // Zeichnen des gespeicherten Texts
            if (this.properties.savedText) {
                ctx.fillStyle = "#CCCCCC"; // Grauer Text für gespeicherten Text
                this.drawMultilineText(ctx, this.properties.savedText, this.padding + 5, y, boxWidth, boxHeight / 2);
            }
        }
        
        // Hilfsmethode zum Zeichnen von mehrzeiligem Text
        drawMultilineText(ctx, text, x, y, maxWidth, maxHeight) {
            const words = text.split(" ");
            const lineHeight = 14;
            let line = "";
            let startY = y;
            
            for (let word of words) {
                const testLine = line + word + " ";
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth) {
                    ctx.fillText(line, x, y);
                    line = word + " ";
                    y += lineHeight;
                    
                    if (y - startY > maxHeight) {
                        ctx.fillText("(...)", x, y);
                        return;
                    }
                } else {
                    line = testLine;
                }
            }
            
            if (line) {
                ctx.fillText(line, x, y);
            }
        }
        
        // Hilfsmethode zur Berechnung der Höhe des Texts
        calculateTextHeight(ctx, text, maxWidth) {
            const words = text.split(" ");
            const lineHeight = 14;
            let line = "";
            let height = lineHeight;
            
            for (let word of words) {
                const testLine = line + word + " ";
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth) {
                    line = word + " ";
                    height += lineHeight;
                } else {
                    line = testLine;
                }
            }
            
            return height;
        }
    };
}