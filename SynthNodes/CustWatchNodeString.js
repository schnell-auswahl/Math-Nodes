export function _CustWatchNodeString() {
  return (
    class CustWatchNodeString {
      constructor() {
        this.size = [160, 80];  // Etwas größere Größe, damit genug Platz für die Gleichung ist
        //this.color = "#CE8A53"; //Titelfarbe
        this.color = fbNodesColor;
        //this.bgcolor = "#FFFFFF"; //Hintergrundfarbe
        this.bgcolor = bgColor1;

        this.addInput("value", 0, { label: "" });
        this.value = 0;
        this.title = "Gleichung";
        this.desc = "Show Equation of input";
        this.latexDiv = null;  // Für die MathJax-Darstellung

        this.properties = {
          GleichungvorMathJax: "",
          GleichungvorKaTex: ""
        };

      }

      onExecute() {
        if (this.inputs[0]) {
          this.value = this.getInputData(0); // Holt den Wert der Gleichung
        }
      }

      getTitle() {
        if (this.flags.collapsed) {
          return this.inputs[0].label;
        }
        return this.title;
      }

      toString(o) {
        if (o == null) {
          return "";
        } else if (!o["rightSide"] || o["rightSide"] == null) {
          return "Fehler";
        } else {
          let formulaForDisplay =  o["rightSide"]
            .replace(/\*\*/g, "^")          // Ersetzt Potenzierung zurück
            //.replace(/\*/g, "\\cdot ")              // setzt schönen Malpunkt <- Wichtig: Muss nach Potenzersetzung kommen
            .replace(/Math\.sin/g, "\sin ") // Ersetzt Sinus zurück
            .replace(/Math\.cos/g, "\cos ") // Ersetzt Kosinus zurück
            .replace(/Math\.tan/g, "\tan ") // Ersetzt Tangens zurück
            .replace(/Math\.sqrt/g, "\sqrt ") // Ersetzt Quadratwurzel zurück
            .replace(/Math\.log10/g, "\log ") // Ersetzt Logarithmus zur Basis 10 zurück
            .replace(/Math\.log\b/g, "\ln ")  // Ersetzt natürlicher Logarithmus zurück
            .replace(/Math\.exp/g, "\exp ")   // Ersetzt Exponentialfunktion zurück
            .replace(/Math\.abs\(([^()]*|\((?:[^()]*|\([^()]*\))*\))\)/g, "|$1|")  // Ersetzt Absolutbetrag und umschließt Inhalt mit |...|
            .replace(/Math\.PI/g, "\pi ")      // Ersetzt Math.PI durch das Symbol π
            .replace(/Math\.E/g, "e");      // Ersetzt Math.E durch das Symbol e
          
          return o["leftSide"] + " = " + formulaForDisplay;  // Gib die Gleichung in Textform zurück
        }
      }

      // Methode zur Gleichungs-Rendering mit KaTeX
      renderEquationWithKaTeX(equation, targetElement) {
        try {
          // Render die Gleichung mit KaTeX als SVG
          targetElement.innerHTML = katex.renderToString(equation, {
            throwOnError: false,
            displayMode: true
          });
        } catch (err) {
          console.error("Fehler beim Rendern der Gleichung mit KaTeX:", err);
        }
      }

      // Wenn der Node gelöscht wird, entferne das zugehörige LaTeX-Div
      onRemoved() {
        if (this.latexDiv && this.latexDiv.parentNode) {
          this.latexDiv.parentNode.removeChild(this.latexDiv);
          console.log("LaTeX-Div wurde entfernt.");
        }
      }

      onDrawForeground(ctx) {

           // Färbe den Eingang oder zeichne einen Kreis darum
              const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;

              // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
              const inputPosX = labelInputPosX;

              // Relativer y-Wert basierend auf Titelhöhe und Slot-Höhe
              const inputPosY = (0) * NODE_SLOT_HEIGHT + 14;

                // Parameter für die Trichterform
              const width = labelWidth; // Breite der Basis (linke Seite)
              const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)

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
          
      
        if (!this.value) return;
    
        // Die Gleichung als String
        let equation = this.toString(this.value);
        this.properties.GleichungvorMathJax = equation;
    
        // Konvertiere den mathematischen Ausdruck in LaTeX mit MathJS
        let latexEquation = convertToLatex(equation);
        this.properties.GleichungvorKaTex = latexEquation;
    
        // Stelle sicher, dass ein Div-Element für KaTeX vorhanden ist
        if (!this.latexDiv) {
            this.latexDiv = document.createElement("div");
            this.latexDiv.style.position = "absolute";
            this.latexDiv.style.fontSize = "13px";
            this.latexDiv.style.zIndex = "1000";  // Stellt sicher, dass es im Vordergrund bleibt
            // Optional: Hintergrund für bessere Sichtbarkeit
            // this.latexDiv.style.backgroundColor = "rgba(255,255,255,0.8)";  // Leicht transparenter Hintergrund
            document.body.appendChild(this.latexDiv);
        }
    
        // Dynamische Aktualisierung der Position des Divs basierend auf der aktuellen Node-Position
        const canvasRect = ctx.canvas.getBoundingClientRect();
        const offsetX = 20;  // Verschiebung nach rechts
        const offsetY = 20;  // Verschiebung nach unten
        this.latexDiv.style.top = (this.pos[1] + canvasRect.top) + "px";  // Aktualisiert die Y-Position
        this.latexDiv.style.left = (this.pos[0] + canvasRect.left) + "px";  // Aktualisiert die X-Position
    
        this.latexDiv.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    
        // Render die konvertierte LaTeX-Gleichung als KaTeX in das Div-Element
        this.renderEquationWithKaTeX(latexEquation, this.latexDiv);
    
        // Warte, bis der KaTeX-Inhalt gerendert wurde, um die Größe zu ermitteln
        setTimeout(() => {
            const rect = this.latexDiv.getBoundingClientRect();  // Hol die Größe des gerenderten Inhalts
            // Aktualisiere die Node-Größe entsprechend der Größe der gerenderten Gleichung
            if (this.size[0] < rect.width + 30){
              this.size[0] = rect.width + 30;  // Padding hinzufügen, damit es nicht zu eng ist
              this.size[1] = rect.height + 20; // Padding hinzufügen, damit es nicht zu eng ist
            }
        }, 100);  // Ein kleines Timeout, um sicherzustellen, dass die Gleichung bereits gerendert ist
      }
    }
  );
}