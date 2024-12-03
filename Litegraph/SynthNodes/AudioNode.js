export function _AudioNode() {
    return class AudioNode {
        constructor() {

            this.properties = {
                FormulafromInput: "",
              };

            //this.color = "#CE8A53"; // Titelfarbe
            this.size = [107,200];
            this.color = fbNodesColor;
            this.bgcolor = bgColor2; // Hintergrundfarbe
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.context.suspend(); // Pausiere den AudioContext direkt nach der Erstellung
            this.isPlaying = false;

            

            // Füge den Eingabekanal für die Funktion hinzu
            this.addInput("function", "object");

            // Button zum Starten und Stoppen der Wiedergabe
            this.addWidget("button", "Start/Stop", "", () => {
                if (this.isPlaying) {
                    this.stop();
                } else {
                    this.start();
                }
            });

            this.title = "Audio";

           
                // Lade den AudioWorkletProcessor
              this.context.audioWorklet.addModule('AudioProcessor.js').then(() => {
              //console.log("AudioNode: AudioProcessor erfolgreich geladen");
              this.workletNode = new AudioWorkletNode(this.context, 'audio-processor');
              this.workletNode.connect(this.context.destination);
              this.context.suspend();
              //console.log("AudioNode: WorkletNode mit Audioausgang verbunden");
          }).catch((error) => {
              //console.error("AudioNode: Fehler beim Laden des AudioWorklet", error);
          });
               
          
        }

        // Funktion zum Verarbeiten der Eingabedaten
        onExecute() {
            const inputData = this.getInputData(0); // Hole die Eingabedaten

            if (inputData) {
                const formula = inputData["rightSide"];
                this.properties.FormulafromInput = inputData["rightSide"];
                const uvName = inputData["uvName"];
                //const uvValue = inputData["uvValue"];

                //console.log("AudioNode: Eingabedaten erhalten:", inputData);

                // Wenn die Formel oder UV sich geändert haben, erstelle eine neue Funktion
                if (formula && uvName) {
                    try {
                        const func = new Function(uvName, `return ${formula}`);
                        //console.log("AudioNode: Funktion erfolgreich ausgewertet");

                        // Sende die ausgewertete Funktion an den AudioProcessor
                        this.setFunction(func);
                    } catch (error) {
                        //console.error("AudioNode: Fehler beim Erstellen der Funktion", error);
                    }
                }
            } else {
                this.stop();
            }
        }

        // Funktion zum Setzen der zu berechnenden Funktion
        setFunction(func) {
            if (this.workletNode) {
                this.workletNode.port.postMessage({ type: 'setFunction', func: func.toString() });
                //console.log("AudioNode: Funktion an AudioProcessor gesendet");
            } else {
                //console.warn("AudioNode: WorkletNode ist noch nicht geladen");
            }
        }

        // Startet die Audiowiedergabe und ändert die Widget-Farbe zu Orange
        start() {
            this.context.resume().then(() => {
                this.isPlaying = true;
                this.bgcolor = fbNodesColor; // Orange, wenn Wiedergabe aktiv
        
                if (this.workletNode) {
                    this.workletNode.port.postMessage({ type: 'start' });
                }
        
                this.setDirtyCanvas(true); // Aktualisiere das Widget
            }).catch((error) => {
                console.error("AudioNode: Fehler beim Starten des AudioContext", error);
            });
        }

        // Stoppt die Audiowiedergabe und ändert die Widget-Farbe zu Schwarz
        stop() {
            this.context.suspend().then(() => {
                this.isPlaying = false;
                this.bgcolor = bgColor2 // grau, wenn Wiedergabe gestoppt
                //console.log("AudioNode: Audiowiedergabe gestoppt");
                this.setDirtyCanvas(true); // Aktualisiere das Widget
            }).catch((error) => {
                //console.error("AudioNode: Fehler beim Stoppen des AudioContext", error);
            });
        }

        // Aktualisiert die Hintergrundfarbe des Widgets, je nach Wiedergabestatus
        onDrawBackground(ctx) {
            this.bgcolor = this.isPlaying ? fbNodesColor : bgColor2; // Hintergrundfarbe des Widgets

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
            
        }
    };
}