export function _CustWatchNodeString() {
  return class CustWatchNodeString {
    constructor() {
      this.color = fbNodesColor;
      this.bgcolor = bgColor2;

      this.addInput("value", 0, { label: "" });
      this.inputData = 0;

      // neu: separate gerenderte Bilder
      this.renderedImageInput = null;
      this.renderedImageSaved = null;

      this.title = "Gleichung";
      this.desc = "Show Equation of input";

      this.offsetX = 20;
      this.offsetY = 20;

      this.properties = {
        GleichungvorMathJax: "",
        GleichungvorKaTex: "",
        savedEquation: "",
      };

      this.size = [160, 65];
    }

    onExecute() {
      this.inputs[0].color_off = "#000000";

      // Input übernehmen oder aus savedEquation nutzen
      let inputEquation = null;
      if (this.getInputData(0)) {
        this.inputData = this.getInputData(0);
        this.inputs[0].color_on = adjustColor(
          "#00FF00",
          "#FF0000",
          this.inputData["value"]
        );
        inputEquation = this.toString(this.inputData);
      }

      function sanitizeEquation(equation) {
        const allowedCharacters = /^[0-9a-zA-Z+\-*/^()= ]*$/;
        return equation
          .split("")
          .filter((char) => allowedCharacters.test(char))
          .join("");
      }

      let savedEquation = this.properties.savedEquation
        ? sanitizeEquation(this.properties.savedEquation)
        : "";

      // Latex aus Input
      let latexInput = inputEquation ? convertToLatex(inputEquation) : null;
      // Latex aus Saved
      let latexSaved = savedEquation ? convertToLatex(savedEquation) : null;

      // Kombinierte Abfrage zum Erkennen von Änderungen
      let combinedEquation =
        (inputEquation || "") + "||" + (savedEquation || "");
      // Prüfen, ob die Gleichung sich geändert hat
      if (this.lastRenderedEquation !== combinedEquation) {
        this.lastRenderedEquation = combinedEquation;

        // Neue Bilder nur dann rendern
        this.renderedImageInput = inputEquation
          ? renderWithMathJax(latexInput, "white")
          : null;
        this.renderedImageSaved = savedEquation
          ? renderWithMathJax(latexSaved, "#ccc")
          : null;
      }

      // Node-Größe anpassen
      let widthNeeded = 0;
      let heightNeeded = 0;
      if (this.renderedImageInput) {
        widthNeeded = Math.max(widthNeeded, this.renderedImageInput.width);
        heightNeeded += this.renderedImageInput.height;
      }
      if (this.renderedImageInput && this.renderedImageSaved) {
        heightNeeded += 10;
      }
      if (this.renderedImageSaved) {
        widthNeeded = Math.max(widthNeeded, this.renderedImageSaved.width);
        heightNeeded += this.renderedImageSaved.height;
      }
      this.size[0] = Math.max(this.size[0], widthNeeded + 2 * this.offsetX);
      this.size[1] = Math.max(this.size[1], heightNeeded + 2 * this.offsetY);

     
      // Box-Farbe abhängig von Gleichheit setzen
      if (
        inputEquation &&
        this.properties.savedEquation &&
        inputEquation.includes("=") &&
        this.properties.savedEquation.includes("=")
      ) {
        if (
          this.properties.savedEquation.split("=")[1].replace(/\s+/g, '') == inputEquation.split("=")[1].replace(/\s+/g, '')
        ) {
          this.boxcolor = "#00FF00";
        } else {
          this.boxcolor = null;
        }
      } 
    }

    onDrawForeground(ctx) {
      if (this.flags && this.flags.collapsed) {
        return;
      }

      // Trichter am Input
      const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
      const inputPosX = labelInputPosX;
      const inputPosY = 0 * NODE_SLOT_HEIGHT + 14;
      const width = labelWidth;
      const height = labelHeight;
      ctx.beginPath();
      ctx.moveTo(0, inputPosY - height / 2);
      ctx.lineTo(inputPosX, inputPosY - height / 2);
      ctx.arc(inputPosX, inputPosY, height / 2, 0, 2 * Math.PI);
      ctx.lineTo(inputPosX, inputPosY + height / 2);
      ctx.lineTo(0, inputPosY + height / 2);
      ctx.closePath();
      ctx.fillStyle = inLabelsColor;
      ctx.fill();

      let currentY = this.offsetY;

      // Input-Plot
      if (this.renderedImageInput) {
        ctx.drawImage(this.renderedImageInput, this.offsetX, currentY);
        currentY += this.renderedImageInput.height;
      }

      // nur Linie ziehen, wenn beide existieren
      if (this.renderedImageInput && this.renderedImageSaved) {
        currentY += 10; // kleiner Abstand
        ctx.beginPath();
        ctx.moveTo(this.offsetX, currentY);
        ctx.lineTo(
          this.offsetX + (this.renderedImageInput.width || 100),
          currentY
        );
        ctx.strokeStyle = "#999";
        ctx.stroke();
        currentY += 10;
      }

      // Gespeicherte Gleichung
      if (this.renderedImageSaved) {
        ctx.drawImage(this.renderedImageSaved, this.offsetX, currentY);
      }
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
          .replace(/Math\.exp/g, "e^") // Ersetzt Exponentialfunktion zurück
          .replace(/Math\.abs\(([^()]*|\((?:[^()]*|\([^()]*\))*\))\)/g, "|$1|") // Absolutbetrag
          .replace(/Math\.PI/g, "pi ") // Math.PI durch π
          .replace(/Math\.E/g, "e"); // Math.E durch e

        return o["leftSide"] + " = " + formulaForDisplay; // Gib die Gleichung zurück
      }
    }
  };
}
