//window.fbNodesColor = "#D0AF8B"; //Orange
window.fbNodesColor = "#879BCE"; //Blau
//window.srcNodesColor = "#879BCE"; //Blau
window.srcNodesColor = "#D0AF8B"; 
window.opNodesColor = "#88B19B"; 
//window.paramNodesColor = "#D1AE8B"; //Senfgelb
window.paramNodesColor = "#D7817D";
window.bgColor1 = "#FFFFFF"; //Weiß
window.bgColor2 = "#7C8693"; //Grau
window.outLabelsColor = fbNodesColor; //Orange
window.inLabelsColor = srcNodesColor; //Grün
window.paramLabelsColor = paramNodesColor; //Senfgelb
window.textAnzeigeColor = "#D0AF8B"; //Orange
window.canvasbgColor = "#232744"; //Dunkelblau

// Arrays für die beiden Kategorien
const funcNodeTypes = [];
const wordNodeTypes = [];

//Parameter der In und Output Labels:
window.labelInputPosX = 10;
window.labelWidth = 10; // Nur wichtig für out. sollte label inputpos x entsprechen
window.labelHeight = 14; // Höhe des Trichters (von Basis bis Spitze)

// CustomNodes in separate Datei ausgelagert

// Synth
import { _FunctionNode } from "./SynthNodes/CustomFunctionNode.js";
const FunctionNode = _FunctionNode();
//import { _CustomTimeNode } from "./SynthNodes/CustomTimeNode.js";
//const CustomTimeNode = _CustomTimeNode();
import { _CustNumberNode } from "./SynthNodes/CustomNumberNode.js";
const CustNumberNode = _CustNumberNode();
import { _uvNode } from "./SynthNodes/Custom_UV_Node.js";
const uvNode = _uvNode();
import { _CustWatchNodeString } from "./SynthNodes/CustWatchNodeString.js";
const CustWatchNodeString = _CustWatchNodeString();
import { _CustWatchNodeValue } from "./SynthNodes/CustWatchNodeValue.js";
const CustWatchNodeValue = _CustWatchNodeValue();
import { _CustomGraphicsPlot } from "./SynthNodes/CustomGraphicsPlotNode.js";
const CustomGraphicsPlot = _CustomGraphicsPlot();
import { _OperationNode } from "./SynthNodes/CustOperationNode.js";
const OperationNode = _OperationNode();
import { _AudioNode } from "./SynthNodes/AudioNode.js";
const AudioNode = _AudioNode();

// Wortmaschinen
import { _TextInputNode } from "./WordNodes/TextInputNode.js";
const TextInputNode = _TextInputNode();
import { _TextDisplayNode } from "./WordNodes/TextDisplayNode.js";
const TextDisplayNode = _TextDisplayNode();
import { TextManipulationLogic } from "./WordNodes/TextManipulationLogic.js";
import { createTextManipulationNode } from "./WordNodes/TextManipulationNode.js";


/**
 * Creates and initializes a LiteGraph instance on a specified canvas element.
 *
 * @param {string} canvasId - The ID of the canvas element where the graph will be rendered.
 * @returns {Object} An object containing the created graph and canvas instances.
 *
 * @example
 * // Create a graph instance on a canvas with ID 'myCanvas'
 * const { graph, canvas } = createGraphInstance('myCanvas');
 *
 * @throws Will throw an error if the canvas element with the specified ID is not found.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the canvas element with the given ID exists.
 * 2. Registers various node types for "Funktionenmaschinen" and "Wortmaschinen".
 * 3. Iterates over all registered node types and categorizes them into `funcNodeTypes` and `wordNodeTypes`.
 * 4. Creates a new LiteGraph instance and associates it with the canvas.
 * 5. Sets up touch event listeners to simulate mouse events for LiteGraph.
 * 6. Creates and configures a menu for interacting with the graph.
 * 7. Adds zoom functionality and event listeners for zoom buttons.
 * 8. Provides a function to display a menu for adding new nodes.
 * 9. Implements a loop to continuously update and render the graph.
 * 10. Observes the canvas element's visibility to control the rendering loop.
 */

export function createGraphInstance(canvasId) {
  // Überprüfen, ob das Canvas-Element existiert
  const canvasElement = document.getElementById(canvasId);
  if (!canvasElement) {
    console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  // Nodes Registrieren
  // Funktionenmaschinen
  LiteGraph.registerNodeType(
    "Funktionenmaschinen/Unabhängige_Variable",
    uvNode
  );
  // LiteGraph.registerNodeType(
  //   "Funktionenmaschinen/Unabhängige_Variable_Zeit ",
  //   CustomTimeNode
  // );
  LiteGraph.registerNodeType("Funktionenmaschinen/Parameter", CustNumberNode);
  LiteGraph.registerNodeType("Funktionenmaschinen/Funktion", FunctionNode);
  LiteGraph.registerNodeType("Funktionenmaschinen/Operation", OperationNode);
  LiteGraph.registerNodeType(
    "Funktionenmaschinen/Feedback_Gleichung",
    CustWatchNodeString
  );
  LiteGraph.registerNodeType(
    "Funktionenmaschinen/Feedback_Wert",
    CustWatchNodeValue
  );
  LiteGraph.registerNodeType(
    "Funktionenmaschinen/Feedback_Graph",
    CustomGraphicsPlot
  );
  LiteGraph.registerNodeType("Funktionenmaschinen/Feedback_Audio", AudioNode);

  //Wortmaschinen
  LiteGraph.registerNodeType("Wortmaschinen/TextInputNode", TextInputNode);
  LiteGraph.registerNodeType("Wortmaschinen/TextDisplayNode", TextDisplayNode);

  // Hilfsfunktion zum Ersetzen von Umlauten in den Folgenden nodes
  function replaceUmlauts(string) {
    return string
      .replace(/Ä/g, "Ae")
      .replace(/Ö/g, "Oe")
      .replace(/Ü/g, "Ue")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue");
  }

  // Dynamische Registrierung der Textmanipulations-Nodes
  TextManipulationLogic.forEach((nodeDefinition) => {
    const sanitizedTitle = replaceUmlauts(
      nodeDefinition.title.replace(/\s+/g, "").toLowerCase()
    );
    const NodeClass = createTextManipulationNode(nodeDefinition);
    LiteGraph.registerNodeType(`Wortmaschinen/${sanitizedTitle}`, NodeClass);
  });

  // Über alle registrierten Node-Typen iterieren
  Object.keys(LiteGraph.registered_node_types).forEach((nodeType) => {
    if (nodeType.startsWith("Funktionenmaschinen/")) {
      // Funktionenmaschinen
      const nodeName = nodeType.replace("Funktionenmaschinen/", ""); // Entferne Präfix

      // Prüfen, ob die Node bereits in funcNodeTypes existiert
      if (!funcNodeTypes.some((node) => node.type === nodeType)) {
        funcNodeTypes.push({ name: nodeName, type: nodeType });
      }
    } else if (nodeType.startsWith("Wortmaschinen/")) {
      // Wortmaschinen
      const nodeName = nodeType.replace("Wortmaschinen/", ""); // Entferne Präfix

      // Prüfen, ob die Node bereits in wordNodeTypes existiert
      if (!wordNodeTypes.some((node) => node.type === nodeType)) {
        wordNodeTypes.push({ name: nodeName, type: nodeType });
      }
    }
  });

  // Debug-Ausgabe
  // console.log("Funktionenmaschinen Nodes:", funcNodeTypes);
  // console.log("Wortmaschinen Nodes:", wordNodeTypes);

  // Erstelle eine neue Graph-Instanz

  var graph = new LGraph();

  // Erstelle eine neue Canvas-Instanz
  var canvas = new LGraphCanvas(`#${canvasId}`, graph);

  //window.graphCanvas = new LGraphCanvas(`#${canvasId}`, graph);

  // Speichere den Graph im Canvas-Element
  canvasElement.graph = graph;
  //canvasElement.canvas = canvas;

  // Hintergrundbild setzen
  canvas.background_image = null;
  canvas.clear_background_color = canvasbgColor;

  // Search box triggers "Blocked autofocusing on a <input> element in a cross-origin subframe."
  canvas.allow_searchbox = false;
  canvas.allow_dragcanvas = false; // Prevent dragging the canvas
  canvas.allow_zoom = false; // Prevent zooming in/out

// Doppelklick auf Node um Menü aufzurufen außer bei UV und Parameter
canvasElement.addEventListener(
  "dblclick",
  (e) => {
    const rect = canvasElement.getBoundingClientRect();
    
    // Berechne die unskalierten Koordinaten
    const x = (e.clientX - rect.left) / canvasElement.zoom;
    const y = (e.clientY - rect.top) / canvasElement.zoom;

    // Prüfen, ob eine Node getroffen wurde
    const clickedNode = graph.getNodeOnPos(x, y);


    if (clickedNode && clickedNode.type !== "Funktionenmaschinen/Unabhängige_Variable" && clickedNode.type !== "Funktionenmaschinen/Parameter") { 
      // Hier können Sie den gewünschten Code einfügen, der bei einem Doppelklick auf eine Node ausgeführt werden soll
      //console.log("Node doppelt geklickt:", clickedNode);
      e.preventDefault(); // Unterdrücke das Standardverhalten
      showNewMachineMenu(graph, canvasElement, clickedNode);
    }
  },
  false
);

  canvasElement.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      const rect = canvasElement.getBoundingClientRect();
      
      // Berechne die unskalierten Koordinaten
      const x = (touch.clientX - rect.left) / canvasElement.zoom;
      const y = (touch.clientY - rect.top) / canvasElement.zoom;
  
      // Prüfen, ob eine Node getroffen wurde
      const touchedNode = graph.getNodeOnPos(x, y);
  
      if (touchedNode) {
        //console.log("Node getroffen:", touchedNode.title);
        e.preventDefault(); // Unterdrücke das Scrollen
      }
  
      // Simuliere den mousedown-Event für LiteGraph
      const simulatedEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvasElement.dispatchEvent(simulatedEvent);
    },
    false
  );

  canvasElement.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      const rect = canvasElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // Prüfen, ob eine Node getroffen wurde
      const movedNode = graph.getNodeOnPos(x, y);

      if (movedNode) {
        //console.log("Node wird bewegt:", movedNode.title);
        e.preventDefault(); // Unterdrücke das Scrollen
      }

      // Simuliere den mousemove-Event für LiteGraph
      const simulatedEvent = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvasElement.dispatchEvent(simulatedEvent);
    },
    false
  );

  canvasElement.addEventListener(
    "touchend",
    (e) => {
      const simulatedEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
      });
      canvasElement.dispatchEvent(simulatedEvent);
    },
    false
  );



  //Menü:

  // ** Menü erstellen **
  const menu = document.createElement("div");
  menu.id = "canvas-menu";
  menu.style.position = "absolute";
  menu.style.top = "10px";
  menu.style.left = "10px";
  //menu.style.width = "260px";
  //menu.style.height = "400px";
  menu.style.backgroundColor = canvasbgColor;
  //enu.style.border = "1px solid #ccc";
  //menu.style.borderRadius = "1px";
  //menu.style.padding = "10px";
  menu.style.zIndex = "100";
  //menu.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  menu.innerHTML = `
        <button id="menu-toggle" class="button primary small">Menü</button>
        <nav id="menu-content" style="display: none; margin-top: 10px;">
            <ul class="links">
            <button id="fullscreen${canvasId}" onclick="goFullscreen('${canvasId}'); " class="button fit small" style="margin-bottom: 10px;">Vollbild</button>
            <button id="saveaspic${canvasId}" onclick="LightgraphtoImage('${canvasId}')" class="button fit small" style="margin-bottom: 10px;">Als Bild speichern</button>
               <button id="save${canvasId}" onclick="saveGraphToFile('${canvasId}')" class="button fit small" style="margin-bottom: 10px;">speichern</button>
                <button id="load${canvasId}" onclick="loadGraphFromFile('${canvasId}')" class="button fit small" style="margin-bottom: 10px;">laden</button>
                <button onclick="clearGraph('${canvasId}')" class="button primary fit small" style="margin-bottom: 10px;">Alles Löschen</button>
                <button id="newNode${canvasId}" class="button fit small" style="margin-bottom: 10px;">Neue Maschine</button>
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 10px;">
    <button id="zoomOut${canvasId}" class="button small" style="flex: 1; text-align: center;">Zoom -</button>
    <span id="zoomValue${canvasId}" style="flex: 1; text-align: center; font-size: 0.9em; font-weight: bold;">1.0</span>
    <button id="zoomIn${canvasId}" class="button small" style="flex: 1; text-align: center;">Zoom +</button>
</div>
                <button	id="position" onclick="
                for (let i=0; i<5;i++){
                autoPositionNodes('${canvasId}');
                }
                "class="button fit small" style="margin-bottom: 10px;">Maschinen sortieren</button>
                <button id="delnode" onclick="delNode('${canvasId}')"  class="button fit small">Maschine löschen</button>
                
            </ul>
        </nav>       
    `;

    //  <button onclick="copyNode('${canvasId}')"  class="button fit small" style="margin-bottom: 10px;">Maschine kopieren</button>
  // Füge das Menü in den Canvas-Container ein
  canvasElement.parentElement.appendChild(menu);

  // Menü-Interaktion
  const menuToggle = menu.querySelector("#menu-toggle");
  const menuContent = menu.querySelector("#menu-content");

  // Definiere die Breiten für die Zustände
  const collapsedWidth = "00px"; // Breite, wenn das Menü eingeklappt ist
  const expandedWidth = "260px"; // Breite, wenn das Menü ausgeklappt ist

  // Setze die initiale Breite
  menu.style.width = collapsedWidth;


// Funktion zum Umschalten des Menüs
function toggleMenu(isExpanded) {
  menuContent.style.display = isExpanded ? "none" : "block";
  menu.style.width = isExpanded ? collapsedWidth : expandedWidth;
}

// // Event Listener für den Menü-Button
// menuToggle.addEventListener("click", () => {
//   const isExpanded = menuContent.style.display === "block";
//   toggleMenu(isExpanded); // Menü umschalten
// });

// Liste aller Buttons, die das Menü schließen sollen
const menubuttons = [
  menuToggle, // Beispiel: Menü-Umschalt-Button
  document.getElementById(`fullscreen${canvasId}`),
  document.getElementById(`saveaspic${canvasId}`),
  document.getElementById(`save${canvasId}`),
  document.getElementById(`load${canvasId}`),
  document.getElementById(`position${canvasId}`),
  document.getElementById(`delnode${canvasId}`),
  document.getElementById(`CloseNewNodeMenu${canvasId}`)
  ];

// Füge jedem Button einen Event-Listener hinzu
menubuttons.forEach((button) => {
  if (button) {
    button.addEventListener("click", () => {
      const isExpanded = menuContent.style.display === "block";
      toggleMenu(isExpanded); // Menü umschalten
    });
  }
});

  // Zoom from canvas loading
  const zoomLevel = parseFloat(canvasElement.getAttribute("data-zoom")) || 1.0; // Default zoom is 1.0
  canvasElement.zoom = zoomLevel;
  

  // Apply the zoom level
  const centerPoint = [0, 0]; //[canvasElement.width / 2, canvasElement.height / 2];
  canvas.setZoom(zoomLevel, centerPoint);

  // Event-Handling für die Zoom-Buttons
  const zoomInButton = document.getElementById(`zoomIn${canvasId}`);
  const zoomOutButton = document.getElementById(`zoomOut${canvasId}`);
  const zoomValueLabel = document.getElementById(`zoomValue${canvasId}`);

  let currentZoom = zoomLevel; // Initialer Zoom-Wert

  function applyZoom(newZoom) {
    currentZoom = Math.min(Math.max(newZoom, 0.5), 2); // Begrenzung des Zoomwerts auf [0.5, 2]
    canvas.setZoom(currentZoom, [0, 0]);
    canvasElement.zoom = currentZoom; // Zoom-Wert im Canvas speichern
    zoomValueLabel.textContent = currentZoom.toFixed(1); // Aktualisiere die Anzeige
    //console.log(canvasElement.zoom);
  }

  // Event-Listener für die Buttons
  zoomInButton.addEventListener("click", () => applyZoom(currentZoom + 0.1));
  zoomOutButton.addEventListener("click", () => applyZoom(currentZoom - 0.1));

  // Set initial zoom value display
  zoomValueLabel.textContent = currentZoom.toFixed(1);

  //Menueoverlay neue node

 

  // Verknüpfen der Funktion mit dem Button
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById(`newNode${canvasId}`);
    if (button) {
      button.addEventListener("click", () => {
        //const canvasElement = document.getElementById("canvasId"); // Beispiel: canvasId ersetzen
        if (canvas && graph) {
          showNewMachineMenu(graph, canvasElement);
        } else {
          console.error("Canvas oder Graph nicht gefunden.");
        }
      });
    }
  });    

 

  // Initialisiere Loop-Variablen
  let isVisible = false;
  let isLooping = false;

  graph.start(30);


function loop() {
  // Schleife läuft kontinuierlich
  requestAnimationFrame(loop);

    
  // if (manualDraw == true) {
  //   console.log("Manual draw requested.");
  //   graph.runStep();
  //   canvas.draw(true, true); // Redraw
  //   manualDraw = false;
  // }

  // Überprüfen, ob das Canvas sichtbar ist
  // if (!isVisible) { 
  //   console.log("Canvas is not visible. Skipping draw." + canvasId);
  //   return; // Überspringe das Zeichnen, wenn Canvas nicht sichtbar
  // }

  const graph = canvas.graph;
  const hasActiveAnim = graph ? hasActiveAnimation(graph) : false;

  // Überprüfen, ob eine aktive Animation vorhanden ist oder der Timer aktiv ist
  if (!hasActiveAnim && !manualDraw) {
    //console.log("No active animation and manualdraw inactive. Skipping draw." + canvasId);
    return; // Überspringe das Zeichnen, wenn keine aktive Animation vorhanden und der Timer nicht aktiv ist
  }

  //console.log("Loop running." + canvasId);
  graph.runStep();
  canvas.draw(true, true); // Redraw every frame
}
    
    // Starten der Schleife
    requestAnimationFrame(loop);



  // /**
  //  * Observer to monitor the visibility of the canvas element.
  //  * When the canvas becomes visible, it starts the loop function.
  //  * When the canvas is no longer visible, it stops the loop function.
  //  *
  //  * @param {IntersectionObserverEntry[]} entries - Array of intersection observer entries.
  //  */

  // const options = {
  //   root: null, // Standardmäßig der Viewport
  //   rootMargin: '0px', // Margin um den Root
  //   threshold: 0.1 // Schwellenwert für die Sichtbarkeit (0.1 bedeutet 10% sichtbar)
  // };
  
  // const observer = new IntersectionObserver((entries) => {
  //   entries.forEach((entry) => {
  //     const canvas = entry.target;
  //     isVisible = entry.isIntersecting; // Prüft, ob das Canvas sichtbar ist
  //     //manualDrawFkt(400); // Startet die manuelle Zeichnung, wenn Graph sichtbar wird für alle aktuell sichtbaren graphen
  //   });
  // }, options);
  
  // // Beobachte den Canvas
  // observer.observe(canvasElement);

    // ...existing code...
  
  /**
   * Überprüft, ob eine der Nodes im Canvas animation.active == true hat.
   * @param {Object} graph - Das Graph-Objekt des Canvas.
   * @returns {boolean} - True, wenn eine Node animation.active == true hat, sonst false.
   */
  function hasActiveAnimation(graph) {
   // console.log("Current nodes in graph:", graph._nodes);
    return graph._nodes.some(node => node.animationActive);
  }

  

  //console.log(`Graph für Canvas "${canvasId}" erstellt.`);
  return { graph, canvas };
}

// Exportiere die Funktion
window.createGraphInstance = createGraphInstance;





// Funktioniert, aber noch nicht sensitiv für verschiedene Graphen. canvas id implementieren
let manualDraw = false;

function manualDrawFkt(Delay) {
  //console.log("Manual draw fkt started.");
  manualDraw = true;
  setTimeout(() => {
    manualDraw = false;
  }, Delay);
}

window.manualDrawFkt = manualDrawFkt;

// Funktionen fuer verschiedenen Kram

function renderEquationToSVG(equation, targetElementId) {
  try {
    const targetElement = document.getElementById(targetElementId);
    const svg = katex.renderToString(equation, {
      throwOnError: false,
      output: "html",
      displayMode: true,
    });

    targetElement.innerHTML = svg;
  } catch (err) {
    console.error("Error rendering equation: ", err);
  }
}

window.renderEquationToSVG = renderEquationToSVG;

function renderWithMathJax(equation, color = "black") {
  try {
    //const styledEquation = `{\\color{red}${equation}}`;

    // Render die Gleichung in SVG
    const svgNode = MathJax.tex2svg(equation);
    const svg = svgNode.querySelector("svg");

    svg.style.color = color; // Setzt die Farbe global

    // Konvertiere das SVG in eine Zeichenkette
    const svgString = new XMLSerializer().serializeToString(svg);

    // Erstelle ein neues Image-Objekt
    const img = new Image();

    // Setze die SVG-Daten als Quelle des Bildes
    img.src = "data:image/svg+xml;base64," + btoa(svgString);

    return img; // Gib das Image-Objekt zurück
  } catch (err) {
    console.error("Fehler beim Rendern der Gleichung mit MathJax:", err);
    return null; // Gib null zurück, falls ein Fehler auftritt
  }
}

window.renderWithMathJax = renderWithMathJax;

// Beispiel mit MathJS
function convertToLatex(expression) {
  try {
    let leftSide = "";
    let rightSide = expression;

    // Falls der Ausdruck ein Gleichheitszeichen enthält, splitte in linken und rechten Teil
    if (expression.includes("=")) {
      const parts = expression.split("=");
      leftSide = parts[0].trim(); // Linke Seite der Gleichung (z.B. f(x))
      rightSide = parts[1].trim(); // Rechte Seite der Gleichung (z.B. x-2)
    }

    // Parsen und Umwandeln nur des rechten Teils
    const node = math.parse(rightSide); // Parsen des rechten Teils
    const latexRightSide = node.toTex(); // Umwandeln des rechten Teils in LaTeX

    // Parsen und Umwandeln nur des linken Teils
    const nodel = math.parse(leftSide);
    const latexLeftSide = nodel.toTex();

    // Rückgabe des zusammengesetzten Ausdrucks
    if (leftSide) {
      return `${latexLeftSide} = ${latexRightSide}`; // Zusammensetzen der beiden Teile
    } else {
      return latexRightSide; // Falls kein Gleichheitszeichen vorhanden ist, nur die LaTeX-Umwandlung des Ausdrucks
    }
  } catch (err) {
    console.error("Fehler beim Parsen des Ausdrucks:", err);
    return expression; // Falls Fehler, gib den ursprünglichen Ausdruck zurück
  }
}

// Macht die Funktion global verfügbar
window.convertToLatex = convertToLatex;



function adjustColor(positiveColor, negativeColor, value) {
  // Hilfsfunktion: Hex-Farbe zu RGB konvertieren
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // Hilfsfunktion: RGB zu Hex konvertieren
  function rgbToHex({ r, g, b }) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  // Hilfsfunktion: Helligkeit anpassen mit angepasster logarithmischer Funktion
  function adjustBrightness(rgb, value) {
    // Definiere die neue Funktion basierend auf den optimierten Parametern
    function brightnessFactor(x) {
      const a = 1.817;
      const b = 1.00;
      const c = 1.697;
      const factor = (a * Math.log(x + b)) / (1 + c * Math.log(x + b));
      return Math.min(factor, 1); // Begrenze den Faktor auf maximal 1
    }

    // Berechne den Faktor basierend auf der neuen Funktion
    const factor = brightnessFactor(value);

    // Passe die RGB-Werte an
    return {
      r: Math.min(255, Math.max(0, rgb.r * factor)),
      g: Math.min(255, Math.max(0, rgb.g * factor)),
      b: Math.min(255, Math.max(0, rgb.b * factor))
    };
  }

  // Hilfsfunktion: Überprüfen, ob der Input Hex oder RGB ist
  function isHex(color) {
    return typeof color === 'string' && color[0] === '#';
  }

  // Wähle die passende Farbe basierend auf dem Vorzeichen von value
  const baseColor = value >= 0 ? positiveColor : negativeColor;

  // Konvertiere die Farbe in RGB, falls sie in Hex vorliegt
  const rgb = isHex(baseColor) ? hexToRgb(baseColor) : baseColor;

  // Normiere den Wert auf den Bereich [0, 1] für positive und negative Werte
  const normalizedFactor = Math.abs(value);

  // Passe die Helligkeit an
  const adjustedRgb = adjustBrightness(rgb, normalizedFactor);

  // Konvertiere zurück zu Hex, falls der Input in Hex war, und gib die neue Farbe zurück
  return isHex(baseColor) ? rgbToHex(adjustedRgb) : adjustedRgb;
}

window.adjustColor = adjustColor;


 // Funktion, um das neue Menü anzuzeigen
function showNewMachineMenu(graph, canvasElement, placeholderNode) {
  // Erstelle ein Overlay für das Menü
  //console.log("Show new machine menu" + graph + canvasElement);
  const overlay = document.createElement("div");
  //overlay.id = "new-machine-overlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(26, 29, 41, 0.9)";
  //overlay.style.opacity = "0.5";
  overlay.style.zIndex = "300";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "#ffffff";

  // Füge das Menü in den Canvas-Container ein
  //canvasElement.parentElement.appendChild(overlay);

  // Menü-Inhalt
  const menuContent = document.createElement("div");
  menuContent.class = "inner";
  menuContent.style.display = "flex";
  menuContent.style.width = "80%";
  menuContent.style.justifyContent = "center"; // Zentriert die Elemente horizontal
  menuContent.style.width = "80%";
  menuContent.style.gap = "20px";

  // Spalte für Funktionenmaschinen
  const funcColumn = document.createElement("ul");
  funcColumn.innerHTML =
    '<header class="major"> <h3>Funktionenmaschinen</h3></header>';

  // Spalte für Wortmaschinen
  const wordColumn = document.createElement("ul");
  wordColumn.style.columnCount = "2"; /* Maximale Anzahl der Spalten */
  wordColumn.style.columnGap = "20px"; /* Abstand zwischen den Spalten */
  wordColumn.style.maxHeight =
    canvasElement.height - 20; /* Begrenzung auf die Höhe des Containers */
  //wordColumn.style.overflowY = "auto"; /* Scrollen, falls nötig */
  //wordColumn.class="col-6 col-12-small";;
  //wordColumn.style.margin = "10px";
  wordColumn.innerHTML =
    '<header class="major"> <h3>Wortmaschinen</h3></header>';

  // Funktion, um Buttons für Nodes zu erstellen
  const createNodeButtons = (parent, nodeTypes) => {
    nodeTypes.forEach((node) => {
      const button = document.createElement("li");
      button.textContent = node.name.replace(/_/g, " ");
      button.class = "links";
      button.style.margin = "5px";
      button.className = "machine-button"; // Klasse für Stil hinzufügen
      button.style.listStyle = "none";
      button.style.textTransform = "uppercase";
      button.style.fontWeight = "600";
      button.style.fontSize = "0.6em";
      button.style.letterSpacing = "0.25em";
      button.style.borderBottom = "1px solid #31344F"; // Dünne Linie
      button.style.paddingBottom = "10px"; // Abstand vom Text zur Linie
      button.style.transition = "background-color 0.3s, transform 0.1s"; // Smooth transitions

      // Standard-Stil
      button.style.backgroundColor = "transparent";
      button.style.color = "#ffffff";

      // Hover-Effekt
      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; // Leicht hervorgehoben
      });

      // Entferne Hover-Effekt
      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "transparent"; // Zurücksetzen
      });

      // Klick-Effekt
      button.addEventListener("mousedown", () => {
        button.style.backgroundColor = "rgba(255, 255, 255, 0.3)"; // Stärker hervorgehoben
        button.style.transform = "scale(0.98)"; // Leichte Skalierung
      });

      button.addEventListener("mouseup", () => {
        button.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; // Zurück zur Hover-Farbe
        button.style.transform = "scale(1)"; // Skalierung zurücksetzen
      });
      // Klick-Event für den Button
      button.addEventListener("click", () => {
        if (placeholderNode) {
          replacePlaceholderNode(node.type);
          canvasElement.parentElement.removeChild(overlay); // Menü schließen
        } else {
        const newNode = LiteGraph.createNode(node.type);
        //const uniqueName = `${node.name}_${Date.now()}`; // Dynamischer Name
        //newNode.title = uniqueName;
        newNode.pos = [50, canvasElement.height - 200];
        graph.add(newNode);
        //console.log(`Node hinzugefügt: ${uniqueName}`); // Aber bestätigung einbauen
        //document.body.removeChild(overlay); // Menü schließen <-Das funktioniert noch nicht
        }
      });

      parent.appendChild(button);
    });
  };

  // // Buttons zu den Spalten hinzufügen
  // createNodeButtons(funcColumn, funcNodeTypes);
  // createNodeButtons(wordColumn, wordNodeTypes);

  // // Füge die Spalten zum Menü hinzu
  // menuContent.appendChild(funcColumn);
  // menuContent.appendChild(wordColumn);

  // Bestimmen Sie den Typ der Maschinen basierend auf dem lgtype-Attribut
  const lgType = canvasElement.getAttribute("lgtype");
  if (lgType === "Wortmaschinen") {
    createNodeButtons(wordColumn, wordNodeTypes);
    menuContent.appendChild(wordColumn);
  } else if (lgType === "Funktionenmaschinen") {
    createNodeButtons(funcColumn, funcNodeTypes);
    menuContent.appendChild(funcColumn);
  } else {
    createNodeButtons(funcColumn, funcNodeTypes);
    createNodeButtons(wordColumn, wordNodeTypes);
    menuContent.appendChild(funcColumn);
    menuContent.appendChild(wordColumn);
  }

  // Schließen-Button für das Menü
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.id = "CloseNewNodeMenu";
  closeButton.className = "button primary small";
  closeButton.style.position = "absolute"; // Absolut positionieren
  closeButton.style.top = "10px"; // Abstand vom oberen Rand
  closeButton.style.right = "10px"; // Abstand vom rechten Rand

  closeButton.addEventListener("click", () => {
    canvasElement.parentElement.removeChild(overlay);
  });

  // Schließen-Button hinzufügen
  overlay.appendChild(closeButton);

  // Menü und Overlay hinzufügen
  overlay.appendChild(menuContent);
  //canvasContainer.appendChild(overlay); // Füge das Overlay in den Canvas-Container ein
  canvasElement.parentElement.appendChild(overlay);

  // Funktion, um eine neue Node zu erstellen und die Platzhalter-Node zu ersetzen
  function replacePlaceholderNode(newNodeType) {
    const newNode = LiteGraph.createNode(newNodeType);
    newNode.pos = placeholderNode.pos.slice(); // Position übernehmen
    graph.add(newNode);

    //Verbindungen wiederherstellen
    if (placeholderNode.inputs) {
      if (newNode.inputs) {
        placeholderNode.inputs.forEach((input, index) => {
          if (input.link !== null) {
            const link = graph.links[input.link];
            const originNode = graph.getNodeById(link.origin_id);
            if (newNode.inputs[index]) {
              originNode.connect(link.origin_slot, newNode, index);
            }
          }
        });
      }
    }
    if (placeholderNode.outputs) {
      if (newNode.outputs) {
        placeholderNode.outputs.forEach((output, index) => {
          if (output.links && output.links.length) {
            output.links.forEach((linkId) => {
              const link = graph.links[linkId];
              const targetNode = graph.getNodeById(link.target_id);
              if (newNode.outputs[index]) {
                newNode.connect(index, link.target_id, link.target_slot);
              }
            });
          }
        });
      }
    }

    // Platzhalter-Node löschen
    graph.remove(placeholderNode);
    //console.log("Platzhalter-Node ersetzt durch:", newNode);
  }
}
