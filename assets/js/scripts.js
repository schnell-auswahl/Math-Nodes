// Dynamisches Resizing des Canvas
function adjustCanvasSize() {
    const canvas = document.getElementById("graphDiv");
    const minWidth = 1000;
    const browserWidth = window.innerWidth;
    const canvasWidth = Math.max(browserWidth, minWidth);

    canvas.width = canvasWidth;
}

// Initial aufrufen
adjustCanvasSize();

// Event Listener für Fensteränderungen
window.addEventListener("resize", adjustCanvasSize);

// Funktion zum Speichern des Graphen in eine Datei
function saveGraphToFile() {
    const graphData = graph.serialize(); // graph ist dein LGraph-Objekt
    const dataStr = JSON.stringify(graphData);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "graph_config.json"; // Name der Datei
    a.click();
    URL.revokeObjectURL(url);
}

// Funktion zum Laden des Graphen aus einer Datei
function loadGraphFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const json = JSON.parse(e.target.result);

                    // Graph zurücksetzen
                    graph.stop(); // stoppe laufende Prozesse
                    graph.clear(); // lösche existierende Daten

                    // Graph neu konfigurieren
                    graph.configure(json);

                    // Graph starten
                    graph.start();

                    console.log("Graph erfolgreich geladen und aktualisiert!");
                } catch (error) {
                    console.error("Fehler beim Laden des Graphen:", error);
                    alert("Die Datei konnte nicht geladen werden. Bitte stelle sicher, dass es sich um eine gültige Graph-Konfigurationsdatei handelt.");
                }
            };
            reader.readAsText(file);
        }
    });

    input.click();
}

// Funktion zum Laden des Graphen aus einer Datei über einen Pfad
function loadGraphFromPath(jsonFilePath) {
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fehler beim Laden der JSON-Datei: ${response.statusText}`);
            }
            return response.json();
        })
        .then(json => {
            try {
                // Graph zurücksetzen
                graph.stop(); // stoppe laufende Prozesse
                graph.clear(); // lösche existierende Daten

                // Graph neu konfigurieren
                graph.configure(json);

                // Graph starten
                graph.start();

                console.log(`Graph erfolgreich aus ${jsonFilePath} geladen und aktualisiert!`);
            } catch (error) {
                console.error("Fehler beim Konfigurieren des Graphen:", error);
                alert("Die Graph-Konfiguration konnte nicht geladen werden.");
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Datei:", error);
        });
}