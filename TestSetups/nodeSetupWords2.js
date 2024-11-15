// Exportierte Funktion für das Setup der Nodes
export function nodeSetupWords2(graph, LiteGraph) {
    const testText = "Dies ist ein Testtext für die Textmanipulations-Nodes."; // Beispiel-Testtext

    // Importiere die Textmanipulations-Nodes-Titel
    const textManipulationNodes = [
        "alphabet-countdown",
        "alphabet-sprung",
        "rueckwaertslesen",
        "vokal-verwandlung",
        "knvklnmnmtxt",
        "buchstabenwechsel",
        "buchstaben-sprung",
        "alphabetischersprung",
        "buchstaben-ueberlappung",
        "vokalwechsel",
        "buchstabenballet",
        "vokaltanz",
        "vokalium",
        "konsonantenverdoppeln",
        "doppelthaeltbesser",
        "vorwaertsrueckwaerts"
    ];

    // Für jede Node den Test erstellen
    textManipulationNodes.forEach((nodeType, index) => {
        const yOffset = 40 + index * 130; // Vertikaler Abstand zwischen den Nodes
        const xOffset = 0

        // if(index < 6) {
        //     xOffset = 700;
        // } else {
        //     xOffset = 0;}

        // TextInputNode
        const inputNode = LiteGraph.createNode("Wortmaschinen/TextInputNode");
        inputNode.pos = [50 + xOffset, yOffset];
        inputNode.textInput_widget.value = testText; 
        if (inputNode.textInput_widget.callback) {
            inputNode.textInput_widget.callback(inputNode.textInput_widget.value, null, inputNode); // Manuelles Ausführen der Logik für das Widget, um die Berechnung zu starten
        } // Setze den Testtext
        graph.add(inputNode);

        // TextManipulationNode
        const manipulationNode = LiteGraph.createNode(`Wortmaschinen/${nodeType}`);
        manipulationNode.pos = [300 + xOffset, yOffset];
        graph.add(manipulationNode);

        // TextDisplayNode
        const displayNode = LiteGraph.createNode("Wortmaschinen/TextDisplayNode");
        displayNode.pos = [550 + xOffset, yOffset];
        graph.add(displayNode);

        // Verbindungen
        inputNode.connect(0, manipulationNode, 0);
        manipulationNode.connect(0, displayNode, 0);
    });
}