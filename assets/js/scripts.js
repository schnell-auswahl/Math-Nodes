// Dynamisches Resizing eines spezifischen Canvas
function adjustCanvasSize(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    const minWidth = 1000; // Mindestbreite des Canvas
    const browserWidth = window.innerWidth; // Breite des Browsers
    const parent = canvas.parentElement;
    const forceheight = parseFloat(canvas.getAttribute('forceheight')); 

    canvas.width = parent.clientWidth;
    if (forceheight) {
        canvas.height = forceheight;
    } else {
    canvas.height = parent.clientHeight;
    }


    // Berechne die neue Breite, mindestens jedoch die Mindestbreite
    const canvasWidth = //Math.max(browserWidth, minWidth); // 80% der Browserbreite oder mindestens 1000px
    //canvas.width = canvasWidth * widthPart;

    // Optional: Höhe setzen (z. B. 16:9-Seitenverhältnis)
    //const aspectRatio = 16 / 9;
    //canvas.height = canvasWidth / aspectRatio;

    console.log(`Canvas "${canvasId}" angepasst: Breite ${canvas.width}px, Höhe ${canvas.height}px`);
}

// Dynamisches Resizing für alle Canvas mit data-resize="true"
function adjustAllCanvasSizes() {
    // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
    const resizableCanvases = document.querySelectorAll('canvas[data-resize="true"]');

    // Resize-Funktion für jedes Canvas aufrufen
    resizableCanvases.forEach((canvas) => {
        adjustCanvasSize(canvas.id);
    });
}

// Beim Laden der Seite die Canvas-Größen initial anpassen
document.addEventListener("DOMContentLoaded", () => {
    adjustAllCanvasSizes(); // Initial aufrufen

    // Event Listener für Fensteränderungen hinzufügen
    window.addEventListener("resize", adjustAllCanvasSizes);
});


function saveGraphToFile(canvasId) {
    const canvas = document.getElementById(canvasId); // Canvas über ID holen
    if (!canvas) {
        alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    const graph = canvas.graph; // LGraph-Objekt vom Canvas
    if (!graph) {
        alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
        return;
    }

    const graphData = graph.serialize(); // Graph serialisieren
    const dataStr = JSON.stringify(graphData);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${canvasId}_graph_config.json`; // Datei benennen
    a.click();
    URL.revokeObjectURL(url);

    console.log(`Graph von Canvas "${canvasId}" wurde gespeichert.`);
}


function loadGraphFromFile(canvasId) {
    const canvas = document.getElementById(canvasId); // Canvas über ID holen
    if (!canvas) {
        alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    const graph = canvas.graph; // LGraph-Objekt vom Canvas
    if (!graph) {
        alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
        return;
    }

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

                    // Graph aktualisieren
                    graph.stop();
                    graph.clear();
                    graph.configure(json);
                    graph.start();

                    console.log(`Graph von Canvas "${canvasId}" wurde erfolgreich geladen.`);
                } catch (error) {
                    console.error("Fehler beim Laden des Graphen:", error);
                    alert("Ungültige Datei. Bitte überprüfe das JSON-Format.");
                }
            };
            reader.readAsText(file);
        }
    });

    input.click();
}


// Funktion zum Laden des Graphen aus einer Datei über einen Pfad
function loadGraphFromServer(canvasId, jsonFilePath) {
    const canvas = document.getElementById(canvasId); // Canvas über ID holen
    if (!canvas) {
        console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    const graph = canvas.graph; // LGraph-Objekt vom Canvas
    if (!graph) {
        console.error(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
        return;
    }

    fetch(jsonFilePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Fehler beim Laden der JSON-Datei: ${response.statusText}`);
            }
            return response.json(); // JSON-Daten parsen
        })
        .then((json) => {
            try {
                // Graph zurücksetzen
                graph.stop(); // Stoppe laufende Prozesse
                graph.clear(); // Lösche existierende Daten

                // Graph neu konfigurieren
                graph.configure(json);

                // Graph starten
                graph.start();

                console.log(`Graph von Canvas "${canvasId}" erfolgreich aus ${jsonFilePath} geladen und aktualisiert.`);
            } catch (error) {
                console.error("Fehler beim Konfigurieren des Graphen:", error);
                alert("Die Graph-Konfiguration konnte nicht geladen werden.");
            }
        })
        .catch((error) => {
            console.error(`Fehler beim Laden der Datei "${jsonFilePath}":`, error);
        });
}

function loadAllGraphs() {
    // Alle Canvas-Elemente mit einer Datenkonfiguration auswählen
    const canvases = document.querySelectorAll('canvas[data-config-path]');

    canvases.forEach((canvas) => {
        const canvasId = canvas.id;
        const jsonFilePath = canvas.dataset.configPath; // Pfad aus data-config-path
        loadGraphFromServer(canvasId, jsonFilePath); // Graph laden
    });
}

// Beim Laden der Seite ausführen
document.addEventListener("DOMContentLoaded", () => {
    loadAllGraphs();
});