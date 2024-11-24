window.fbNodesColor = "#D0AF8B"; //Orange
window.srcNodesColor = "#879BCE"; //Blau
window.opNodesColor = "#88B19B"; //Grün
window.paramNodesColor = "#D1AE8B"; //Senfgelb
window.bgColor1 = "#FFFFFF"; //Weiß
window.bgColor2 = "#959EAA"; //Grau
window.outLabelsColor = fbNodesColor; //Orange
window.inLabelsColor = opNodesColor; //Grün
window.paramLabelsColor = paramNodesColor; //Senfgelb
window.textAnzeigeColor = paramNodesColor; //Gelb
window.canvasbgColor = "#232744"; //Dunkelblau 



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
    // Synth
    LiteGraph.registerNodeType("Funktionenmaschinen/func", FunctionNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/cconst", CustNumberNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/uvNode", uvNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/cwatchS", CustWatchNodeString);
    LiteGraph.registerNodeType("Funktionenmaschinen/cwatchV", CustWatchNodeValue);
    LiteGraph.registerNodeType("Funktionenmaschinen/plot", CustomGraphicsPlot);
    LiteGraph.registerNodeType("Funktionenmaschinen/time", CustomTimeNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/Operation", OperationNode);
    LiteGraph.registerNodeType("Funktionenmaschinen/AudioNode", AudioNode);

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



// Erstelle eine neue Graph-Instanz

    var graph = new LGraph();

    // Erstelle eine neue Canvas-Instanz
    var canvas = new LGraphCanvas(`#${canvasId}`, graph);

    // Speichere den Graph im Canvas-Element
    canvasElement.graph = graph; 

    // Hintergrundbild setzen
    canvas.background_image = null; 
    canvas.clear_background_color =canvasbgColor;

    // Search box triggers "Blocked autofocusing on a <input> element in a cross-origin subframe."
    canvas.allow_searchbox = false;   
    canvas.allow_dragcanvas = false; // Prevent dragging the canvas
    canvas.allow_zoom = false; // Prevent zooming in/out


    // Touchinput mit Scroll-Unterdrückung
// const canvasElement = document.getElementById("graphDiv");
// let touchTimeout;

// canvasElement.addEventListener("touchstart", (e) => {
//     touchTimeout = setTimeout(() => {
//         console.log("Long touch erkannt! Simuliere Rechtsklick.");
//         const touch = e.touches[0];

//         // Simuliert ein contextmenu (Rechtsklick) Event
//         const simulatedRightClick = new MouseEvent("contextmenu", {
//             bubbles: true,
//             cancelable: true,
//             clientX: touch.clientX,
//             clientY: touch.clientY,
//         });

//         canvasElement.dispatchEvent(simulatedRightClick);
//     }, 500); // 500ms für langes Drücken
// });

// canvasElement.addEventListener("touchend", () => {
//     clearTimeout(touchTimeout); // Timeout abbrechen, wenn der Finger losgelassen wird
// });

// canvasElement.addEventListener("mousedown", () => {
//     if (document.activeElement !== canvasElement) {
//         canvasElement.focus();
//     }
// });

// canvasElement.addEventListener("touchstart", () => {
//     if (document.activeElement !== canvasElement) {
//         canvasElement.focus();
//     }
// });
canvasElement.addEventListener("touchstart", (e) => {
    // Prüfen, ob es genau zwei aktive Touchpunkte gibt
    if (e.touches.length === 2) {
        const touch1 = e.touches[0]; // Der erste Finger
        const touch2 = e.touches[1]; // Der zweite Finger

        // Simuliere ein contextmenu (Rechtsklick) Event basierend auf Finger 1
        const simulatedRightClick = new MouseEvent("contextmenu", {
            bubbles: true, // Event wird an übergeordnete Elemente weitergeleitet
            cancelable: true, // Event kann gestoppt werden
            view: window,
            clientX: touch1.clientX, // X-Position von Finger 1
            clientY: touch1.clientY, // Y-Position von Finger 1
            button: 2, // Rechte Maustaste
            buttons: 2 // Rechte Maustaste gedrückt
        });

        canvasElement.dispatchEvent(simulatedRightClick);

        // Optional: Verhindere Standard-Scroll-/Zoom-Gesten
        e.preventDefault();
    }
}, false);

canvasElement.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) {
        console.log("Zwei-Finger-Touch beendet.");
    }
});


canvasElement.addEventListener("touchstart", (e) => {
    //canvasElement.focus(); 
    touchTimeout = setTimeout(() => {
        //e.preventDefault(); // Unterdrücke das Scrollen
        //console.log("Long touch erkannt! Simuliere Rechtsklick.");
        const touch = e.touches[0];

        // Simuliert ein contextmenu (Rechtsklick) Event
        const simulatedRightClick = new MouseEvent("contextmenu", {
            bubbles: true, // Event wird an übergeordnete Elemente weitergeleitet
            cancelable: false, // Event kann gestoppt werden
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY,
            button: 2, // Rechte Maustaste
            buttons: 2 // Rechte Maustaste gedrückt
        });

        canvasElement.dispatchEvent(simulatedRightClick);
    }, 500); // 500ms für langes Drücken
}, );

canvasElement.addEventListener("touchend", () => {
    clearTimeout(touchTimeout); // Timeout abbrechen, wenn der Finger losgelassen wird
});

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







    // Beispielknoten hinzufügen
    // var node_const = LiteGraph.createNode("basic/const");
    // node_const.pos = [200, 200];
    // graph.add(node_const);
    // node_const.setValue(Math.random() * 10); // Zufälliger Wert für Variation

    // var node_watch = LiteGraph.createNode("basic/watch");
    // node_watch.pos = [700, 200];
    // graph.add(node_watch);

    // // Verbinde die Knoten
    // node_const.connect(0, node_watch, 0);

    // Graph starten
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
  
  function renderWithMathJax(equation) {
    try {
        // Render die Gleichung in SVG
        const svgNode = MathJax.tex2svg(equation);
        const svg = svgNode.querySelector("svg");
  
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
  