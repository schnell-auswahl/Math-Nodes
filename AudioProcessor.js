class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.time = 0; // Zeitvariable für die Funktion
        this.sampleRate = sampleRate;
        this.func = 0; // Standard: keine Funktion gesetzt
        this.fadeDuration = 0.01; // Fade-In-Dauer in Sekunden
        this.fadeSamples = Math.floor(this.sampleRate * this.fadeDuration); // Anzahl der Samples für das Fade-In

        // Empfangene Nachrichten von der AudioNode verarbeiten
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