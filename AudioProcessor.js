
/**
 * AudioProcessor class extends AudioWorkletProcessor to process audio data.
 * It allows setting a custom function to generate audio samples and applies a fade-in effect.
 */
class AudioProcessor extends AudioWorkletProcessor {
    /**
     * Constructs an AudioProcessor instance.
     * Initializes time, sampleRate, func, fadeDuration, and fadeSamples.
     * Sets up a message handler to receive and process messages from the AudioNode.
     */
    constructor() {
        super();
        this.time = 0; // Zeitvariable für die Funktion
        this.sampleRate = sampleRate;
        this.func = 0; // Standard: keine Funktion gesetzt
        this.fadeDuration = 0.01; // Fade-In-Dauer in Sekunden
        this.fadeSamples = Math.floor(this.sampleRate * this.fadeDuration); // Anzahl der Samples für das Fade-In

        /**
         * Handles messages received from the AudioNode.
         * @param {MessageEvent} event - The message event containing data from the AudioNode.
         */
        this.port.onmessage = (event) => {
            if (event.data.type === 'setFunction') {
                try {
                    this.func = eval(`(${event.data.func})`);
                } catch (error) {
                    console.error("AudioProcessor: Fehler beim Setzen der Funktion", error);
                }
            } else if (event.data.type === 'start') {
                this.time = 0; // Zeitvariable zurücksetzen
            }
        };
    }

    /**
     * Processes audio data.
     * Generates audio samples using the set function, applies a fade-in effect, and limits the signal.
     * @param {Array} inputs - The input audio data.
     * @param {Array} outputs - The output audio data.
     * @returns {boolean} - Returns true to continue processing.
     */
    process(inputs, outputs) {
        const output = outputs[0][0];
        for (let i = 0; i < output.length; i++) {
            let value = this.func(this.time); // Funktionswert für das aktuelle Sample

            // Fade-In berechnen
            let fadeFactor = 1;
            if (this.time * this.sampleRate < this.fadeSamples) {
                fadeFactor = (this.time * this.sampleRate) / this.fadeSamples;
            }

            // Fade-In anwenden
            value *= fadeFactor;

            // Signal durch 25 teilen und begrenzen
            value = value / 25;
            value = Math.max(-1, Math.min(1, value));

            output[i] = value; 
            this.time += 1 / this.sampleRate; // Zeit für das nächste Sample erhöhen
        }
        return true; // Verarbeitung fortsetzen
    }
}

// Audio-Prozessor registrieren
registerProcessor('audio-processor', AudioProcessor);