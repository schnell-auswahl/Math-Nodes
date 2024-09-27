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
  this.properties = { x: 1.0, formula: "x**2", str: "x", uvName: ""};
  this.code_widget = this.addWidget(
      "text",
      "",
      // this.properties.formula,
      "Funktionsgleichung",
      function(v, canvas, node) {
          var splitted = v.split("(")
          node.properties["funcName"] = splitted[0];
          node.properties["uvName"] = splitted[1][0];
          node.properties.formula = v.split("=")[1];
      }
  );
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

      var uvName = this.getInputData(0)["uvName"];
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

      // if wrong variable is connected
      if (this.properties["uvName"].length > 0 && this.properties["uvName"] != uvName){
        console.log("-----");
        this.boxcolor = "red";
        var newString = this._insertString(this.properties["str"], this.properties["formula"], this.properties["uvName"]);
        this.setOutputData(0, {value: null, str: newString, uvName: this.properties["uvName"]});
      } else {
        if (uvName != null) {
            this.properties["uvName"] = uvName;
        } else {
            uvName = this.properties["uvName"];
        }

        // var f = this.properties["formula"];

        var value;
        var newString = this._insertString(this.properties["str"], this.properties["formula"], this.properties["uvName"]);
        try {
            if (!this._func || this._func_code != this.properties.formula) {
              this._func = new Function(
                  "x",
                  "TIME",
                  "return " + this.properties.formula
              );
              this._func_code = this.properties.formula;
            }
            value = this._func(x, this.graph.globaltime);
            this.boxcolor = null;
        } catch (err) {
            this.boxcolor = "red";
            this.setOutputData(0, {value: null, str: newString, uvName: this.properties["uvName"]});
        }
        this.setOutputData(0, {value: value, str: newString, uvName: this.properties["uvName"]});
        // this.setOutputData(0, value);
      }
    }
  };

  getTitle() {
    // TODO: Display math nicely
    // var title;
    // if(this._func_code) {
    //   title = "f(" + this.properties["uvName"] + ") = " + this._func_code;
    //   return title;
    // }
    // return "Funktion";
    if(this.properties["formula"] && this.properties["uvName"] && this.properties["funcName"]){
      let title = this.properties["funcName"] + "(" + this.properties["uvName"] + ") = " + this.properties["formula"];
      return title
    } else {
      return "Funktion"
    }
  };

  _insertString(oldString, formula, uvName){
    if(oldString.length <= 1) {
      return formula;
    }
    var outputString = "";
    var parts = formula.split(uvName);
    for (let i=0; i < parts.length -1; i++){
      outputString = outputString + parts[i] + "(" + oldString + ")";
    }
    outputString = outputString + parts[parts.length-1];
    return outputString;
  }

  onDrawBackground() {
    // var outlabel = this.properties["formula"];
    // if (this.outputs && this.outputs.length) {
    //     this.outputs[0].label = outlabel;
    // }
    if(this.properties["uvName"]){
      this.inputs[0].label = this.properties["uvName"];
    } else {
      this.inputs[0].label = "";
    }
    if(this.properties["uvName"] && this.properties["funcName"]){
      this.outputs[0].label = this.properties["funcName"] + "(" + this.properties["uvName"] + ")";
    }
  };
})};




function _CustomTimeNode() { return (
  class CustomTimeNode {
    constructor() {
      this.addOutput("in ms", "number");
      this.addOutput("in sec", "number");
      this.properties = { str: "x"};

      this.nameWidget = this.addWidget("text","Variablenname","x","str");

      this.title = "Time";
      this.desc = "Time";
    }

    onExecute = function() {
      var outputSec = {
        value: this.graph.globaltime,
        str: this.properties["str"],
        uvName: this.properties["str"],
      }
      var outputMil = {
        value: this.graph.globaltime * 1000,
        str: this.properties["str"],
        uvName: this.properties["str"],
      }
      this.setOutputData(0, outputMil);
      this.setOutputData(1, outputSec);
    };

    getTitle() {
      let title = "Variable"
      if(this.properties["str"]){
        title = title + " " + this.properties["str"];
      }
      return title;
    };

    // onDrawBackground() {
    //   //show the current value
    //   // this.outputs[0].label = this.properties["value"].toFixed(3);
    //   // console.log("in drawBackground");
    // };
  }
)}





function _CustNumberNode(){ return(
  class CustNumberNode {
    constructor() {
      this.addOutput("value", "object");
      // this.addProperty("value", 1.0);
      this.properties = { value: 1.0, str: "x"};
      this.numberWidget = this.addWidget("number","Wert",1,"value", {precision: 2});
      this.nameWidget = this.addWidget("text","Variablenname","x","str");
      this.widgets_up = true;
      this.size = [180, 60];
    };

    onExecute() {
      var output = {
        value: parseFloat(this.properties["value"]),
        str: this.properties["str"],
        uvName: this.properties["str"],
        // funcList: ""
      }
      this.setOutputData(0, output);
    };

    getTitle() {
      // if (this.flags.collapsed) {
      //     return this.properties.value;
      // }
      // return this.title;
      let title = "Variable"
      if(this.properties["str"]){
        title = title + " " + this.properties["str"];
      }
      return title;
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


function _CustWatchNodeString() { return(
  class CustWatchNodeString {
    constructor() {
      this.size = [60, 30];
      this.addInput("value", 0, { label: "" });
      this.value = 0;
      this.title = "Gleichung";
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
          return "";
      } else if (!o["str"] || o["str"] == null) {
        return "Fehler";
      } else {
          return "f(" + o["uvName"] + ") = " + o["str"];
      }
    };

    onDrawBackground = function(ctx) {
      //show the current value
      this.inputs[0].label = this.toString(this.value);
      // this.inputs[0].label = "Hi Nico"
    };
  }
)}

function _CustWatchNodeValue() { return(
  class CustWatchNodeValue {
    constructor() {
      this.size = [60, 30];
      this.addInput("value", 0, { label: "" });
      this.value = 0;
      this.title = "Wert";
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
          return "";
      // } else if (o.constructor === Number) {
      //     return o.toFixed(3);
      } else if (!o["value"] || o["value"] == null) {
          return "Fehler";
      } else {
          // return String(o);
          // Math.round((num + Number.EPSILON) * 100) / 100
          var num = o["value"];
          num = Math.round((num + Number.EPSILON) * 100) / 100;
          return num;
      }
    };

    onDrawBackground = function(ctx) {
      //show the current value
      this.inputs[0].label = this.toString(this.value);
      // this.inputs[0].label = "Hi Nico"
    };
  }
)}

// function _CustomGraphicsPlot(){return(
//   class CustomGraphicsPlot {
//     constructor(){
//       this.addInput("A", "Number");
//       this.addInput("B", "Number");
//       this.addInput("C", "Number");
//       this.addInput("D", "Number");
    
//       this.values = [[], [], [], []];
//       this.properties = { xscale: 1, yscale: 2 };
    
//       this.title = "Plot";
//       this.desc = "Plots data over time";
//       this.colors = ["#FFF", "#F99", "#9F9", "#99F"];
//     };

//     onExecute(ctx) {
//       if (this.flags.collapsed) {
//           return;
//       }

//       var size = this.size;

//       for (var i = 0; i < 4; ++i) {
//           var v = this.getInputData(i);
//           if (v == null) {
//               continue;
//           }
//           var values = this.values[i];
//           values.push(v);
//           if (values.length > size[0]) {
//               values.shift();
//           }
//       }
//     };

//     clamp(v, a, b) {
//       return a > v ? a : b < v ? b : v;
//     };

//     onDrawBackground(ctx) {
//       if (this.flags.collapsed) {
//           return;
//       }

//       var size = this.size;

//       var yscale = (0.5 * size[1]) / this.properties.yscale;
//       var xscale = this.properties.xscale;
//       var colors = this.colors;
//       var offset = size[1] * 0.5;

//       ctx.fillStyle = "#000";
//       ctx.fillRect(0, 0, size[0], size[1]);
//       ctx.strokeStyle = "#555";
//       ctx.beginPath();
//       ctx.moveTo(0, offset);
//       ctx.lineTo(size[0], offset);
//       ctx.stroke();

//       if (this.inputs) {
//           for (var i = 0; i < 4; ++i) {
//               var values = this.values[i];
//               if (!this.inputs[i] || !this.inputs[i].link) {
//                   continue;
//               }
//               ctx.strokeStyle = colors[i];
//               ctx.beginPath();
//               var v = values[0] * yscale * -1 + offset;
//               ctx.moveTo(0, this.clamp(v, 0, size[1]));
//               for (var j = 1; j < values.length && j < size[0]; ++j) {
//                   var v = values[j] * yscale * -1 + offset;
//                   ctx.lineTo(j, this.clamp(v, 0, size[1]));
//               }
//               ctx.stroke();
//           }
//       }
//     };
// })};
function _CustomGraphicsPlot(){
  return (
    class CustomGraphicsPlot {
      constructor(){
        this.addInput("Input", "object");  // Eingang für Funktionsgleichung (als String)
        
        // Skalierung und Bereich
        this.properties = { 
          xRange: [-10, 10],  // X-Bereich
          yRange: [-10, 10],  // Y-Bereich
          scaleX: 1,          // Skalierung für X-Achse
          scaleY: 1,          // Skalierung für Y-Achse
          gridSize: 5         // Abstand zwischen Gitternetzlinien
        };

        this.title = "Function Plot with Grid";
        this.desc = "Plots a mathematical function with grid and labels";
        this.colors = ["#FFF", "#F99"];
      }

      // Funktion aus String evaluieren
      evaluateFunction(equation, x) {
        try {
          const safeEquation = equation.replace("^", "**");  // Konvertiere Potenzen
          const func = new Function("x", `return ${safeEquation};`);  // Funktionsausdruck in JS-Function konvertieren
          return func(x);  // Evaluiere Funktion für gegebenen X-Wert
        } catch (error) {
          console.error("Fehler bei der Auswertung der Funktion:", error);
          return null;
        }
      }

      clamp(v, a, b) {
        return a > v ? a : b < v ? b : v;
      };

      onExecute = function() {
        if (this.flags.collapsed || !this.getInputData(0)) {
            return;
        }

        // Hole die Funktionsgleichung aus dem Eingang
        var equation = this.getInputData(0)["str"];  // Funktionsgleichung als String
        
        // Falls keine Gleichung eingegeben wurde, nicht weiter ausführen
        if (!equation) return;
        
        this.equation = equation;  // Speichere die übergebene Gleichung
      };

      onDrawBackground = function(ctx) {
        if (this.flags.collapsed || !this.equation) {
            return;
        }

        var size = this.size;
        var xRange = this.properties.xRange;
        var yRange = this.properties.yRange;
        var scaleX = size[0] / (xRange[1] - xRange[0]);  // Skalierung der X-Achse basierend auf dem Bereich
        var scaleY = size[1] / (yRange[1] - yRange[0]);  // Skalierung der Y-Achse
        var offsetX = -xRange[0] * scaleX;  // Verschiebung auf der X-Achse
        var offsetY = size[1] - (-yRange[0] * scaleY);  // Verschiebung auf der Y-Achse

        // Hintergrund zeichnen
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, size[0], size[1]);

        // Gitternetzlinien zeichnen
        this.drawGrid(ctx, size, scaleX, scaleY, offsetX, offsetY);

        // Funktionswerte berechnen und plotten
        ctx.strokeStyle = this.colors[1];  // Farbe der Linie
        ctx.beginPath();

        // Starte bei minimalem X-Wert
        var step = (xRange[1] - xRange[0]) / size[0];  // Schrittweite entlang der X-Achse
        var x = xRange[0];
        var y = this.evaluateFunction(this.equation, x);  // Evaluiere Funktion

        if (y !== null) {
          var plotX = (x - xRange[0]) * scaleX;  // X-Koordinate im Plot
          var plotY = (yRange[1] - y) * scaleY;  // Y-Koordinate im Plot
          ctx.moveTo(this.clamp(plotX, 0, size[0]), this.clamp(plotY, 0, size[1]));  // Starte den Plot bei diesem Punkt

          // Schleife durch alle X-Werte im Plotbereich
          for (var i = 1; i < size[0]; ++i) {
            x += step;  // Erhöhe X
            y = this.evaluateFunction(this.equation, x);  // Evaluiere Y für neues X
            if (y === null) continue;

            plotX = (x - xRange[0]) * scaleX;
            plotY = (yRange[1] - y) * scaleY;
            ctx.lineTo(this.clamp(plotX, 0, size[0]), this.clamp(plotY, 0, size[1]));
          }

          ctx.stroke();
        }

        // Achsenbeschriftungen hinzufügen
        this.drawLabels(ctx, size, scaleX, scaleY, offsetX, offsetY, xRange, yRange);
      };

      // Gitternetzlinien zeichnen
      drawGrid(ctx, size, scaleX, scaleY, offsetX, offsetY) {
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 0.5;

        // Vertikale Linien für X
        var gridSize = this.properties.gridSize;
        for (var x = Math.floor(this.properties.xRange[0] / gridSize) * gridSize; x <= this.properties.xRange[1]; x += gridSize) {
          var plotX = (x - this.properties.xRange[0]) * scaleX;
          ctx.beginPath();
          ctx.moveTo(plotX, 0);
          ctx.lineTo(plotX, size[1]);
          ctx.stroke();
        }

        // Horizontale Linien für Y
        for (var y = Math.floor(this.properties.yRange[0] / gridSize) * gridSize; y <= this.properties.yRange[1]; y += gridSize) {
          var plotY = (this.properties.yRange[1] - y) * scaleY;
          ctx.beginPath();
          ctx.moveTo(0, plotY);
          ctx.lineTo(size[0], plotY);
          ctx.stroke();
        }

        // Achsen (X=0 und Y=0) betonen
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 1.0;

        // X-Achse
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(size[0], offsetY);
        ctx.stroke();

        // Y-Achse
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, size[1]);
        ctx.stroke();
      }

      // Beschriftungen für Achsen und Gitternetzlinien
      drawLabels(ctx, size, scaleX, scaleY, offsetX, offsetY, xRange, yRange) {
        ctx.fillStyle = "#FFF";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";

        // X-Achse beschriften
        var gridSize = this.properties.gridSize;
        for (var x = Math.floor(xRange[0] / gridSize) * gridSize; x <= xRange[1]; x += gridSize) {
          var plotX = (x - xRange[0]) * scaleX;
          ctx.fillText(x.toFixed(1), plotX, offsetY + 10);
        }

        // Y-Achse beschriften
        ctx.textAlign = "right";
        for (var y = Math.floor(yRange[0] / gridSize) * gridSize; y <= yRange[1]; y += gridSize) {
          var plotY = (yRange[1] - y) * scaleY;
          ctx.fillText(y.toFixed(1), offsetX - 5, plotY + 3);
        }
      }
    }
  );
}





function _graph(graphCell,LiteGraph,CustomMultNode,FunctionNode,CustNumberNode,CustWatchNodeString,CustWatchNodeValue,CustomGraphicsPlot,CustomTimeNode,$0)
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
  nodeCustConst.pos = [100,200];
  graph.add(nodeCustConst);
  
  // var nodeMult = LiteGraph.createNode("custom/multiply");
  // nodeMult.pos = [500,250];
  // graph.add(nodeMult);

  var nodeFunc1 = LiteGraph.createNode("custom/func");
  nodeFunc1.pos = [400,200];
  graph.add(nodeFunc1);

  var nodeFunc2 = LiteGraph.createNode("custom/func");
  nodeFunc2.pos = [300,400];
  graph.add(nodeFunc2);

  var nodeCustWatchS = LiteGraph.createNode("custom/cwatchS");
  nodeCustWatchS.pos = [650,250];
  graph.add(nodeCustWatchS);

  var nodeCustWatchV = LiteGraph.createNode("custom/cwatchV");
  nodeCustWatchV.pos = [650,320];
  graph.add(nodeCustWatchV);

  // All nodes must be in the graph before connections can be made.
  //nodeConstA.connect(0,nodeMult,0);
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
  main.variable(observer("CustWatchNodeString")).define("CustWatchNodeString", _CustWatchNodeString);
  main.variable(observer("CustWatchNodeValue")).define("CustWatchNodeValue", _CustWatchNodeValue);
  main.variable(observer("CustomGraphicsPlot")).define("CustomGraphicsPlot", _CustomGraphicsPlot);
  main.variable(observer("CustomTimeNode")).define("CustomTimeNode", _CustomTimeNode);
  // main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomMultNode","ObservableNode","mutable results"], _graph);
  // main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomMultNode","ObservableNode","MathFormula","mutable results"], _graph);
  main.variable(observer("graph")).define("graph", ["graphCell","LiteGraph","CustomMultNode","FunctionNode","CustNumberNode","CustWatchNodeString","CustWatchNodeValue","CustomGraphicsPlot","CustomTimeNode","mutable results"], _graph);
  main.variable(observer("LiteGraph")).define("LiteGraph", ["require"], _LiteGraph);
  return main;
}
