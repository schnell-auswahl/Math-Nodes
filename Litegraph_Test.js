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
    // console.log("osjdbfsodnfb")
    let a = this.getInputData(0) || 0;
    let b = this.getInputData(1) || 0;
    
    this.setOutputData(0,a*b);
  }
}
)}



function _FunctionNode() {return(
class FunctionNode {
  constructor() {
  this.addInput("in", "object");
  this.addOutput("", "object");
  this.properties = { x: 1.0, formula: "x**2", str: "x**2" };
  this.code_widget = this.addWidget(
      "text",
      "F(x,y)",
      this.properties.formula,
      function(v, canvas, node) {
          node.properties.formula = v;
      }
  );
  // this.addWidget("toggle", "allow", LiteGraph.allow_scripts, function(v) {
  //     LiteGraph.allow_scripts = v;
  // });
  this._func = null;

  this.title = "Func";
  this.desc = "Compute formula";
  this.size = [160, 70];
  }

// MathAverageFilter.prototype.onPropertyChanged = function(name, value) {
//     if (name == "formula") {
//         this.code_widget.value = value;
//     }
// };

  onExecute() {
    // if (!LiteGraph.allow_scripts) {
    //     return;
    // }
    if(this.getInputData(0)) {
      var x = this.getInputData(0)["value"];
      // var y = this.getInputData(1);
      var str = this.getInputData(0)["str"];
      if (x != null) {
          this.properties["x"] = x;
      } else {
          x = this.properties["x"];
      }

      if (str != null) {
          this.properties["str"] = str;
      } else {
          str = this.properties["str"];
      }

      var f = this.properties["formula"];

      var value;
      try {
          if (!this._func || this._func_code != this.properties.formula) {
              this._func = new Function(
                  "x",
                  "t",
                  "return " + this.properties.formula
              );
              this._func_code = this.properties.formula;
          }
          value = this._func(x, this.graph.globaltime);
          this.boxcolor = null;
      } catch (err) {
          this.boxcolor = "red";
      }
      this.setOutputData(0, {value: value, str: this.properties["str"]});
      // this.setOutputData(0, value);
    }
  };

  getTitle() {
  // TODO: Display math nicely
    return this._func_code || "Funktion";
  };

  onDrawBackground() {
  // TODO: Change this to something like "f(x)"
    var f = this.properties["formula"];
    if (this.outputs && this.outputs.length) {
        this.outputs[0].label = f;
    }
  };
})};

function _CustNumberNode(){ return(
  class CustNumberNode {
    constructor() {
      this.addOutput("value", "object");
      // this.addProperty("value", 1.0);
      this.properties = { value: 1.0, str: "a" };
      this.widget = this.addWidget("number","value",1,"value");
      this.widgets_up = true;
      this.size = [180, 30];
    };

    onExecute() {
      var output = {value: parseFloat(this.properties["value"]),  str: this.properties["str"]}
      this.setOutputData(0, output);
    };

    getTitle() {
      if (this.flags.collapsed) {
          return this.properties.value;
      }
      return this.title;
    };

    setValue(v) {
      this.setProperty("value",v);
      console.log("in setValue");
    }

    onDrawBackground() {
      //show the current value
      this.outputs[0].label = this.properties["value"].toFixed(3);
      // console.log("in drawBackground");
    };
  }
)}


// function _CustNumberNode(){ return(
//   class CustNumberNode {
//     constructor() {
function _CustWatchNode() { return(
  class CustWatchNode {
    constructor() {
      this.size = [60, 30];
      this.addInput("value", 0, { label: "" });
      this.value = 0;
      this.title = "Watch";
      this.desc = "Show value of input";
    }

    onExecute() {
      if (this.inputs[0]) {
          this.value = this.getInputData(0);
      }
    };

    getTitle() {
      if (this.flags.collapsed) {
          return this.inputs[0].label;
      }
      return this.title;
    };

    toString = function(o) {
      if (o == null) {
          return "null";
      } else if (o.constructor === Number) {
          return o.toFixed(3);
      } else if (o.constructor === Array) {
          var str = "[";
          for (var i = 0; i < o.length; ++i) {
              str += Watch.toString(o[i]) + (i + 1 != o.length ? "," : "");
          }
          str += "]";
          return str;
      } else {
          // return String(o);
          // Math.round((num + Number.EPSILON) * 100) / 100
          var num = o["value"];
          num = Math.round((num + Number.EPSILON) * 100) / 100;
          return "Value: " + num + ", String: " + o["str"];
      }
    };

    onDrawBackground = function(ctx) {
      //show the current value
      this.inputs[0].label = this.toString(this.value);
      // this.inputs[0].label = "Hi Nico"
    };
  }
)}





function _graph(graphCell,LiteGraph,CustomMultNode,FunctionNode,CustNumberNode,CustWatchNode,$0)
// function _graph(graphCell,LiteGraph,CustomMultNode,ObservableNode,$0)
// function _graph(graphCell,LiteGraph,CustomMultNode,ObservableNode,MathFormula,$0)
{
  graphCell;
  
  // Register our new custom node
  LiteGraph.registerNodeType("custom/multiply",CustomMultNode);
  // LiteGraph.registerNodeType("custom/observable",ObservableNode);
  LiteGraph.registerNodeType("custom/func", FunctionNode);
  // LiteGraph.registerNodeType("custom/formula", MathFormula);
  LiteGraph.registerNodeType("custom/cconst", CustNumberNode);
  LiteGraph.registerNodeType("custom/cwatch", CustWatchNode);
  
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
  // var nodeConstA = LiteGraph.createNode("basic/const");
  // nodeConstA.pos = [200,200];
  // nodeConstA.setValue(4.5);
  // graph.add(nodeConstA);

  // var nodeConstB = LiteGraph.createNode("basic/const");
  // nodeConstB.pos = [200,300];
  // nodeConstB.setValue(1.5);
  // graph.add(nodeConstB);

  var nodeCustConst = LiteGraph.createNode("custom/cconst");
  nodeCustConst.pos = [200,200];
  graph.add(nodeCustConst);
  
  var nodeMult = LiteGraph.createNode("custom/multiply");
  nodeMult.pos = [500,250];
  graph.add(nodeMult);

  var nodeFunc1 = LiteGraph.createNode("custom/func");
  nodeFunc1.pos = [500,350];
  graph.add(nodeFunc1);

  var nodeCustWatch = LiteGraph.createNode("custom/cwatch");
  nodeCustWatch.pos = [500,100];
  graph.add(nodeCustWatch);

  // All nodes must be in the graph before connections can be made.
  //nodeConstA.connect(0,nodeMult,0);
  // nodeConstB.connect(0,nodeMult,1);
  
  var nodeWatch = LiteGraph.createNode("basic/watch");
  nodeWatch.pos = [700,250];
  graph.add(nodeWatch);

  // Create an Observable mutate wrapper to copy the results of our multiplcation in to the `results` var
  // var nodeObserve = LiteGraph.createNode("custom/observable");
  // nodeObserve.setMutator((value)=>{
  //   $0.value = value;
  // });
  // nodeObserve.pos = [700,350];
  // graph.add(nodeObserve);
  
  nodeMult.connect(0, nodeWatch, 0 );
  // nodeMult.connect(0, nodeObserve, 0 );
  
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
  // main.variable(observer("ObservableNode")).define("ObservableNode", _ObservableNode);
  // main.variable(observer("MathFormula")).define("MathFormula", _MathFormula);
  main.variable(observer("FunctionNode")).define("FunctionNode", _FunctionNode);
  main.variable(observer("CustNumberNode")).define("CustNumberNode", _CustNumberNode);
  main.variable(observer("CustWatchNode")).define("CustWatchNode", _CustWatchNode);
  // main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomMultNode","ObservableNode","mutable results"], _graph);
  // main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomMultNode","ObservableNode","MathFormula","mutable results"], _graph);
  main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomMultNode","FunctionNode","CustNumberNode","CustWatchNode","mutable results"], _graph);
  main.variable(observer("LiteGraph")).define("LiteGraph", ["require"], _LiteGraph);
  return main;
}
