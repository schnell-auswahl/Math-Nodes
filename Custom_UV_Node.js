

export function _uvNode() {
  return (
    class uvNode {
      constructor() {
        this.addOutput("value", "object");
        this.properties = { value: 1.0, rightSide: "x"};
        this.numberWidget = this.addWidget("number", "Wert", 1, "value", { precision: 2 });
        this.nameWidget = this.addWidget("text", "Unabhängige", "x", "rightSide");
        this.widgets_up = true;
        //this.color = "#4C7468"; //Titelfarbe
        //this.bgcolor = "#9FA8B4"; //Hintergrundfarbe
         this.shape = LiteGraph.ROUND_SHAPE; // Runde Ecken
         this.size = [180, 60];
      }

      onExecute() {
        // Hier wird die Rundung wie gewünscht angewendet
        const roundedValue = Math.round((parseFloat(this.properties["value"]) + Number.EPSILON) * 100) / 100;

        var output = {
          value: roundedValue,
          uvValue: roundedValue,
          rightSide: this.properties["rightSide"],
          leftSide: this.properties["rightSide"],
          uvName: this.properties["rightSide"],
          isNumberNode: true,
          // funcList: ""
        }
        this.setOutputData(0, output);
      }

      getTitle() {
        let title = "Unabhängige"
        if (this.properties["rightSide"]) {
          title = title + " " + this.properties["rightSide"];
        }
        return title;
      }

      setValue(v) {
        this.setProperty("value", v);
        console.log("in setValue");
      }

      onDrawBackground() {
        // Rundung auf 3 Dezimalstellen für die Anzeige, unabhängig von der Berechnung
        this.outputs[0].label = this.properties["value"].toFixed(3);
        //this.outputs[0].label = roundedValue;
      }
    }
  );
}