export function _CustomGraphicsPlot() {
  return class CustomGraphicsPlot {
    constructor() {
      // Füge vier Eingänge für vier verschiedene Funktionen hinzu
      this.addInput("", "object");
      this.addInput("", "object");
      this.addInput("", "object");
      this.addInput("", "object");

      // Standard-Eigenschaften und Skalierungsparameter
      this.properties = {
        xRangeValue: 10, // Der Wert des Knobs für die X-Achse
        yRangeValue: 10, // Der Wert des Knobs für die Y-Achse
        scaleX: 1, // Skalierung für X-Achse
        scaleY: 1, // Skalierung für Y-Achse
        gridSize: 2, // Abstand zwischen Gitternetzlinien
        discontinuityThreshold: 100, // Grenzwert für Diskontinuitäten
        margin: 30, // Randgröße für die linken, rechten und unteren Seiten
        marginTop: 80, // Spezielle Randgröße für den oberen Rand
        xRange: [-10, 10], // Standardwert für xRange
        yRange: [-10, 10], // Standardwert für yRange
        equations: ["", "", "", "", ""],
        uvNames: ["", "", "", "", ""],
        savedEquation: "",
        savedUV: "",
      };

      // Widgets für xRange und yRange als Knobs
      this.addWidget(
        "slider",
        "Zoom X-Richtung",
        this.properties.xRangeValue,
        (value) => {
          this.properties.xRangeValue =
            Math.round((value + Number.EPSILON) * 10) / 10;
          //const roundedValue = Math.round((parseFloat(this.properties["value"]) + Number.EPSILON) * 100) / 100;

          this.properties.xRange = [
            -this.properties.xRangeValue,
            this.properties.xRangeValue,
          ]; // Erstelle die symmetrische Range
          if (this.properties.xRangeValue >= this.properties.yRangeValue) {
            this.properties.gridSize = this.properties.xRangeValue / 10;
          }
        },
        { min: 0.1, max: 100, step: 0.1, precision: 1 }
      );

      this.addWidget(
        "slider",
        "Zoom Y-Richtung",
        this.properties.yRangeValue,
        (value) => {
          this.properties.yRangeValue =
            Math.round((value + Number.EPSILON) * 10) / 10;
          this.properties.yRange = [
            -this.properties.yRangeValue,
            this.properties.yRangeValue,
          ]; // Erstelle die symmetrische Range
          if (this.properties.yRangeValue >= this.properties.xRangeValue) {
            this.properties.gridSize = this.properties.yRangeValue / 10;
          }
        },
        { min: 0.1, max: 100, step: 0.1, precision: 1 }
      );

      this.widgets_start_y = 10; //Widgets sitzen neben ins

      // Node-Eigenschaften
      this.title = "Graph";
      this.desc = "Plots up to 4 mathematical functions with different colors";
      this.colors = ["#FFA", "#F99", "#9F9", "#99F","#FFFFFF"]; // Vier Farben für vier Funktionen
      this.size = [350, 380]; // Vergrößertes Plot-Fenster
      //this.collapsed = false;
      //this.color = "#CE8A53";
      this.color = fbNodesColor;
      //this.bgcolor = "#FFFFFF";
      this.bgcolor = "#000000";

      this.equations = []; // Array für die Gleichungen der vier Eingänge
      this.uvNames = []; // Array für die UV-Namen der vier Eingänge
    }

    // Funktion aus String evaluieren
    evaluateFunction(equation, uvValue, uvName) {
      try {
        const safeEquation = equation.replace("^", "**");
        const func = new Function(uvName, `return ${safeEquation};`);
        return func(uvValue);
      } catch (error) {
        //console.error("Fehler bei der Auswertung der Funktion:", error);
        return null;
      }
    }

    clamp(v, a, b) {
      return a > v ? a : b < v ? b : v;
    }



    onExecute() {
      this.equations = [];
      this.uvNames = [];

      // Überprüfe alle vier Eingänge
      for (let i = 0; i < 4; i++) {
        const inputData = this.getInputData(i);
        if (inputData) {
          const equation = inputData["rightSide"];
          const uvName = inputData["uvName"] || "x";

          if (equation) {
            this.equations[i] = equation;
            this.uvNames[i] = uvName;
            //if (this.equations[i]) { //Möglichkeit gespeicherte mit nicht neuen zu
            this.properties.uvNames[i] = this.uvNames[i];
            this.properties.equations[i] = this.equations[i];
            //}
          }
        } else {
          this.properties.uvNames[i] =  "";
          this.properties.equations[i] = "";
        }
      }
    }

    onDrawForeground(ctx) {
      if (this.flags && this.flags.collapsed) {
        return; // Zeichne nichts, wenn die Node collapsed ist
      }

      this.properties.equations[4] = this.properties.savedEquation;
      this.properties.uvNames[4] = this.properties.savedUV;

      // if (!this.inputs[0] ) {
      //   return;
      // }

      const size = this.size;
      const margin = this.properties.margin; // Rand links, rechts, unten
      const marginTop = this.properties.marginTop; // Spezielle Randgröße oben
      const xRange = this.properties.xRange || [-10, 10]; // Fallback-Werte für xRange
      const yRange = this.properties.yRange || [-10, 10]; // Fallback-Werte für yRange
      const scaleX = (size[0] - 2 * margin) / (xRange[1] - xRange[0]); // Skalierung der X-Achse
      const scaleY = (size[1] - margin - marginTop) / (yRange[1] - yRange[0]); // Skalierung der Y-Achse
      const offsetX = -xRange[0] * scaleX + margin; // Verschiebung auf der X-Achse
      const offsetY = size[1] - (-yRange[0] * scaleY + margin); // Verschiebung auf der Y-Achse

      // Input Labels:

      // Färbe den Eingang oder zeichne einen Kreis darum
      const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
      // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
      const inputPosX = labelInputPosX;
      const nodeWidth = this.size[0];
      const outputPosX = nodeWidth; // Rechter Rand der Node
      // Parameter für die Trichterform
      const width = labelWidth; // Breite der Basis (linke Seite)
      const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)

      const inputPosY = 0 * NODE_SLOT_HEIGHT + 14;

      // Hintergrund zeichnen
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, size[0], size[1]);

      // labels zeichnen
      for (let i = 0; i < 4; i++) {
        const inputPosY = i * NODE_SLOT_HEIGHT + 14;

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

      // Gitternetzlinien zeichnen
      this.drawGrid(ctx, size, scaleX, scaleY, offsetX, offsetY, marginTop);

      // Plotte jede Funktion in einer anderen Farbe
      for (let i = 0; i < this.properties.equations.length; i++) {
        const equation = this.properties.equations[i];
        const uvName = this.properties.uvNames[i];
        const color = this.colors[i];

        if (!equation || !uvName) {
          // Überspringe diese Funktion, wenn die Gleichung oder UV-Name ungültig sind
          continue;
        }

        ctx.strokeStyle = color;
        ctx.beginPath();

        let step = (xRange[1] - xRange[0]) / (size[0] - 2 * margin);
        let uvValue = xRange[0];
        let y = this.evaluateFunction(equation, uvValue, uvName);
        let previousY = y;

        if (y !== null) {
          let plotX = (uvValue - xRange[0]) * scaleX + margin;
          let plotY = (yRange[1] - y) * scaleY + marginTop;
          ctx.moveTo(
            this.clamp(plotX, margin, size[0] - margin),
            this.clamp(plotY, marginTop, size[1] - margin)
          );

          for (let j = 1; j < size[0] - 2 * margin; ++j) {
            uvValue += step;
            y = this.evaluateFunction(equation, uvValue, uvName);

            if (y === null) continue;

            plotX = (uvValue - xRange[0]) * scaleX + margin;
            plotY = (yRange[1] - y) * scaleY + marginTop;

            // Prüfe, ob der Punkt innerhalb des sichtbaren Bereichs liegt
            if (plotY >= marginTop && plotY <= size[1] - margin) {
              // Prüfe auf Diskontinuität anhand des Änderungswertes von y
              if (
                Math.abs(y - previousY) > this.properties.discontinuityThreshold
              ) {
                ctx.moveTo(
                  this.clamp(plotX, margin, size[0] - margin),
                  this.clamp(plotY, marginTop, size[1] - margin)
                );
              } else {
                // Zeichne Linie nur, wenn der aktuelle Punkt im sichtbaren Bereich ist
                ctx.lineTo(
                  this.clamp(plotX, margin, size[0] - margin),
                  this.clamp(plotY, marginTop, size[1] - margin)
                );
              }
            } else {
              // Beginne einen neuen Pfad, sobald die Funktion wieder im sichtbaren Bereich ist
              ctx.moveTo(
                this.clamp(plotX, margin, size[0] - margin),
                this.clamp(plotY, marginTop, size[1] - margin)
              );
            }

            previousY = y;
          }

          ctx.stroke();
        }
      }

      // Achsenbeschriftungen hinzufügen
      this.drawLabels(
        ctx,
        size,
        scaleX,
        scaleY,
        offsetX,
        offsetY,
        xRange,
        yRange,
        margin,
        marginTop
      );
    }

    // Gitternetzlinien zeichnen
    drawGrid(ctx, size, scaleX, scaleY, offsetX, offsetY, marginTop) {
      const margin = this.properties.margin;
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 0.5;

      const gridSize =
        this.properties.gridSize *
        Math.max(this.properties.scaleX, this.properties.scaleY); // Gitter passt sich der Skalierung an
      for (
        let x = Math.floor(this.properties.xRange[0] / gridSize) * gridSize;
        x <= this.properties.xRange[1];
        x += gridSize
      ) {
        const plotX = (x - this.properties.xRange[0]) * scaleX + margin;
        if (plotX >= margin && plotX <= size[0] - margin) {
          // Verhindert Zeichnen außerhalb des Bereichs
          ctx.beginPath();
          ctx.moveTo(plotX, marginTop);
          ctx.lineTo(plotX, size[1] - margin);
          ctx.stroke();
        }
      }

      for (
        let y = Math.floor(this.properties.yRange[0] / gridSize) * gridSize;
        y <= this.properties.yRange[1];
        y += gridSize
      ) {
        const plotY = (this.properties.yRange[1] - y) * scaleY + marginTop;
        if (plotY >= marginTop && plotY <= size[1] - margin) {
          // Verhindert Zeichnen außerhalb des Bereichs
          ctx.beginPath();
          ctx.moveTo(margin, plotY);
          ctx.lineTo(size[0] - margin, plotY);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 1.0;

      // X-Achse
      ctx.beginPath();
      ctx.moveTo(margin, offsetY);
      ctx.lineTo(size[0] - margin, offsetY);
      ctx.stroke();

      // Y-Achse
      ctx.beginPath();
      ctx.moveTo(offsetX, marginTop);
      ctx.lineTo(offsetX, size[1] - margin);
      ctx.stroke();
    }

    // Beschriftungen für Achsen und Gitternetzlinien
    drawLabels(
      ctx,
      size,
      scaleX,
      scaleY,
      offsetX,
      offsetY,
      xRange,
      yRange,
      margin,
      marginTop
    ) {
      ctx.fillStyle = "#FFF";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";

      const gridSize =
        this.properties.gridSize *
        Math.max(this.properties.scaleX, this.properties.scaleY);
      for (
        let x = Math.floor(xRange[0] / gridSize) * gridSize;
        x <= xRange[1];
        x += gridSize
      ) {
        const plotX = (x - xRange[0]) * scaleX + margin;
        if (plotX >= margin && plotX <= size[0] - margin) {
          // Nur Beschriftungen innerhalb des Bereichs
          if (
            Math.max(this.properties.xRangeValue, this.properties.yRangeValue) <
            10
          ) {
            ctx.fillText(x.toFixed(1), plotX, offsetY + 10);
          } else ctx.fillText(x.toFixed(0), plotX, offsetY + 10);
        }
      }

      ctx.textAlign = "right";
      for (
        let y = Math.floor(yRange[0] / gridSize) * gridSize;
        y <= yRange[1];
        y += gridSize
      ) {
        const plotY = (yRange[1] - y) * scaleY + marginTop;
        if (plotY >= marginTop && plotY <= size[1] - margin) {
          // Nur Beschriftungen innerhalb des Bereichs
          if (
            Math.max(this.properties.xRangeValue, this.properties.yRangeValue) <
            10
          ) {
            ctx.fillText(y.toFixed(1), offsetX - 5, plotY + 3);
          } else ctx.fillText(y.toFixed(0), offsetX - 5, plotY + 3);
        }
      }
    }
  };
}
