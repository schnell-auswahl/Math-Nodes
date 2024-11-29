window.fbNodesColor = "#D0AF8B"; //Orange
window.srcNodesColor = "#879BCE"; //Blau
window.opNodesColor = "#88B19B"; //Grün
window.paramNodesColor = "#D1AE8B"; //Senfgelb
window.bgColor1 = "#FFFFFF"; //Weiß
window.bgColor2 = "#7C8693"; //Grau
window.outLabelsColor = fbNodesColor; //Orange
window.inLabelsColor = opNodesColor; //Grün
window.paramLabelsColor = paramNodesColor; //Senfgelb
window.textAnzeigeColor = paramNodesColor; //Gelb
window.canvasbgColor = "#232744"; //Dunkelblau 

// Arrays für die beiden Kategorien
const funcNodeTypes = [];
const wordNodeTypes = [];

//Parameter der In und Output Labels:
window.labelInputPosX = 10;
window.labelWidth = 10; // Nur wichtig für out. sollte label inputpos x entsprechen
window.labelHeight = 14; // Höhe des Trichters (von Basis bis Spitze)


// CustomNodes in separate Datei ausgelagert

// //Synth
// Synth
import { _FunctionNode } from './SynthNodes/CustomFunctionNode.js';
const FunctionNode = _FunctionNode();

import { _CustomTimeNode } from './SynthNodes/CustomTimeNode.js';
const CustomTimeNode = _CustomTimeNode();

import { _CustNumberNode } from './SynthNodes/CustomNumberNode.js';
const CustNumberNode = _CustNumberNode();

import { _uvNode } from './SynthNodes/Custom_UV_Node.js';
const uvNode = _uvNode();

import { _CustWatchNodeString } from './SynthNodes/CustWatchNodeString.js';
const CustWatchNodeString = _CustWatchNodeString();

import { _CustWatchNodeValue } from './SynthNodes/CustWatchNodeValue.js';
const CustWatchNodeValue = _CustWatchNodeValue();

import { _CustomGraphicsPlot } from './SynthNodes/CustomGraphicsPlotNode.js';
const CustomGraphicsPlot = _CustomGraphicsPlot();

import { _OperationNode } from './SynthNodes/CustOperationNode.js';
const OperationNode = _OperationNode();

import { _AudioNode } from './SynthNodes/AudioNode.js';
const AudioNode = _AudioNode();

// Wortmaschinen
import { _TextInputNode } from './WordNodes/TextInputNode.js';
const TextInputNode = _TextInputNode();

import { _TextDisplayNode } from './WordNodes/TextDisplayNode.js';
const TextDisplayNode = _TextDisplayNode();
import { TextManipulationLogic } from './WordNodes/TextManipulationLogic.js';
import { createTextManipulationNode } from './WordNodes/TextManipulationNode.js';


//Testsetups
import { nodeSetupSynth1 } from '../TestSetups/nodeSetupSynth1.js';
import { nodeSetupWords1 } from '../TestSetups/nodeSetupWords1.js';
import { nodeSetupWords2 } from '../TestSetups/nodeSetupWords2.js';





export function createGraphInstance(canvasId) {
    // Überprüfen, ob das Canvas-Element existiert
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) {
        console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
        return;
    }

    //Nodes Registrieren
    // Funktionenmaschinen
    LiteGraph.registerNodeType("Funktionenmaschinen/Unabhängige_Variable", uvNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/Unabhängige_Variable_Zeit ", CustomTimeNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/Parameter", CustNumberNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/Funktion", FunctionNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/Operation", OperationNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/Feedback_Gleichung", CustWatchNodeString);
    LiteGraph.registerNodeType("Funktionenmaschinen/Feedback_Wert", CustWatchNodeValue);
    LiteGraph.registerNodeType("Funktionenmaschinen/Feedback_Graph", CustomGraphicsPlot);
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
        const sanitizedTitle = replaceUmlauts(nodeDefinition.title.replace(/\s+/g, "").toLowerCase());
        const NodeClass = createTextManipulationNode(nodeDefinition);
        LiteGraph.registerNodeType(`Wortmaschinen/${sanitizedTitle}`, NodeClass);
        });

// Über alle registrierten Node-Typen iterieren
Object.keys(LiteGraph.registered_node_types).forEach((nodeType) => {
    if (nodeType.startsWith("Funktionenmaschinen/")) {
        // Funktionenmaschinen
        const nodeName = nodeType.replace("Funktionenmaschinen/", ""); // Entferne Präfix

        // Prüfen, ob die Node bereits in funcNodeTypes existiert
        if (!funcNodeTypes.some(node => node.type === nodeType)) {
            funcNodeTypes.push({ name: nodeName, type: nodeType });
        }
    } else if (nodeType.startsWith("Wortmaschinen/")) {
        // Wortmaschinen
        const nodeName = nodeType.replace("Wortmaschinen/", ""); // Entferne Präfix

        // Prüfen, ob die Node bereits in wordNodeTypes existiert
        if (!wordNodeTypes.some(node => node.type === nodeType)) {
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



canvasElement.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const rect = canvasElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Prüfen, ob eine Node getroffen wurde
    const touchedNode = graph.getNodeOnPos(x, y);

    if (touchedNode) {
        console.log("Node getroffen:", touchedNode.title);
        e.preventDefault(); // Unterdrücke das Scrollen
    }
    
    // Simuliere den mousedown-Event für LiteGraph
    const simulatedEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
        //button: 1, // Rechte Maustaste
        //buttons: 1 // Rechte Maustaste gedrückt
    });
    canvasElement.dispatchEvent(simulatedEvent);
}, false);

canvasElement.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const rect = canvasElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Prüfen, ob eine Node getroffen wurde
    const movedNode = graph.getNodeOnPos(x, y);

    if (movedNode) {
        console.log("Node wird bewegt:", movedNode.title);
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
}, false);

canvasElement.addEventListener("touchend", (e) => {
    const simulatedEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
    });
    canvasElement.dispatchEvent(simulatedEvent);
}, false);


// Menue rechtsklick

//Menü faken
//Button mit Event Listener verknüpfen
// Menü faken
// Button mit Event Listener verknüpfen
// document.addEventListener("DOMContentLoaded", () => {
//     const button = document.getElementById("simulateContextMenu");
//     if (button) {
//         button.addEventListener("click", () => {
//             console.log("Button geklickt!");
            
//             // Beispiel: Simuliertes Mausereignis
//             const fakeEvent = new MouseEvent("mousedown", {
//                 bubbles: true, // Ereignis wird weitergegeben
//                 cancelable: true, // Ereignis kann abgebrochen werden
//                 clientX: 200, // X-Koordinate relativ zum Fenster
//                 clientY: 600, // Y-Koordinate relativ zum Fenster
//                 button: 2, // Rechte Maustaste
//                 buttons: 2 // Rechte Maustaste gedrückt
//             });

//             // Dispatch des Mousedown-Events
//             canvasElement.dispatchEvent(fakeEvent);

//             var nodeAudio3 = LiteGraph.createNode("Funktionenmaschinen/AudioNode");
//             nodeAudio3.pos = [50,canvasElement.height - 50];
//             graph.add(nodeAudio3);
       

//             // Dispatch des Mouseup-Events nach 200ms
//             setTimeout(() => {
//                 const fakeMouseUpEvent = new MouseEvent("mouseup", {
//                     bubbles: true,
//                     cancelable: true,
//                     clientX: 200, // X-Koordinate muss übereinstimmen
//                     clientY: 600, // Y-Koordinate muss übereinstimmen
//                 });

//                 // Dispatch des Mouseup-Events
//                 canvasElement.dispatchEvent(fakeMouseUpEvent);
//                 console.log("Mouseup Event ausgelöst");
//             }, 200); // 200ms Verzögerung
//         });
//     } else {
//         console.error("Button mit ID 'simulateContextMenu' wurde nicht gefunden.");
//     }
// });


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
               <button onclick="saveGraphToFile('${canvasId}')" class="button fit small" style="margin-bottom: 10px;">speichern</button>
                <button onclick="loadGraphFromFile('${canvasId}')" class="button fit small" style="margin-bottom: 10px;">laden</button>
                <button onclick="clearGraph('${canvasId}')" class="button primary fit small" style="margin-bottom: 10px;">Alles Löschen</button>
                <button id="newNode${canvasId}" class="button fit small" style="margin-bottom: 10px;">Neue Maschine</button>
                <button id="copyNode" class="button fit small" style="margin-bottom: 10px;">Maschine kopieren</button>
                <button id="delNode" class="button fit small">Maschine löschen</button>
            </ul>
        </nav>       
    `;

    // Füge das Menü in den Canvas-Container ein
    canvasElement.parentElement.appendChild(menu);

    // Menü-Interaktion
const menuToggle = menu.querySelector("#menu-toggle");
const menuContent = menu.querySelector("#menu-content");

// Definiere die Breiten für die Zustände
const collapsedWidth = "00px"; // Breite, wenn das Menü eingeklappt ist
const expandedWidth = "260px";  // Breite, wenn das Menü ausgeklappt ist

// Setze die initiale Breite
menu.style.width = collapsedWidth;

// Füge Event Listener hinzu
menuToggle.addEventListener("click", () => {
    const isExpanded = menuContent.style.display === "block";
    
    // Wechsel zwischen Zuständen
    menuContent.style.display = isExpanded ? "none" : "block";
    menu.style.width = isExpanded ? collapsedWidth : expandedWidth; // Breite entsprechend ändern
});



  //Menueoverlay neue node

  // Funktion, um das neue Menü anzuzeigen
  function showNewMachineMenu(graph, canvasElement) {
    // Erstelle ein Overlay für das Menü
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
    menuContent.class="inner";
    menuContent.style.display = "flex";
    menuContent.style.width = "80%";
    menuContent.style.justifyContent = "center"; // Zentriert die Elemente horizontal
    //menuContent.style.alignItems = "center";    // Zentriert die Elemente vertikal
    menuContent.style.width = "80%";
    menuContent.style.gap = "20px";  
    //menuContent.style.backgroundColor = "#444";
   // menuContent.style.borderRadius = "10px";
    //enuContent.style.padding = "20px";
    //menuContent.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.5)";

    // Spalte für Funktionenmaschinen
    const funcColumn = document.createElement("ul");
    //funcColumn.class="links";
    //funcColumn.style.margin = "10px";
    funcColumn.innerHTML = '<header class="major"> <h3>Funktionenmaschinen</h3></header>';

    // Spalte für Wortmaschinen
    const wordColumn = document.createElement("ul");
    wordColumn.style.columnCount = "2"; /* Maximale Anzahl der Spalten */
    wordColumn.style.columnGap = "20px"; /* Abstand zwischen den Spalten */
    wordColumn.style.maxHeight = canvasElement.height - 20; /* Begrenzung auf die Höhe des Containers */
    //wordColumn.style.overflowY = "auto"; /* Scrollen, falls nötig */
    //wordColumn.class="col-6 col-12-small";;
    //wordColumn.style.margin = "10px";
    wordColumn.innerHTML = '<header class="major"> <h3>Wortmaschinen</h3></header>';
   

    // Funktion, um Buttons für Nodes zu erstellen
    const createNodeButtons = (parent, nodeTypes) => {
        nodeTypes.forEach((node) => {
            const button = document.createElement("li");
            button.textContent = node.name.replace(/_/g, " ");
            button.class="links"
            button.style.margin = "5px";
            button.style.listStyle = "none"; 
            button.style.textTransform = "uppercase";
            button.style.fontWeight = "600";
            button.style.fontSize = "0.6em";
            button.style.letterSpacing = "0.25em"; 
            button.style.borderBottom = "1px solid #31344F"; // Dünne Linie
            button.style.paddingBottom = "10px"; // Abstand vom Text zur Linie
            // Klick-Event für den Button
            button.addEventListener("click", () => {
                const newNode = LiteGraph.createNode(node.type);
                const uniqueName = `${node.name}_${Date.now()}`; // Dynamischer Name
                //newNode.title = uniqueName;
                newNode.pos = [
                    50,
                    (canvasElement.height - 200),
                ];
                graph.add(newNode);
                //console.log(`Node hinzugefügt: ${uniqueName}`); // Aber bestätigung einbauen
                document.body.removeChild(overlay); // Menü schließen
            });

            parent.appendChild(button);
        });
    };

    // Buttons zu den Spalten hinzufügen
    createNodeButtons(funcColumn, funcNodeTypes);
    createNodeButtons(wordColumn, wordNodeTypes);

    // Füge die Spalten zum Menü hinzu
    menuContent.appendChild(funcColumn);
    menuContent.appendChild(wordColumn);

    // Schließen-Button für das Menü
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.className = "button primary small";
    closeButton.style.position = "absolute"; // Absolut positionieren
    closeButton.style.top = "10px"; // Abstand vom oberen Rand
    closeButton.style.right = "10px"; // Abstand vom rechten Rand
    // closeButton.style.margin = "20px auto 0";
    // closeButton.style.display = "block";
    // closeButton.style.padding = "10px 20px";
    // closeButton.style.backgroundColor = "#ff4444";
    // closeButton.style.border = "none";
    // closeButton.style.borderRadius = "5px";
    // closeButton.style.color = "#fff";
    // closeButton.style.cursor = "ponter";

    closeButton.addEventListener("click", () => {
        canvasElement.parentElement.removeChild(overlay);
    });


    // Schließen-Button hinzufügen
    overlay.appendChild(closeButton);

    // Menü und Overlay hinzufügen
    overlay.appendChild(menuContent);
    //canvasContainer.appendChild(overlay); // Füge das Overlay in den Canvas-Container ein
    canvasElement.parentElement.appendChild(overlay);
}

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





    graph.start(30);

    function loop() {
        graph.runStep();
        canvas.draw(true, true);  // Redraw every frame
        requestAnimationFrame(loop);
      }
      loop();  // Start the loop

    //console.log(`Graph für Canvas "${canvasId}" erstellt.`);
    return { graph, canvas };
}

// Exportiere die Funktion
window.createGraphInstance = createGraphInstance;


















// Funktionen fuer verschiedenen Kram

function renderEquationToSVG(equation, targetElementId) {
    try {
        const targetElement = document.getElementById(targetElementId);
        const svg = katex.renderToString(equation, {
            throwOnError: false,
            output: 'html',
            displayMode: true
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
        let leftSide = '';
        let rightSide = expression;
  
        // Falls der Ausdruck ein Gleichheitszeichen enthält, splitte in linken und rechten Teil
        if (expression.includes('=')) {
            const parts = expression.split('=');
            leftSide = parts[0].trim();   // Linke Seite der Gleichung (z.B. f(x))
            rightSide = parts[1].trim();  // Rechte Seite der Gleichung (z.B. x-2)
        }
  
        // Parsen und Umwandeln nur des rechten Teils
        const node = math.parse(rightSide);  // Parsen des rechten Teils
        const latexRightSide = node.toTex();  // Umwandeln des rechten Teils in LaTeX
  
        // Parsen und Umwandeln nur des linken Teils
        const nodel = math.parse(leftSide);
        const latexLeftSide = nodel.toTex();
  
        // Rückgabe des zusammengesetzten Ausdrucks
        if (leftSide) {
            return `${latexLeftSide} = ${latexRightSide}`;  // Zusammensetzen der beiden Teile
        } else {
            return latexRightSide;  // Falls kein Gleichheitszeichen vorhanden ist, nur die LaTeX-Umwandlung des Ausdrucks
        }
    } catch (err) {
        console.error("Fehler beim Parsen des Ausdrucks:", err);
        return expression;  // Falls Fehler, gib den ursprünglichen Ausdruck zurück
    }
  }
  
  // Macht die Funktion global verfügbar
  window.convertToLatex = convertToLatex;
  
