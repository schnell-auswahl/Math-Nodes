

// Graph speichern in datei


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


function loadGraphFromServerAsync(canvasId, jsonFilePath) {
    return new Promise((resolve, reject) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            return reject(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        }

        const graph = canvas.graph;
        if (!graph) {
            return reject(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
        }

        fetch(jsonFilePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Fehler beim Laden der JSON-Datei: ${response.statusText}`);
                }
                return response.json();
            })
            .then((json) => {
                try {
                    graph.stop();
                    graph.clear();
                    graph.configure(json);
                    graph.start();

                    console.log(`Graph von Canvas "${canvasId}" erfolgreich aus ${jsonFilePath} geladen.`);
                    resolve(); // Ladevorgang erfolgreich abgeschlossen
                } catch (error) {
                    reject(`Fehler beim Konfigurieren des Graphen: ${error.message}`);
                }
            })
            .catch((error) => {
                reject(`Fehler beim Laden der Datei "${jsonFilePath}": ${error.message}`);
            });
    });
}


async function loadAllGraphs() {
    const canvases = document.querySelectorAll('canvas[data-config-path]');
    const loadPromises = Array.from(canvases).map((canvas) => {
        const canvasId = canvas.id;
        const jsonFilePath = canvas.dataset.configPath;
        return loadGraphFromServerAsync(canvasId, jsonFilePath);
    });

    try {
        await Promise.all(loadPromises); // Warten, bis alle Graphen geladen sind
        console.log("Alle Graphen wurden erfolgreich geladen.");

        // Nodes anpassen, nachdem alle Graphen geladen sind
        canvases.forEach((canvas) => adjustNodePositions(canvas.id));
    } catch (error) {
        console.error("Fehler beim Laden eines oder mehrerer Graphen:", error);
    }
}

// Beim Laden der Seite ausführen
document.addEventListener("DOMContentLoaded", () => {
    loadAllGraphs();
});


//REsizinbg und positioning der Nodes und des canvas

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

// Node Positions
function adjustNodePositions(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    const graph = canvas.graph;
    if (!graph) {
        console.error(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
        return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const margin = 20; // Randgröße
    const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30; // Höhe des Titels

    // Ursprüngliche Positionen sammeln
    const nodePositions = graph._nodes.map((node) => ({
        node: node,
        x: node.pos[0],
        y: node.pos[1],
    }));

    // Überprüfen, ob alle Nodes innerhalb der Grenzen des Canvas sind
    const allNodesWithinCanvas = nodePositions.every(({ node, x, y }) => {
        const nodeWidth = node.size ? node.size[0] : 150; // Default-Breite des Nodes
        const nodeHeight = node.size ? node.size[1] : 100; // Default-Höhe des Nodes

        return (
            x >= margin &&
            x + nodeWidth <= canvasWidth - margin &&
            y >= margin + titleHeight &&
            y + nodeHeight <= canvasHeight - margin
        );
    });

    if (allNodesWithinCanvas) {
        console.log(`Alle Nodes befinden sich innerhalb des Canvas "${canvasId}". Keine Neupositionierung erforderlich.`);
        return; // Beende die Funktion, wenn alle Nodes innerhalb des Canvas sind
    }

    // Extremwerte finden
    const minX = Math.min(...nodePositions.map((pos) => pos.x));
    const maxX = Math.max(...nodePositions.map((pos) => pos.x));
    const minY = Math.min(...nodePositions.map((pos) => pos.y));
    const maxY = Math.max(...nodePositions.map((pos) => pos.y));

    // Debugging: Extremwerte anzeigen
    console.log(`Extremwerte: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);

    // Falls alle Nodes denselben Wert haben, Warnung ausgeben
    if (minX === maxX) {
        console.warn("Alle Nodes haben denselben x-Wert. Keine Skalierung entlang der X-Achse möglich.");
    }
    if (minY === maxY) {
        console.warn("Alle Nodes haben denselben y-Wert. Keine Skalierung entlang der Y-Achse möglich.");
    }

    // Nodes skalieren und verschieben
    nodePositions.forEach(({ node, x, y }) => {
        // Skaliere X-Wert auf den Canvas mit Berücksichtigung des Rands
        const newX =
            minX === maxX
                ? margin // Falls kein Abstand, setze alles auf den Rand
                : margin + ((x - minX) / (maxX - minX)) * (canvasWidth - 2 * margin - node.size[0]);

        // Skaliere Y-Wert auf den Canvas mit Berücksichtigung von Rand und Titelhöhe
        const newY =
            minY === maxY
                ? margin + titleHeight // Falls kein Abstand, setze alles auf den Rand unterhalb des Titels
                : margin + titleHeight + ((y - minY) / (maxY - minY)) * (canvasHeight - 2 * margin - titleHeight - node.size[1]);

        // Neue Position setzen
        node.pos[0] = newX;
        node.pos[1] = newY;

        console.log(`Node "${node.title}" verschoben: Neue Position (${newX}, ${newY})`);
    });

    console.log("Alle Nodes skaliert und verschoben.");
}

// Dynamisches Resizing für alle Canvas mit data-resize="true"
function adjustAllNodePositions() {
    // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
    const resizableCanvases = document.querySelectorAll('canvas[data-resize="true"]');

    // Resize-Funktion für jedes Canvas aufrufen
    resizableCanvases.forEach((canvas) => {
        adjustNodePositions(canvas.id);
    });
}

// Dynamisches Resizing für alle Canvas und Neupositionierung der Nodes
function adjustAllCanvasAndNodePositions() {
    // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
    const canvases = document.querySelectorAll('canvas[data-resize="true"]');

    // Für jedes Canvas die Größe und Node-Positionen anpassen
    canvases.forEach((canvas) => {
        adjustCanvasSize(canvas.id);
        adjustNodePositions(canvas.id);
    });
}


// Beim Laden der Seite die Canvas-Größen und node positionsinitial anpassen
document.addEventListener("DOMContentLoaded", () => {
    adjustAllCanvasAndNodePositions(); // Initial aufrufen

    // Event Listener für Fensteränderungen hinzufügen
    window.addEventListener("resize", adjustAllCanvasAndNodePositions);
});


document.addEventListener("DOMContentLoaded", () => {
    // Button auswählen
    const button = document.getElementById("adjustNodesButton");

    // Event-Listener hinzufügen
    button.addEventListener("click", () => {
        // Alle Canvas-Elemente mit Graphen auswählen
        const canvases = document.querySelectorAll('canvas[data-resize="true"]');

        // Für jeden Canvas adjustNodePositions aufrufen
        canvases.forEach((canvas) => {
            const canvasId = canvas.id; // ID des Canvas
            adjustNodePositions(canvasId); // Funktion ausführen
            console.log(`adjustNodePositions für Canvas "${canvasId}" ausgeführt.`);
        });

        console.log("Alle Graphen auf der Seite wurden bearbeitet.");
    });
});