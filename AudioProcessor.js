class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.time = 0; // Zeitvariable für die Funktion
        this.sampleRate = sampleRate;
        this.func = 0; // Standard: keine Funktion gesetzt

        // Empfangene Nachrichten von der AudioNode verarbeiten
        this.port.onmessage = (event) => {
            if (event.data.type === 'setFunction') {
                // Funktion aktualisieren
                try {
                    this.func = eval(`(${event.data.func})`);
                } catch (error) {
                    console.error("AudioProcessor: Fehler beim Setzen der Funktion", error);
                }
            } else if (event.data.type === 'start') {
                // Zeitvariable zurücksetzen
                this.time = 0;
            }
        };
    }

    process(inputs, outputs) {
        const output = outputs[0][0];
        for (let i = 0; i < output.length; i++) {
            let value = this.func(this.time); // Funktionswert für das aktuelle Sample
            
            // Signal durch 25 teilen
            value = value / 25;
            
            // Begrenzen des Wertes auf den Bereich [-1, 1]
            value = Math.max(-1, Math.min(1, value));
        
            output[i] = value; 
            this.time += 1 / this.sampleRate; // Zeit für das nächste Sample erhöhen
        }
        return true; // Verarbeitung fortsetzen
    }
}

// Audio-Prozessor registrieren
registerProcessor('audio-processor', AudioProcessor);