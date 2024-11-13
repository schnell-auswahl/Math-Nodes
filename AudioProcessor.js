class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        console.log("AudioProcessor: Konstruktor aufgerufen"); // Log beim Initialisieren
        this.time = 0; // Zeitvariable für die Funktion
        this.sampleRate = sampleRate;

        // Standardfunktion: Sinuswelle mit 440 Hz
        this.func = (t) => Math.sin(440 * 2 * Math.PI * t);

        // Empfangene Funktion ändern
        this.port.onmessage = (event) => {
            if (event.data.type === 'setFunction') {
                console.log("AudioProcessor: Neue Funktion erhalten");
                // Erhalte die Funktion und evaluiere sie
                try {
                    this.func = eval(`(${event.data.func})`);
                    console.log("AudioProcessor: Funktion erfolgreich gesetzt");
                } catch (error) {
                    console.error("AudioProcessor: Fehler beim Setzen der Funktion", error);
                }
            }
        };
    }

    process(inputs, outputs) {
        const output = outputs[0][0];
        for (let i = 0; i < output.length; i++) {
            output[i] = this.func(this.time); // Funktionswert für das aktuelle Sample
            this.time += 1 / this.sampleRate; // Zeit erhöhen für das nächste Sample
        }
        console.log("AudioProcessor: Audiobuffer berechnet"); // Log für jeden Audiobuffer
        return true; // Verarbeitung fortsetzen
    }
}

// Audio-Prozessor registrieren
console.log("AudioProcessor: Registrierung gestartet");
registerProcessor('audio-processor', AudioProcessor);
console.log("AudioProcessor: Registrierung abgeschlossen");