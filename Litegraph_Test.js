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

import { _FunctionNode } from './CustomFunctionNode.js';

import { _CustomTimeNode } from './CustomTimeNode.js';

import { _CustNumberNode } from './CustomNumberNode.js';

import { _CustWatchNodeString } from './CustWatchNodeString.js'

import { _CustWatchNodeValue } from './CustWatchNodeValue.js'

import { _CustomGraphicsPlot } from './CustomGraphicsPlotNode.js'

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

      // Rückgabe des zusammengesetzten Ausdrucks
      if (leftSide) {
          return `${leftSide} = ${latexRightSide}`;  // Zusammensetzen der beiden Teile
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



function _graph(graphCell,LiteGraph,FunctionNode,CustNumberNode,CustWatchNodeString,CustWatchNodeValue,CustomGraphicsPlot,CustomTimeNode,$0)
{
  graphCell;
  
  // Register our new custom node
  

  LiteGraph.registerNodeType("custom/func", FunctionNode);
  LiteGraph.registerNodeType("custom/cconst", CustNumberNode);
  LiteGraph.registerNodeType("custom/cwatchS", CustWatchNodeString);
  LiteGraph.registerNodeType("custom/cwatchV", CustWatchNodeValue);
  LiteGraph.registerNodeType("custom/plot", CustomGraphicsPlot);
  LiteGraph.registerNodeType("custom/time", CustomTimeNode);
  
  var graph = new LiteGraph.LGraph();
  var canvas = new LiteGraph.LGraphCanvas("#graphDiv", graph);
  
  // Search box triggers "Blocked autofocusing on a <input> element in a cross-origin subframe."
  canvas.allow_searchbox = false;   

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

  var nodeCustNum1 = LiteGraph.createNode("custom/cconst");
  nodeCustNum1.pos = [100,200];
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


  var nodeCustWatchS = LiteGraph.createNode("custom/cwatchS");
  nodeCustWatchS.pos = [800,200];
  graph.add(nodeCustWatchS);

  var nodeCustWatchV = LiteGraph.createNode("custom/cwatchV");
  nodeCustWatchV.pos = [800,400];
  graph.add(nodeCustWatchV);

  var nodePlot1 = LiteGraph.createNode("custom/plot");
  nodePlot1.pos = [800,500];
  graph.add(nodePlot1);

  // All nodes must be in the graph before connections can be made.

  //Verbindungen:
  nodeCustNum1.connect(0,nodeFunc1,0);
  nodeCustNum1.connect(0,nodeFunc3,0);
  nodeCustNum2.connect(0,nodeFunc3,1);
  nodeFunc1.connect(0,nodeFunc2,0);

  nodeFunc3.connect(0,nodeFunc2,1);

  nodeFunc2.connect(0,nodeCustWatchS,0);
  nodeFunc2.connect(0,nodeCustWatchV,0);
  nodeFunc2.connect(0,nodePlot1,0);



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
  
  graph.start()
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
  
  main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","FunctionNode","CustNumberNode","CustWatchNodeString","CustWatchNodeValue","CustomGraphicsPlot","CustomTimeNode","mutable results"], _graph);
  main.variable(observer("LiteGraph")).define("LiteGraph", ["require"], _LiteGraph);
  return main;
}
