// Exportierte Funktion für das Setup der Nodes
export function nodeSetupSynth1(graph, LiteGraph) {
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

}