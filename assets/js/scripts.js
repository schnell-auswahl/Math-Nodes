

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

    //console.log(`Graph von Canvas "${canvasId}" wurde gespeichert.`);
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

                    autoPositionNodes(canvas.id);

                    //console.log(`Graph von Canvas "${canvasId}" wurde erfolgreich geladen.`);
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


                    //console.log(`Graph von Canvas "${canvasId}" erfolgreich aus ${jsonFilePath} geladen.`);
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

function clearGraph(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        //alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    const graph = canvas.graph;
    if (!graph) {
        //alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
        return;
    }

    graph.clear(); // Graph löschen
    //alert(`Graph von Canvas "${canvasId}" wurde geleert.`);
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
        //console.log("Alle Graphen wurden erfolgreich geladen.");

        // Nodes anpassen, nachdem alle Graphen geladen sind
        canvases.forEach((canvas) =>   autoPositionNodes(canvas.id));
    } catch (error) {
        //console.error("Fehler beim Laden eines oder mehrerer Graphen:", error);
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
//Node positions

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
    const zoomFactor = canvas.zoom|| 1;
    console.log(zoomFactor);
    const canvasWidth = canvas.width / zoomFactor;  
    const canvasHeight = canvas.height / zoomFactor;
    const margin = 20; // Randgröße
    const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30; // Höhe des Titels

    // Ursprüngliche Positionen sammeln
    const nodePositions = graph._nodes.map((node) => ({
        node: node,
        x: node.pos[0],
        y: node.pos[1],
        width: node.size ? node.size[0] : 150, // Standardbreite eines Nodes
        height: node.size ? node.size[1] : 100 // Standardhöhe eines Nodes
    }));

    // Extremwerte finden, wobei wir die rechte Seite der Nodes berücksichtigen
    const minX = Math.min(...nodePositions.map((pos) => pos.x));
    const maxX = Math.max(...nodePositions.map((pos) => pos.x + pos.width)); // Rechte Seite des Nodes
    const minY = Math.min(...nodePositions.map((pos) => pos.y));
    const maxY = Math.max(...nodePositions.map((pos) => pos.y + pos.height)); // Untere Seite des Nodes

    // Skalenfaktoren für X und Y berechnen
    const scaleX =
        maxX === minX
            ? 1 // Wenn alle X-Werte gleich sind, keine Skalierung erforderlich
            : (canvasWidth - 2 * margin) / (maxX - minX);

    const scaleY =
        maxY === minY
            ? 1 // Wenn alle Y-Werte gleich sind, keine Skalierung erforderlich
            : (canvasHeight - 2 * margin - titleHeight) / (maxY - minY);

    // Kleineren Skalierungsfaktor verwenden, um das Verhältnis zu erhalten
    const scale = Math.min(scaleX, scaleY);

    // Offset berechnen, um die Nodes innerhalb des Canvas zu verschieben
    const offsetX = margin - minX * scale;
    const offsetY = margin + titleHeight - minY * scale;

    // Nodes neu positionieren
    nodePositions.forEach(({ node, x, y }) => {
        // Neue Position basierend auf Skalierung und Offset berechnen
        node.pos[0] = x * scale + offsetX;
        node.pos[1] = y * scale + offsetY;

        //console.log(`Node "${node.title}" verschoben: Neue Position (${node.pos[0]}, ${node.pos[1]})`);
    });

    //console.log("Alle Nodes skaliert und relativ verschoben.");
}

// Dynamisches Resizing für alle Canvas mit data-resize="true"
function adjustAllNodePositions() {
    // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
    const resizableCanvases = document.querySelectorAll('canvas');

    // Resize-Funktion für jedes Canvas aufrufen
    resizableCanvases.forEach((canvas) => {
        //adjustNodePositions(canvas.id);
        autoPositionNodes(canvas.id);
    });
}

// Dynamisches Resizing für alle Canvas und Neupositionierung der Nodes
function adjustAllCanvasAndNodePositions() {
    // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
    const canvases = document.querySelectorAll('canvas');

    // Für jedes Canvas die Größe und Node-Positionen anpassen
    canvases.forEach((canvas) => {
        adjustCanvasSize(canvas.id);
        autoPositionNodes(canvas.id);
        //adjustNodePositions(canvas.id);
    });
}


// Beim Laden der Seite die Canvas-Größen und node positionsinitial anpassen
document.addEventListener("DOMContentLoaded", () => {
    adjustAllCanvasAndNodePositions(); // Initial aufrufen

    // Event Listener für Fensteränderungen hinzufügen
    window.addEventListener("resize", adjustAllCanvasAndNodePositions);
});



// Platz optimieren
function autoPositionNodes(canvasId) {
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
    
        const zoomFactor = canvas.zoom|| 1;
        //console.log(zoomFactor);

        const canvasWidth = canvas.width/zoomFactor;
        const canvasHeight = canvas.height/zoomFactor;
        const margin = 20; // Randgröße
        const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30; // Höhe des Titels
    
        // Ursprüngliche Positionen sammeln
        const nodePositions = graph._nodes.map((node) => ({
            node: node,
            x: node.pos[0],
            y: node.pos[1],
            width: node.size ? node.size[0] : 150, // Standardbreite eines Nodes
            height: node.size ? node.size[1] : 100 // Standardhöhe eines Nodes
        }));
    
        if (nodePositions.length === 0) {
            console.error("Keine Nodes im Graph gefunden.");
            return;
        }
    
        // Extremwerte finden
        const minX = Math.min(...nodePositions.map((pos) => pos.x));
        const maxX = Math.max(...nodePositions.map((pos) => pos.x + pos.width)); // Rechte Seite des Nodes
        const minY = Math.min(...nodePositions.map((pos) => pos.y));
        const maxY = Math.max(...nodePositions.map((pos) => pos.y + pos.height)); // Untere Seite des Nodes
    
        // Schritt 1: Maximierung in X-Richtung
        const scaleX = (canvasWidth - 2 * margin) / (maxX - minX);
        const offsetX = margin - minX * scaleX;
    
        nodePositions.forEach(({ node, x }) => {
            node.pos[0] = x * scaleX + offsetX;
        });
    
        // Extremwerte nach X-Skalierung erneut berechnen
        const updatedMinY = Math.min(...nodePositions.map(({ node }) => node.pos[1]));
        const updatedMaxY = Math.max(...nodePositions.map(({ node }) => node.pos[1] + node.size[1]));
    
        // Schritt 2: Maximierung in Y-Richtung
        const scaleY = (canvasHeight - 2 * margin - titleHeight) / (updatedMaxY - updatedMinY);
        const offsetY = margin + titleHeight - updatedMinY * scaleY;
    
        nodePositions.forEach(({ node, y }) => {
            node.pos[1] = y * scaleY + offsetY;
        });
    
        //console.log("Nodes in X- und Y-Richtung unabhängig maximiert und positioniert.");
    }

    // document.addEventListener("DOMContentLoaded", () => {
    //     const sortButton = document.getElementById(`sortNodes${canvasId}`);
    //     if (sortButton) {
    //         sortButton.addEventListener("click", () => {
    //             for (let i = 0; i < 2; i++) {
    //                 autoPositionNodes(canvasId);
    //             }
    //         });
    //     }
    // });