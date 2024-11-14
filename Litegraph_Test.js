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

import { _FunctionNode } from './SynthNodes/CustomFunctionNode.js';

import { _CustomTimeNode } from './SynthNodes/CustomTimeNode.js';

import { _CustNumberNode } from './SynthNodes/CustomNumberNode.js';

import { _uvNode } from './SynthNodes/Custom_UV_Node.js';

import { _CustWatchNodeString } from './SynthNodes/CustWatchNodeString.js';

import { _CustWatchNodeValue } from './SynthNodes/CustWatchNodeValue.js';

import { _CustomGraphicsPlot } from './SynthNodes/CustomGraphicsPlotNode.js';

import { _OperationNode } from './SynthNodes/CustOperationNode.js';

import { _AudioNode } from './SynthNodes/AudioNode.js';


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





function _graph(graphCell,LiteGraph,FunctionNode,CustNumberNode,uvNode,CustWatchNodeString,CustWatchNodeValue,CustomGraphicsPlot,CustomTimeNode,OperationNode,AudioNode,$0)
{
  graphCell;
  
  // Register our new custom node
  

  LiteGraph.registerNodeType("custom/func", FunctionNode);
  LiteGraph.registerNodeType("custom/cconst", CustNumberNode);
  LiteGraph.registerNodeType("custom/uvNode", uvNode);
  LiteGraph.registerNodeType("custom/cwatchS", CustWatchNodeString);
  LiteGraph.registerNodeType("custom/cwatchV", CustWatchNodeValue);
  LiteGraph.registerNodeType("custom/plot", CustomGraphicsPlot);
  LiteGraph.registerNodeType("custom/time", CustomTimeNode);
  LiteGraph.registerNodeType("custom/Operation", OperationNode);
  LiteGraph.registerNodeType("custom/AudioNode", AudioNode);
  
  var graph = new LiteGraph.LGraph();
  var canvas = new LiteGraph.LGraphCanvas("#graphDiv", graph);
  
  // Search box triggers "Blocked autofocusing on a <input> element in a cross-origin subframe."
  canvas.allow_searchbox = false;   
  canvas.allow_dragcanvas = false; // Prevent dragging the canvas
  canvas.allow_zoom = false; // Prevent zooming in/out

  /** Disable LiteGraph Input prompts
   *
   * @note
   * Some LiteGraph widgets support left-click Input pop-ups
   * that also throw "Blocked autofocusing on a <input> element 
   * in a cross-origin subframe"
   * 
   * There's no flag to disable so instead this snippet replaces
   * the `prompt` function to keep LiteGraph spawning a pop-up.
   */
  //  canvas.prompt = (title,value,callback,event)=>{ return null; };

//Beispiel:

//Numbernodes

  var nodeCustNum1 = LiteGraph.createNode("custom/uvNode");
  nodeCustNum1.pos = [100,250];
  nodeCustNum1.widgets[0].value = 42;  // Setze den Wert des ersten Widgets (Number Widget)
  nodeCustNum1.properties.value = 42;  
  nodeCustNum1.widgets[1].value = "x"; // Setze den Wert des zweiten Widgets (Text Widget)
  nodeCustNum1.properties.rightSide = "x";
  graph.add(nodeCustNum1);

  var nodeCustNum2 = LiteGraph.createNode("custom/cconst");
  nodeCustNum2.pos = [100,400];
  nodeCustNum2.widgets[0].value = 0.2;  // Setze den Wert des ersten Widgets (Number Widget)
  nodeCustNum2.properties.value = 0.2;  
  nodeCustNum2.widgets[1].value = "b"; // Setze den Wert des zweiten Widgets (Text Widget)
  nodeCustNum2.properties.rightSide = "b";
  graph.add(nodeCustNum2);

//Time

var nodeAudio = LiteGraph.createNode("custom/AudioNode");
nodeAudio.pos = [550,50];
graph.add(nodeAudio);


var nodeTime1 = LiteGraph.createNode("custom/time");
nodeTime1.pos = [100,600];
graph.add(nodeTime1);

//Funcnodes

  var nodeFunc1 = LiteGraph.createNode("custom/func");
  nodeFunc1.pos = [400,200];
  nodeFunc1.code_widget.value = "f(x) = x-2"; 
  if (nodeFunc1.code_widget.callback) {
    nodeFunc1.code_widget.callback(nodeFunc1.code_widget.value, null, nodeFunc1); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
  }
  graph.add(nodeFunc1);

  var nodeOper1 = LiteGraph.createNode("custom/Operation");
  nodeOper1.pos = [600,500];
  nodeOper1.code_widget.value = "+"; 
  if (nodeOper1.code_widget.callback) {
    nodeOper1.code_widget.callback(nodeOper1.code_widget.value, null, nodeOper1); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
  }
  graph.add(nodeOper1);

  var nodeFunc2 = LiteGraph.createNode("custom/func");
  nodeFunc2.pos = [600,200];
  nodeFunc2.code_widget.value = "g(x) = 1/x+h(x)"; 
  if (nodeFunc2.code_widget.callback) {
    nodeFunc2.code_widget.callback(nodeFunc2.code_widget.value, null, nodeFunc2); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
  }
  graph.add(nodeFunc2);


  var nodeFunc3 = LiteGraph.createNode("custom/func");
  nodeFunc3.pos = [400,400];
  nodeFunc3.code_widget.value = "h(x) = x^2+b"; 
  if (nodeFunc3.code_widget.callback) {
    nodeFunc3.code_widget.callback(nodeFunc3.code_widget.value, null, nodeFunc3); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
  }
  graph.add(nodeFunc3);

  var nodeFunc4 = LiteGraph.createNode("custom/func");
  nodeFunc4.pos = [190,50];
  nodeFunc4.code_widget.value = "f(x) = sin (1000 * x)"; 
  if (nodeFunc4.code_widget.callback) {
    nodeFunc4.code_widget.callback(nodeFunc4.code_widget.value, null, nodeFunc4); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
  }
  graph.add(nodeFunc4);


  var nodeCustWatchS = LiteGraph.createNode("custom/cwatchS");
  nodeCustWatchS.pos = [900,200];
  graph.add(nodeCustWatchS);

  var nodeCustWatchV = LiteGraph.createNode("custom/cwatchV");
  nodeCustWatchV.pos = [900,100];
  graph.add(nodeCustWatchV);

  var nodeCustWatchS2 = LiteGraph.createNode("custom/cwatchS");
  nodeCustWatchS2.pos = [900,400];
  graph.add(nodeCustWatchS2);

  var nodeCustWatchV2 = LiteGraph.createNode("custom/cwatchV");
  nodeCustWatchV2.pos = [800,600];
  graph.add(nodeCustWatchV2);

  var nodePlot1 = LiteGraph.createNode("custom/plot");
  nodePlot1.pos = [1000,550];
  graph.add(nodePlot1);


  // All nodes must be in the graph before connections can be made.

  //Verbindungen:
  nodeCustNum1.connect(0,nodeFunc1,0);
  nodeCustNum1.connect(0,nodeFunc3,0);
  nodeCustNum2.connect(0,nodeFunc3,1);
  nodeFunc1.connect(0,nodeFunc2,0);

  nodeFunc3.connect(0,nodeFunc2,1);
  nodeFunc3.connect(0,nodePlot1,2);
  nodeFunc3.connect(0,nodeOper1,1);

  nodeFunc2.connect(0,nodeCustWatchS,0);
  nodeFunc2.connect(0,nodeCustWatchV,0);
  nodeFunc2.connect(0,nodePlot1,0);
  nodeFunc2.connect(0,nodeOper1,0);


  nodeOper1.connect(0,nodeCustWatchS2,0);
  nodeOper1.connect(0,nodeCustWatchV2,0);

  nodeCustNum1.connect(0,nodeFunc4,0);
  nodeFunc4.connect(0,nodeAudio,0);





  // nodeConstB.connect(0,nodeMult,1);
  
  // var nodeWatch = LiteGraph.createNode("basic/watch");
  // nodeWatch.pos = [700,250];
  // graph.add(nodeWatch);

  // Create an Observable mutate wrapper to copy the results of our multiplcation in to the `results` var
  // var nodeObserve = LiteGraph.createNode("custom/observable");
  // nodeObserve.setMutator((value)=>{
  //   $0.value = value;
  // });
  // nodeObserve.pos = [700,350];
  // graph.add(nodeObserve);
  
  // nodeMult.connect(0, nodeWatch, 0 );
  // nodeMult.connect(0, nodeObserve, 0 );
  
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
  
  main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","FunctionNode","CustNumberNode","uvNode","CustWatchNodeString","CustWatchNodeValue","CustomGraphicsPlot","CustomTimeNode","OperationNode","AudioNode","mutable results"], _graph);
  main.variable(observer("LiteGraph")).define("LiteGraph", ["require"], _LiteGraph);
  return main;
}
