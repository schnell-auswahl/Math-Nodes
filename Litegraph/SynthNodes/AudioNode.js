
export function _AudioNode() {
  return class AudioNode {
    constructor() {
      this.properties = {
        FormulafromInput: "",
      };

      //this.color = "#CE8A53"; // Titelfarbe
      this.size = [107, 200];
      this.color = fbNodesColor;
      this.bgcolor = bgColor2; // Hintergrundfarbe
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.context.suspend(); // Pausiere den AudioContext direkt nach der Erstellung
      this.isPlaying = false;
      this.animationOn = false;
      this.mute = true;
      this.lastLogTime = 0; // Klassenvariable für das letzte Log
      this.savedUVValue = 0;
      this.uvValue = 0;

      // Füge den Eingabekanal für die Funktion hinzu
      this.addInput("", "object");

      // Button zum Starten und Stoppen der Wiedergabe
      this.addWidget("button", "Ton Ein/Aus", "", () => {
        this.mute = !this.mute; // Umschalten zwischen true und false
        console.log("mute ist ", this.mute);
        // Visuelles Feedback
        if (this.mute) {
          this.bgcolor = bgColor2; //
        } else {
          this.bgcolor = fbNodesColor; //
          this.savedUVValue = this.uvValue;
        }

        this.setDirtyCanvas(true); // Aktualisiere das Widget
      });

      this.title = "Audio";

      // Lade den AudioWorkletProcessor
      this.context.audioWorklet
        .addModule("Litegraph/SynthNodes/AudioProcessor.js") 
        .then(() => {
          //console.log("AudioNode: AudioProcessor erfolgreich geladen");
          this.workletNode = new AudioWorkletNode(
            this.context,
            "audio-processor"
          );
          this.workletNode.connect(this.context.destination);
          this.context.suspend();
          //console.log("AudioNode: WorkletNode mit Audioausgang verbunden");
        })
        .catch((error) => {
          //console.error("AudioNode: Fehler beim Laden des AudioWorklet", error);
        });
    }

    // Funktion zum Verarbeiten der Eingabedaten
    onExecute() {
      let inputData = this.getInputData(0); // Hole die Eingabedaten

      if (inputData) {
        let formula = inputData["rightSide"];
        this.properties.FormulafromInput = inputData["rightSide"];
        let uvName = inputData["uvName"];
        let value = inputData["value"];
        this.uvValue = inputData["uvValue"];
        this.animationOn = inputData["animationOn"];
        //let savedUVValue = 0;

        if (!this.animationOn) {
          this.savedUVValue = this.uvValue;
        }

        //const uvValue = inputData["uvValue"]

        //console.log(this.adjustColor("#FF0000","#0000FF",value));
        //console.log(value);

        this.inputs[0].color_off = "#000000";
        this.inputs[0].color_on = adjustColor("#00FF00", "#FF0000", value);

        //console.log("AudioNode: Eingabedaten erhalten:", inputData);

        // Wenn die Formel oder UV sich geändert haben, erstelle eine neue Funktion

        if (formula && uvName) {
          try {
            let shiftedFormula = `${formula}`.replace(
              new RegExp(`\\b${uvName}\\b`, "g"),
              `(${uvName} + ${this.savedUVValue})`
            );
            let shiftedFunc = new Function(uvName, `return ${shiftedFormula};`);

            // Nur loggen, wenn 2 Sekunden vergangen sind
            // let currentTime = Date.now();
            // if (currentTime - this.lastLogTime >= 2000) {
            //   console.log(
            //     "formel " + shiftedFormula + " function " + shiftedFunc
            //   );
            //   this.lastLogTime = currentTime; // Aktualisiere den letzten Log-Zeitpunkt
            // }

            this.setFunction(shiftedFunc);
          } catch (error) {
            console.error(
              "AudioNode: Fehler beim Erstellen der verschobenen Funktion",
              error
            );
          }
        }

        if (this.animationOn && !this.isPlaying && !this.mute) {
          this.start();
        } else if (!this.animationOn && this.isPlaying) {
          this.stop();
        } else if (this.mute) {
          this.stop();
        }
      } else {
        this.stop();
      }
    }

    // Funktion zum Setzen der zu berechnenden Funktion
    setFunction(func) {
      if (this.workletNode) {
        const funcString = func.toString();
        this.workletNode.port.postMessage({
          type: "setFunction",
          func: funcString,
        });
        //console.log("Gesendete Funktion:", funcString , "evaluierte Funktion", eval(`(${funcString})`));
      } else {
        console.warn("AudioNode: WorkletNode ist noch nicht geladen");
      }
    }

    // Startet die Audiowiedergabe und ändert die Widget-Farbe zu Orange
    start() {
      this.context
        .resume()
        .then(() => {
          this.isPlaying = true;
          //this.bgcolor = fbNodesColor; // Orange, wenn Wiedergabe aktiv

          if (this.workletNode) {
            this.workletNode.port.postMessage({ type: "start" });
          }

          //this.setDirtyCanvas(true); // Aktualisiere das Widget
        })
        .catch((error) => {
          console.error(
            "AudioNode: Fehler beim Starten des AudioContext",
            error
          );
        });
    }

    // Stoppt die Audiowiedergabe und ändert die Widget-Farbe zu Schwarz
    stop() {
      this.context
        .suspend()
        .then(() => {
          this.isPlaying = false;
          //this.bgcolor = bgColor2; // grau, wenn Wiedergabe gestoppt
          //console.log("AudioNode: Audiowiedergabe gestoppt");
          //this.setDirtyCanvas(true); // Aktualisiere das Widget
        })
        .catch((error) => {
          //console.error("AudioNode: Fehler beim Stoppen des AudioContext", error);
        });
    }

    // Aktualisiert die Hintergrundfarbe des Widgets, je nach Wiedergabestatus
    onDrawForeground(ctx) {
      // Überprüfen, ob die Node "collapsed" ist
      if (this.flags && this.flags.collapsed) {
        return; // Zeichne nichts, wenn die Node collapsed ist
      }
      //this.bgcolor = this.isPlaying ? fbNodesColor : bgColor2; // Hintergrundfarbe des Widgets

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
    }
  };
}
