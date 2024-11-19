// Farben

window.fbNodesColor = "#A84008"; //Orange
window.srcNodesColor = "#0079B5"; //Blau
window.opNodesColor = "#43715D"; //Grün
window.paramNodesColor = "#BFB700"; //Senfgelb
window.bgColor1 = "#FFFFFF"; //Weiß
window.bgColor2 = "#959EAA"; //Grau
window.outLabelsColor = "#A84008"; //Orange
window.inLabelsColor = "#43715D"; //Grün
window.paramLabelsColor = "#BFB700"; //Senfgelb
window.textAnzeigeColor = "#FFAF2F" //Gelb

//Parameter der In und Output Labels:
window.labelInputPosX = 10;
window.labelWidth = 10; // Nur wichtig für out. sollte label inputpos x entsprechen
window.labelHeight = 14; // Höhe des Trichters (von Basis bis Spitze)



function _1(md){return(
md`# LiteGraph Example 1.1
Here is a simple [Litegraph.js@0.7.8](https://github.com/jagenjo/litegraph.js) example demonstrating Observable integration and how to create a custom operation (multiplication).

Graph values will update in real time.  Tweaking the numbers in either \`Const Number\` node will change results in \`Watch\`. You can also add/remove nodes using the right-click context menu to create more complex behaviours.`
)}

function _2(html){return(
html`<link href="https://unpkg.com/litegraph.js@0.7.8/css/litegraph.css" rel="stylesheet" />`
)}

function _graphCell(html)
{
  return html`<div ><canvas width=1400 height=800 id="graphDiv" style="position: absolute;"></canvas></div>`
}


function _results(){return(
0
)}

function _5(md){return(
md`## Controls

* **Right-Click (on canvas)** - Context menu
* **Right-Click (on node)** - Change node properties
* **Left-Click (on node)** - Interact with node controls
* **Left-Click + Drag (on node)** - Drag node
* **Left-Click + Drag (on canvas)** - Pan
* **Ctrl+ Left-Click + Drag (on canvas)** - Marquee Selection
* **Mouse-Wheel** - Zoom
`
)}


// CustomNodes in separate Datei ausgelagert

//Synth
import { _FunctionNode } from './SynthNodes/CustomFunctionNode.js';
import { _CustomTimeNode } from './SynthNodes/CustomTimeNode.js';
import { _CustNumberNode } from './SynthNodes/CustomNumberNode.js';
import { _uvNode } from './SynthNodes/Custom_UV_Node.js';
import { _CustWatchNodeString } from './SynthNodes/CustWatchNodeString.js';
import { _CustWatchNodeValue } from './SynthNodes/CustWatchNodeValue.js';
import { _CustomGraphicsPlot } from './SynthNodes/CustomGraphicsPlotNode.js';
import { _OperationNode } from './SynthNodes/CustOperationNode.js';
import { _AudioNode } from './SynthNodes/AudioNode.js';

//Wortmaschinen
import { _TextInputNode } from './WordNodes/TextInputNode.js';
import { _TextDisplayNode } from './WordNodes/TextDisplayNode.js';
//import { _AlphabetCountdownNode } from './WordNodes/AlphabetCountdownNode.js';
import { TextManipulationLogic } from './WordNodes/TextManipulationLogic.js';
import { createTextManipulationNode } from './WordNodes/TextManipulationNode.js';




//Testsetups
import { nodeSetupSynth1 } from './TestSetups/nodeSetupSynth1.js';
import { nodeSetupWords1 } from './TestSetups/nodeSetupWords1.js';
import { nodeSetupWords2 } from './TestSetups/nodeSetupWords2.js';


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

// function renderWithMathJax(equation, ctx, x, y) {
//   return new Promise((resolve, reject) => {
//       MathJax.tex2svgPromise(equation).then((svgNode) => {
//           // Extrahiere das SVG-Element
//           const svg = svgNode.querySelector("svg");
//           const svgString = new XMLSerializer().serializeToString(svg);

//           // Erstelle ein Image-Objekt
//           const img = new Image();

//           img.onload = () => {
//               resolve(img); // Gibt das Bild zurück, wenn es geladen ist
//           };

//           img.onerror = (err) => {
//               reject(err); // Fehlerbehandlung
//           };

//           // Setze die Bildquelle
//           img.src = "data:image/svg+xml;base64," + btoa(svgString);
//       }).catch(reject);
//   });
// }

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





function _graph(graphCell,LiteGraph,FunctionNode,CustNumberNode,uvNode,CustWatchNodeString,CustWatchNodeValue,CustomGraphicsPlot,
  CustomTimeNode,OperationNode,AudioNode,TextInputNode,TextDisplayNode,TextManipulationNodes,$0)
{
  graphCell;
  
  // Register our new custom node
  
// Synth
  LiteGraph.registerNodeType("custom/func", FunctionNode);
  LiteGraph.registerNodeType("custom/cconst", CustNumberNode);
  LiteGraph.registerNodeType("custom/uvNode", uvNode);
  LiteGraph.registerNodeType("custom/cwatchS", CustWatchNodeString);
  LiteGraph.registerNodeType("custom/cwatchV", CustWatchNodeValue);
  LiteGraph.registerNodeType("custom/plot", CustomGraphicsPlot);
  LiteGraph.registerNodeType("custom/time", CustomTimeNode);
  LiteGraph.registerNodeType("custom/Operation", OperationNode);
  LiteGraph.registerNodeType("custom/AudioNode", AudioNode);

  //Wortmaschinen
  LiteGraph.registerNodeType("Wortmaschinen/TextInputNode", TextInputNode);
  LiteGraph.registerNodeType("Wortmaschinen/TextDisplayNode", TextDisplayNode);
  //LiteGraph.registerNodeType("Wortmaschinen/AlphabetCountdownNode", AlphabetCountdownNode)

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

  
  var graph = new LiteGraph.LGraph();
  var canvas = new LiteGraph.LGraphCanvas("#graphDiv", graph);
  
  // Search box triggers "Blocked autofocusing on a <input> element in a cross-origin subframe."
  canvas.allow_searchbox = false;   
  canvas.allow_dragcanvas = false; // Prevent dragging the canvas
  canvas.allow_zoom = false; // Prevent zooming in/out


// Touchinput mit Scroll-Unterdrückung
const canvasElement = document.getElementById("graphDiv");

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




  // Testen von getNodeOnPos bei Klick auf das Canvas
  // document.getElementById("graphDiv").addEventListener("click", (e) => {
  // // Hole die Mausposition relativ zum Canvas
  // const rect = e.target.getBoundingClientRect();
  // const x = e.clientX - rect.left;
  // const y = e.clientY - rect.top;

  // // Prüfen, ob eine Node an dieser Position existiert
  // const clickedNode = graph.getNodeOnPos(x, y);

  // if (clickedNode) {
  //     console.log("Node getroffen:", clickedNode.title);
  // } else {
  //     console.log("Keine Node getroffen. Leere Stelle im Canvas.");
  // }
//});

//console.log(LiteGraph.VERSION); // Gibt die Version aus
//console.log(typeof graph.getNodeOnPos); // Sollte "function" ausgeben

   // Beispielsetups laden

   nodeSetupSynth1(graph, LiteGraph);
   //nodeSetupWords1(graph, LiteGraph);
   //nodeSetupWords2(graph, LiteGraph);

  graph.start(30);

  function loop() {
    graph.runStep();
    canvas.draw(true, true);  // Redraw every frame
    requestAnimationFrame(loop);
  }
  loop();  // Start the loop

  return graph;
}


function _LiteGraph(require){
  return window["LiteGraph"];  // Da die Datei im HTML geladen wird, ist LiteGraph global verfügbar
//return(require('litegraph.js@0.7.8/build/litegraph.js').catch(() => window["LiteGraph"]))
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["html"], _2);
  main.variable(observer("graphCell")).define("graphCell", ["html"], _graphCell);
  main.define("initial results", _results);
  main.variable(observer("mutable results")).define("mutable results", ["Mutable", "initial results"], (M, _) => new M(_));
  main.variable(observer("results")).define("results", ["mutable results"], _ => _.generator);
  main.variable(observer()).define(["md"], _5);

  main.variable(observer("FunctionNode")).define("FunctionNode", _FunctionNode);
  main.variable(observer("CustNumberNode")).define("CustNumberNode", _CustNumberNode);
  main.variable(observer("CustWatchNodeString")).define("CustWatchNodeString", _CustWatchNodeString);
  main.variable(observer("CustWatchNodeValue")).define("CustWatchNodeValue", _CustWatchNodeValue);
  main.variable(observer("CustomGraphicsPlot")).define("CustomGraphicsPlot", _CustomGraphicsPlot);
  main.variable(observer("CustomTimeNode")).define("CustomTimeNode", _CustomTimeNode);
  main.variable(observer("OperationNode")).define("OperationNode", _OperationNode);
  main.variable(observer("uvNode")).define("uvNode", _uvNode);
  main.variable(observer("AudioNode")).define("AudioNode", _AudioNode);
  main.variable(observer("TextInputNode")).define("TextInputNode", _TextInputNode);
  main.variable(observer("TextDisplayNode")).define("TextDisplayNode", _TextDisplayNode);
  //main.variable(observer("AlphabetCountdownNode")).define("AlphabetCountdownNode", _AlphabetCountdownNode);
  // Bereitstellen der Textmanipulations-Nodes
  main.variable(observer("TextManipulationNodes")).define("TextManipulationNodes", () => {
    return TextManipulationLogic.map(nodeDefinition => ({
        name: `Wortmaschinen/${nodeDefinition.title.replace(/\s+/g, "").toLowerCase()}`,
        nodeClass: createTextManipulationNode(nodeDefinition)
    }));
  });


  
  main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","FunctionNode","CustNumberNode","uvNode","CustWatchNodeString","CustWatchNodeValue","CustomGraphicsPlot","CustomTimeNode","OperationNode","AudioNode","TextInputNode","TextDisplayNode","TextManipulationNodes","mutable results"], _graph);
  main.variable(observer("LiteGraph")).define("LiteGraph", ["require"], _LiteGraph);
  return main;
}
//Test