export function _CustomGraphicsPlot(){
    return (
      class CustomGraphicsPlot {
        constructor(){
          this.addInput("Input", "object");  // Eingang für Funktionsgleichung (als String)
          
          // Skalierung und Bereich
          this.properties = { 
            xRange: [-10, 10],  // X-Bereich
            yRange: [-10, 10],  // Y-Bereich
            scaleX: 1,          // Skalierung für X-Achse
            scaleY: 1,          // Skalierung für Y-Achse
            gridSize: 5         // Abstand zwischen Gitternetzlinien
          };
  
          this.title = "Function Plot with Grid";
          this.desc = "Plots a mathematical function with grid and labels";
          this.colors = ["#FFA", "#F99"];
          this.size = [250, 250];
          this.color = "#CE8A53"; //Titelfarbe
          this.bgcolor = "#FFFFFF"; //Hintergrundfarbe

        }
  
        // Funktion aus String evaluieren
        evaluateFunction(equation, x) {
          try {
            const safeEquation = equation.replace("^", "**");  // Konvertiere Potenzen
            const func = new Function("x", `return ${safeEquation};`);  // Funktionsausdruck in JS-Function konvertieren
            return func(x);  // Evaluiere Funktion für gegebenen X-Wert
          } catch (error) {
            console.error("Fehler bei der Auswertung der Funktion:", error);
            return null;
          }
        }
  
        clamp(v, a, b) {
          return a > v ? a : b < v ? b : v;
        };
  
        onExecute = function() {
          if (this.flags.collapsed || !this.getInputData(0)) {
              return;
          }
  
          // Hole die Funktionsgleichung aus dem Eingang
          var equation = this.getInputData(0)["rightSide"];  // Funktionsgleichung als String
          
          // Falls keine Gleichung eingegeben wurde, nicht weiter ausführen
          if (!equation) return;
          
          this.equation = equation;  // Speichere die übergebene Gleichung
        };
  
        onDrawBackground = function(ctx) {
          if (this.flags.collapsed || !this.equation) {
              return;
          }
  
          var size = this.size;
          var xRange = this.properties.xRange;
          var yRange = this.properties.yRange;
          var scaleX = size[0] / (xRange[1] - xRange[0]);  // Skalierung der X-Achse basierend auf dem Bereich
          var scaleY = size[1] / (yRange[1] - yRange[0]);  // Skalierung der Y-Achse
          var offsetX = -xRange[0] * scaleX;  // Verschiebung auf der X-Achse
          var offsetY = size[1] - (-yRange[0] * scaleY);  // Verschiebung auf der Y-Achse
  
          // Hintergrund zeichnen
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, size[0], size[1]);
  
          // Gitternetzlinien zeichnen
          this.drawGrid(ctx, size, scaleX, scaleY, offsetX, offsetY);
  
          // Funktionswerte berechnen und plotten
          ctx.strokeStyle = this.colors[1];  // Farbe der Linie
          ctx.beginPath();
  
          // Starte bei minimalem X-Wert
          var step = (xRange[1] - xRange[0]) / size[0];  // Schrittweite entlang der X-Achse
          var x = xRange[0];
          var y = this.evaluateFunction(this.equation, x);  // Evaluiere Funktion
  
          if (y !== null) {
            var plotX = (x - xRange[0]) * scaleX;  // X-Koordinate im Plot
            var plotY = (yRange[1] - y) * scaleY;  // Y-Koordinate im Plot
            ctx.moveTo(this.clamp(plotX, 0, size[0]), this.clamp(plotY, 0, size[1]));  // Starte den Plot bei diesem Punkt
  
            // Schleife durch alle X-Werte im Plotbereich
            for (var i = 1; i < size[0]; ++i) {
              x += step;  // Erhöhe X
              y = this.evaluateFunction(this.equation, x);  // Evaluiere Y für neues X
              if (y === null) continue;
  
              plotX = (x - xRange[0]) * scaleX;
              plotY = (yRange[1] - y) * scaleY;
              ctx.lineTo(this.clamp(plotX, 0, size[0]), this.clamp(plotY, 0, size[1]));
            }
  
            ctx.stroke();
          }
  
          // Achsenbeschriftungen hinzufügen
          this.drawLabels(ctx, size, scaleX, scaleY, offsetX, offsetY, xRange, yRange);
        };
  
        // Gitternetzlinien zeichnen
        drawGrid(ctx, size, scaleX, scaleY, offsetX, offsetY) {
          ctx.strokeStyle = "#555";
          ctx.lineWidth = 0.5;
  
          // Vertikale Linien für X
          var gridSize = this.properties.gridSize;
          for (var x = Math.floor(this.properties.xRange[0] / gridSize) * gridSize; x <= this.properties.xRange[1]; x += gridSize) {
            var plotX = (x - this.properties.xRange[0]) * scaleX;
            ctx.beginPath();
            ctx.moveTo(plotX, 0);
            ctx.lineTo(plotX, size[1]);
            ctx.stroke();
          }
  
          // Horizontale Linien für Y
          for (var y = Math.floor(this.properties.yRange[0] / gridSize) * gridSize; y <= this.properties.yRange[1]; y += gridSize) {
            var plotY = (this.properties.yRange[1] - y) * scaleY;
            ctx.beginPath();
            ctx.moveTo(0, plotY);
            ctx.lineTo(size[0], plotY);
            ctx.stroke();
          }
  
          // Achsen (X=0 und Y=0) betonen
          ctx.strokeStyle = "#FFF";
          ctx.lineWidth = 1.0;
  
          // X-Achse
          ctx.beginPath();
          ctx.moveTo(0, offsetY);
          ctx.lineTo(size[0], offsetY);
          ctx.stroke();
  
          // Y-Achse
          ctx.beginPath();
          ctx.moveTo(offsetX, 0);
          ctx.lineTo(offsetX, size[1]);
          ctx.stroke();
        }
  
        // Beschriftungen für Achsen und Gitternetzlinien
        drawLabels(ctx, size, scaleX, scaleY, offsetX, offsetY, xRange, yRange) {
          ctx.fillStyle = "#FFF";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
  
          // X-Achse beschriften
          var gridSize = this.properties.gridSize;
          for (var x = Math.floor(xRange[0] / gridSize) * gridSize; x <= xRange[1]; x += gridSize) {
            var plotX = (x - xRange[0]) * scaleX;
            ctx.fillText(x.toFixed(1), plotX, offsetY + 10);
          }
  
          // Y-Achse beschriften
          ctx.textAlign = "right";
          for (var y = Math.floor(yRange[0] / gridSize) * gridSize; y <= yRange[1]; y += gridSize) {
            var plotY = (yRange[1] - y) * scaleY;
            ctx.fillText(y.toFixed(1), offsetX - 5, plotY + 3);
          }
        }
      }
    );
  }
  