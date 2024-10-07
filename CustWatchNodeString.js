export function _CustWatchNodeString() {
  return (
    class CustWatchNodeString {
      constructor() {
        this.size = [160, 80];  // Etwas größere Größe, damit genug Platz für die Gleichung ist
        this.color = "#CE8A53"; //Titelfarbe
        this.bgcolor = "#FFFFFF"; //Hintergrundfarbe

        this.addInput("value", 0, { label: "" });
        this.value = 0;
        this.title = "Gleichung";
        this.desc = "Show Equation of input";
        this.latexDiv = null;  // Für die MathJax-Darstellung
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
          return o["leftSide"] + " = " + o["rightSide"];  // Gib die Gleichung in Textform zurück
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

      onDrawForeground(ctx) {
        if (!this.value) return;
    
        // Die Gleichung als String
        let equation = this.toString(this.value);
    
        // Stelle sicher, dass ein Div-Element für KaTeX vorhanden ist
        if (!this.latexDiv) {
            this.latexDiv = document.createElement("div");
            this.latexDiv.style.position = "absolute";
            this.latexDiv.style.fontSize = "13px";
            this.latexDiv.style.zIndex = "1000";  // Stellt sicher, dass es im Vordergrund bleibt
            //this.latexDiv.style.backgroundColor = "rgba(255,255,255,0.8)";  // Leicht transparenter Hintergrund
            document.body.appendChild(this.latexDiv);
        }
    
        // Dynamische Aktualisierung der Position des Divs basierend auf der aktuellen Node-Position
        const canvasRect = ctx.canvas.getBoundingClientRect();
        const offsetX = 20;  // Verschiebung nach rechts
        const offsetY = 20;  // Verschiebung nach unten
        this.latexDiv.style.top = (this.pos[1] + canvasRect.top) + "px";  // Aktualisiert die Y-Position
        this.latexDiv.style.left = (this.pos[0] + canvasRect.left) + "px";  // Aktualisiert die X-Position
    
        this.latexDiv.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        // Render die Gleichung als KaTeX in das Div-Element
        this.renderEquationWithKaTeX(equation, this.latexDiv);
    
        // Warte, bis das KaTeX-Inhalts gerendert wurde, um die Größe zu ermitteln
        setTimeout(() => {
            const rect = this.latexDiv.getBoundingClientRect();  // Hol die Größe des gerenderten Inhalts
            // Aktualisiere die Node-Größe entsprechend der Größe der gerenderten Gleichung
            this.size[0] = rect.width + 30;  // Padding hinzufügen, damit es nicht zu eng ist
            this.size[1] = rect.height + 20; // Padding hinzufügen, damit es nicht zu eng ist
        }, 100);  // Ein kleines Timeout, um sicherzustellen, dass die Gleichung bereits gerendert ist
      }
    }
  );
}