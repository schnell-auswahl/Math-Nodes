// Exportierte Funktion für das Setup der Nodes
export function nodeSetupWords1(graph, LiteGraph) {
  const testText = "Dies ist ein Testtext für die Textmanipulations-Nodes. Dies ist ein Testtext für die Textmanipulations-Nodes."; // Beispiel-Testtext


  var TextInputNode1 = LiteGraph.createNode("Wortmaschinen/TextInputNode")
  TextInputNode1.pos = [50,250];
  TextInputNode1.textInput_widget.value = testText; 
  if (TextInputNode1.textInput_widget.callback) {
    TextInputNode1.textInput_widget.callback(TextInputNode1.textInput_widget.value, null, TextInputNode1); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
  } // Setze den Testtext
  graph.add(TextInputNode1);

  var AlphabetCountdownNode1 = LiteGraph.createNode("Wortmaschinen/alphabet-countdown")
  AlphabetCountdownNode1.pos = [400,250];
  graph.add(AlphabetCountdownNode1);

  var TextDisplayNode1 = LiteGraph.createNode("Wortmaschinen/TextDisplayNode")
  TextDisplayNode1.pos = [700,250];
  graph.add(TextDisplayNode1);




  //Verbindungen:
  TextInputNode1.connect(0,AlphabetCountdownNode1,0);
  AlphabetCountdownNode1.connect(0,TextDisplayNode1,0);
  

}