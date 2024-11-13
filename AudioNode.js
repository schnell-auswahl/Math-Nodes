export function _AudioNode() {
    return class AudioNode {
        constructor() {
            console.log("AudioNode: Konstruktor aufgerufen");
            
            this.color = "#CE8A53"; //Titelfarbe
            this.bgcolor = "#FFFFFF"; //Hintergrundfarbe
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.isPlaying = false;

            // Lade den AudioWorkletProcessor
            this.context.audioWorklet.addModule('AudioProcessor.js').then(() => {
                console.log("AudioNode: AudioProcessor erfolgreich geladen");
                this.workletNode = new AudioWorkletNode(this.context, 'audio-processor');
                this.workletNode.connect(this.context.destination);
                console.log("AudioNode: WorkletNode mit Audioausgang verbunden");
            }).catch((error) => {
                console.error("AudioNode: Fehler beim Laden des AudioWorklet", error);
            });

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

            this.title = "Audio Node";
        }

        // Funktion zum Verarbeiten der Eingabedaten
        onExecute() {
            const inputData = this.getInputData(0); // Hole die Eingabedaten

            if (inputData) {
                const formula = inputData["rightSide"];
                const uvName = inputData["uvName"];
                const uvValue = inputData["uvValue"];

                console.log("AudioNode: Eingabedaten erhalten:", inputData);

                // Wenn die Formel oder UV sich geändert haben, erstelle eine neue Funktion
                if (formula && uvName) {
                    try {
                        const func = new Function(uvName, `return ${formula}`);
                        console.log("AudioNode: Funktion erfolgreich ausgewertet");

                        // Sende die ausgewertete Funktion an den AudioProcessor
                        this.setFunction(func);
                    } catch (error) {
                        console.error("AudioNode: Fehler beim Erstellen der Funktion", error);
                    }
                }
            }
        }

        // Funktion zum Setzen der zu berechnenden Funktion
        setFunction(func) {
            if (this.workletNode) {
                this.workletNode.port.postMessage({ type: 'setFunction', func: func.toString() });
                console.log("AudioNode: Funktion an AudioProcessor gesendet");
            } else {
                console.warn("AudioNode: WorkletNode ist noch nicht geladen");
            }
        }

        // Startet die Audiowiedergabe
        start() {
            this.context.resume().then(() => {
                this.isPlaying = true;
                console.log("AudioNode: Audiowiedergabe gestartet");
            }).catch((error) => {
                console.error("AudioNode: Fehler beim Starten des AudioContext", error);
            });
        }

        // Stoppt die Audiowiedergabe
        stop() {
            this.context.suspend().then(() => {
                this.isPlaying = false;
                console.log("AudioNode: Audiowiedergabe gestoppt");
            }).catch((error) => {
                console.error("AudioNode: Fehler beim Stoppen des AudioContext", error);
            });
        }
    };
}