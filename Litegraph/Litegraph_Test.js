// LiteGraph Setup für mehrere Instanzen

// Farben
window.fbNodesColor = "#D0AF8B"; // Orange
window.srcNodesColor = "#879BCE"; // Blau
window.opNodesColor = "#88B19B"; // Grün
window.paramNodesColor = "#D1AE8B"; // Senfgelb
window.bgColor1 = "#FFFFFF"; // Weiß
window.bgColor2 = "#959EAA"; // Grau
window.outLabelsColor = fbNodesColor; // Orange
window.inLabelsColor = opNodesColor; // Grün
window.paramLabelsColor = paramNodesColor; // Senfgelb
window.textAnzeigeColor = paramNodesColor; // Gelb
window.canvasbgColor = "#232744"; // Dunkelblau

// Parameter der Input-/Output-Labels
window.labelInputPosX = 10;
window.labelWidth = 10; // Wichtig für out; sollte labelInputPosX entsprechen
window.labelHeight = 14; // Höhe des Trichters (von Basis bis Spitze)

// Globale Funktionen zur Mathe-Darstellung
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
        const svgNode = MathJax.tex2svg(equation);
        const svg = svgNode.querySelector("svg");

        const svgString = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(svgString);

        return img;
    } catch (err) {
        console.error("Fehler beim Rendern der Gleichung mit MathJax:", err);
        return null;
    }
}
window.renderWithMathJax = renderWithMathJax;

function convertToLatex(expression) {
    try {
        let leftSide = '';
        let rightSide = expression;

        if (expression.includes('=')) {
            const parts = expression.split('=');
            leftSide = parts[0].trim();
            rightSide = parts[1].trim();
        }

        const node = math.parse(rightSide);
        const latexRightSide = node.toTex();

        if (leftSide) {
            const nodel = math.parse(leftSide);
            const latexLeftSide = nodel.toTex();
            return `${latexLeftSide} = ${latexRightSide}`;
        } else {
            return latexRightSide;
        }
    } catch (err) {
        console.error("Fehler beim Parsen des Ausdrucks:", err);
        return expression;
    }
}
window.convertToLatex = convertToLatex;

// Funktion zum Erstellen einer LiteGraph-Instanz
function createLiteGraphInstance(containerId, setupFunction) {
    const container = document.getElementById(containerId);

    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 800;
    canvas.id = `graphCanvas_${containerId}`;
    canvas.style.position = "relative";
    container.appendChild(canvas);

    const graph = new LiteGraph.LGraph();
    const graphCanvas = new LiteGraph.LGraphCanvas(`#${canvas.id}`, graph);

    graphCanvas.clear_background_color = window.canvasbgColor;

    if (setupFunction) {
        setupFunction(graph, LiteGraph);
    }

    graph.start(30);

    return { graph, graphCanvas };
}

// Anpassung für Touch-Events
function setupTouchEvents(graphInstances) {
    graphInstances.forEach(({ graph, graphCanvas }) => {
        const canvasElement = graphCanvas.canvas;

        canvasElement.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            const rect = canvasElement.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const touchedNode = graph.getNodeOnPos(x, y);
            if (touchedNode) {
                console.log("Node getroffen:", touchedNode.title);
                e.preventDefault();
            }

            const simulatedEvent = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvasElement.dispatchEvent(simulatedEvent);
        });

        canvasElement.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            const rect = canvasElement.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const movedNode = graph.getNodeOnPos(x, y);
            if (movedNode) {
                console.log("Node wird bewegt:", movedNode.title);
                e.preventDefault();
            }

            const simulatedEvent = new MouseEvent("mousemove", {
                bubbles: true,
                cancelable: true,
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvasElement.dispatchEvent(simulatedEvent);
        });

        canvasElement.addEventListener("touchend", (e) => {
            const simulatedEvent = new MouseEvent("mouseup", {
                bubbles: true,
                cancelable: true,
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY,
            });
            canvasElement.dispatchEvent(simulatedEvent);
        });
    });
}

// Importiere Nodes und Setups
import { _FunctionNode } from './SynthNodes/CustomFunctionNode.js';
import { _CustomTimeNode } from './SynthNodes/CustomTimeNode.js';
import { _CustNumberNode } from './SynthNodes/CustomNumberNode.js';
import { _uvNode } from './SynthNodes/Custom_UV_Node.js';
import { _CustWatchNodeString } from './SynthNodes/CustWatchNodeString.js';
import { _CustWatchNodeValue } from './SynthNodes/CustWatchNodeValue.js';
import { _CustomGraphicsPlot } from './SynthNodes/CustomGraphicsPlotNode.js';
import { _OperationNode } from './SynthNodes/CustOperationNode.js';
import { _AudioNode } from './SynthNodes/AudioNode.js';

import { _TextInputNode } from './WordNodes/TextInputNode.js';
import { _TextDisplayNode } from './WordNodes/TextDisplayNode.js';
import { TextManipulationLogic } from './WordNodes/TextManipulationLogic.js';
import { createTextManipulationNode } from './WordNodes/TextManipulationNode.js';

import { nodeSetupSynth1 } from '../TestSetups/nodeSetupSynth1.js';
import { nodeSetupWords1 } from '../TestSetups/nodeSetupWords1.js';
import { nodeSetupWords2 } from '../TestSetups/nodeSetupWords2.js';

// Registrierung der Nodes
function registerLiteGraphNodes(LiteGraph) {
    LiteGraph.registerNodeType("custom/func", _FunctionNode);
    LiteGraph.registerNodeType("custom/cconst", _CustNumberNode);
    LiteGraph.registerNodeType("custom/uvNode", _uvNode);
    LiteGraph.registerNodeType("custom/cwatchS", _CustWatchNodeString);
    LiteGraph.registerNodeType("custom/cwatchV", _CustWatchNodeValue);
    LiteGraph.registerNodeType("custom/plot", _CustomGraphicsPlot);
    LiteGraph.registerNodeType("custom/time", _CustomTimeNode);
    LiteGraph.registerNodeType("custom/Operation", _OperationNode);
    LiteGraph.registerNodeType("custom/AudioNode", _AudioNode);

    LiteGraph.registerNodeType("Wortmaschinen/TextInputNode", _TextInputNode);
    LiteGraph.registerNodeType("Wortmaschinen/TextDisplayNode", _TextDisplayNode);

    TextManipulationLogic.forEach((nodeDefinition) => {
        const sanitizedTitle = nodeDefinition.title.replace(/\s+/g, "").toLowerCase();
        const NodeClass = createTextManipulationNode(nodeDefinition);
        LiteGraph.registerNodeType(`Wortmaschinen/${sanitizedTitle}`, NodeClass);
    });
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    registerLiteGraphNodes(LiteGraph);

    const graphInstances = [
        createLiteGraphInstance("graphContainer1", nodeSetupSynth1),
        createLiteGraphInstance("graphContainer2", nodeSetupWords1),
        createLiteGraphInstance("graphContainer3", nodeSetupWords2),
    ];

    setupTouchEvents(graphInstances);
});