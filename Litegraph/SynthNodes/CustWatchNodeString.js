export function _CustWatchNodeString() {
  return class CustWatchNodeString {
    constructor() {
      this.size = [160, 160]; // Etwas größere Größe, damit genug Platz für die Gleichung ist
      this.color = fbNodesColor;
      this.bgcolor = bgColor2;

      this.addInput("value", 0, { label: "" });
      this.value = null;
      this.lastRenderedEquation = null; // Speichert die zuletzt gerenderte Gleichung
      this.renderedImage = null; // Speichert das gerenderte Bild
      this.title = "Gleichung";
      this.desc = "Show Equation of input";
      this.Pause = false;
      this.offsetX = 20; // Verschiebung nach rechts
      this.offsetY = 20;

      this.properties = {
        GleichungvorMathJax: "",
        GleichungvorKaTex: "",
      };
    }

    onExecute() {
      this.inputs[0].color_off = "#000000";

      if (this.inputs[0]) {
        this.value = this.getInputData(0); // Holt den Wert der Gleichung
        this.inputs[0].color_on = adjustColor("#00FF00","#FF0000",this.value["value"]);
      }

      //console.log(this.properties.GleichungvorMathJax);
      if (!this.value && !this.properties.GleichungvorMathJax) return;

      if (this.value) {
        this.properties.GleichungvorMathJax= this.toString(this.value);
      }
        let equation =  this.properties.GleichungvorMathJax;
      

      // Konvertiere den mathematischen Ausdruck in LaTeX mit MathJS
      let latexEquation = convertToLatex(equation);
      this.properties.GleichungvorKaTex = latexEquation;

      // Prüfen, ob die Gleichung sich geändert hat
      if (this.lastRenderedEquation !== equation) {
        this.lastRenderedEquation = equation;

        // Gleichung rendern und Bild speichern
        this.renderedImage = renderWithMathJax(latexEquation, "white"); // Kein Canvas hier notwendig

        setTimeout(() => {
          this.Pause = true;
        }, 100);
      }
      if (this.size[0] < this.renderedImage.width + 2 * this.offsetX) {
        this.size[0] = this.renderedImage.width + 2 * this.offsetX;
      }
      if (this.size[1] < this.renderedImage.height + 2 * this.offsetY) {
        this.size[1] = this.renderedImage.height + 2 * this.offsetY;
      }
    }

    onDrawForeground(ctx) {
         // Überprüfen, ob die Node "collapsed" ist
       if (this.flags && this.flags.collapsed) {
      return; // Zeichne nichts, wenn die Node collapsed ist
  }

      // Färbe den Eingang oder zeichne einen Kreis darum
      const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;

      // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
      const inputPosX = labelInputPosX;

      // Relativer y-Wert basierend auf Titelhöhe und Slot-Höhe
      const inputPosY = 0 * NODE_SLOT_HEIGHT + 14;

      // Parameter für die Trichterform
      const width = labelWidth; // Breite der Basis (linke Seite)
      const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)

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

      if (this.Pause == false) {
        return;
      }

      //console.log("this.renderedImage:", this.renderedImage);
      //console.log("Instance of Image:", this.renderedImage instanceof Image);
      //ctx.fillStyle = "#000FF0";
      //ctx.fillRect(0, 0, this.size[0], this.size[1]);
      ctx.drawImage(this.renderedImage, this.offsetX, this.offsetY);
    }

    toString(o) {
      if (o == null) {
        return "";
      } else if (!o["rightSide"] || o["rightSide"] == null) {
        return "Fehler";
      } else {
        let formulaForDisplay = o["rightSide"]
          .replace(/\*\*/g, "^") // Ersetzt Potenzierung zurück
          .replace(/Math\.sin/g, "sin ") // Ersetzt Sinus zurück
          .replace(/Math\.cos/g, "cos ") // Ersetzt Kosinus zurück
          .replace(/Math\.tan/g, "tan ") // Ersetzt Tangens zurück
          .replace(/Math\.sqrt/g, "sqrt ") // Ersetzt Quadratwurzel zurück
          .replace(/Math\.log10/g, "log ") // Ersetzt Logarithmus zur Basis 10 zurück
          .replace(/Math\.log\b/g, "ln ") // Ersetzt natürlicher Logarithmus zurück
          .replace(/Math\.exp/g, "exp ") // Ersetzt Exponentialfunktion zurück
          .replace(/Math\.abs\(([^()]*|\((?:[^()]*|\([^()]*\))*\))\)/g, "|$1|") // Absolutbetrag
          .replace(/Math\.PI/g, "pi ") // Math.PI durch π
          .replace(/Math\.E/g, "e"); // Math.E durch e

        return o["leftSide"] + " = " + formulaForDisplay; // Gib die Gleichung zurück
      }
    }
  };
}
