
export function _CustomTimeNode() { return (
  class CustomTimeNode {
    constructor() {
      this.addOutput("in ms", "object");
      this.addOutput("in sec", "object");
      this.properties = { rightSide: "t", leftSide: "t", uvName: "t"};
      console.log(this.lastbtpress); 

      this.nameWidget = this.addWidget("text","Variablenname","t","rightSide");
      this.lastbtpress = 0;

      this.title = "Time";
      this.desc = "Time";

      this.addWidget(
        "button",          // Typ des Widgets
        "t=0",             // Beschriftung auf dem Button
        null,              // Kein Standardwert notwendig
        () => {            // Callback-Funktion für den Button
          console.log("Button gedrückt!");  // Aktion, die bei einem Klick auf den Button ausgeführt wird
          this.lastbtpress = this.graph.globaltime            // Ruft eine Methode auf, die die Funktion ausführt
        }
      );

    }

    onExecute = function() {
      this.time = Math.round((parseFloat(this.graph.globaltime - this.lastbtpress) + Number.EPSILON) * 100) / 100;// Zeitzurücksetzen + Rundung


      var outputSec = {
        value: this.time,
        rightSide: this.properties["rightSide"],
        leftSide: this.properties["leftSide"], 
        uvName: this.properties["rightSide"],
      }
      var outputMil = {
        value: this.time * 1000,
        rightSide: this.properties["rightSide"],
        leftSide: this.properties["leftSide"],
        uvName: this.properties["rightSide"],
      }
      this.setOutputData(0, outputMil);
      this.setOutputData(1, outputSec);
    };

    getTitle() {
      let title = "Zeit"
      if(this.properties["rightSide"]){
        title = title + " " + this.properties["rightSide"];
      }
      return title;
    };
  }
)}