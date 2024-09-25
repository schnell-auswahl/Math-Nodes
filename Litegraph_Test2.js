function _1(md){return(
md`# LiteGraph Example 2
Here is a simple [Litegraph.js@0.7.8](https://github.com/jagenjo/litegraph.js) example demonstrating Observable integration and how to create a custom operation (multiplication).

Graph values will update in real time.  Tweaking the numbers in either \`Const Number\` node will change results in \`Watch\`. You can also add/remove nodes using the right-click context menu to create more complex behaviours.`
)}

function _2(html){return(
html`<link href="https://unpkg.com/litegraph.js@0.7.8/css/litegraph.css" rel="stylesheet" />`
)}

function _graphCell(html)
{
  return html`<div ><canvas width=1000 height=600 id="graphDiv"></canvas></div>`
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

function _CustomMultNode(){return(
class CustomMultNode {
  constructor(){
    this.title = "Multiplication";
    this.addInput("A","number");
    this.addInput("B","number");
    this.addOutput("A*B","number");
    this.properties = { precision: 0.1 };
  }
  
  onExecute(){
    let a = this.getInputData(0) || 0;
    let b = this.getInputData(1) || 0;
    
    this.setOutputData(0,a*b);
  }
}
)}

function _CustomGrundRaNode(){return(
class CustomGrundRaNode {
  constructor(){
    this.title = "GrundrechenartenAdd";
    this.addInput("A","number");
    this.addInput("B","number");
    this.addOutput("A+B","number");
    this.properties = { precision: 0.1 };
  }
    
    onExecute(){
    let a = this.getInputData(0) || 0;
    let b = this.getInputData(1) || 0;
      
    this.setOutputData(0,a+b);
  }
}
)}

function _ObservableNode(){return(
class ObservableNode {
  constructor(mutator){
    this.title = "ObservableNode";
    this.addInput("A","number");
    this.addOutput("A","number");
    this.properties = { precision: 0.1 };
    this.mutator = mutator;
    
    console.log("Created");
  }
  
  setMutator(callback){
    this.mutator = callback;
  }
  
  onExecute(){
    let a = this.getInputData(0) || 0;
    if(this.mutator)this.mutator(a);
    this.setOutputData(0,a);
  }
}
)}



function _graph(graphCell,LiteGraph,CustomGrundRaNode,CustomMultNode,ObservableNode,$0)
{
  graphCell;
  
  // Register our new custom node
  LiteGraph.registerNodeType("custom/GRA",CustomGrundRaNode);
  LiteGraph.registerNodeType("custom/multiply",CustomMultNode);
  LiteGraph.registerNodeType("custom/observable",ObservableNode);
  
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
   canvas.prompt = (title,value,callback,event)=>{ return null; };

  // Set up a simple example multipling A*B (where A & B are const numeric inputs)
  var nodeConstA = LiteGraph.createNode("basic/const");
  nodeConstA.pos = [200,200];
  nodeConstA.setValue(4.5);
  graph.add(nodeConstA);

  var nodeConstB = LiteGraph.createNode("basic/const");
  nodeConstB.pos = [200,300];
  nodeConstB.setValue(1.5);
  graph.add(nodeConstB);
  
  /*
  var nodegra = LiteGraph.createNode("custom/gra");
  nodegra.pos = [700,400];
  graph.add(nodegra);
  */

  var nodeMult = LiteGraph.createNode("custom/multiply");
  nodeMult.pos = [500,250];
  graph.add(nodeMult);

  var nodeGRA = LiteGraph.createNode("custom/GRA");
  nodeGRA.pos = [600,350];
  graph.add(nodeGRA);

  // All nodes must be in the graph before connections can be made.
  nodeConstA.connect(0,nodeMult,0);
  nodeConstB.connect(0,nodeMult,1);
  
  var nodeWatch = LiteGraph.createNode("basic/watch");
  nodeWatch.pos = [700,250];
  graph.add(nodeWatch);

  // Create an Observable mutate wrapper to copy the results of our multiplcation in to the `results` var
  var nodeObserve = LiteGraph.createNode("custom/observable");
  nodeObserve.setMutator((value)=>{
    $0.value = value;
  });
  nodeObserve.pos = [700,350];
  graph.add(nodeObserve);
  
  nodeMult.connect(0, nodeWatch, 0 );
  nodeMult.connect(0, nodeObserve, 0 );
  
  graph.start()
  return graph;
}


function _LiteGraph(require){return(
require('litegraph.js@0.7.8/build/litegraph.js').catch(() => window["LiteGraph"])
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["html"], _2);
  main.variable(observer("graphCell")).define("graphCell", ["html"], _graphCell);
  main.define("initial results", _results);
  main.variable(observer("mutable results")).define("mutable results", ["Mutable", "initial results"], (M, _) => new M(_));
  main.variable(observer("results")).define("results", ["mutable results"], _ => _.generator);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("CustomMultNode")).define("CustomMultNode", _CustomMultNode);
  main.variable(observer("CustomGrundRaNode")).define("CustomGrundRaNode", _CustomGrundRaNode);
  main.variable(observer("ObservableNode")).define("ObservableNode", _ObservableNode);
  main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomGrundRaNode","CustomMultNode","ObservableNode","mutable results"], _graph);
  main.variable(observer("LiteGraph")).define("LiteGraph", ["require"], _LiteGraph);
  return main;
}
