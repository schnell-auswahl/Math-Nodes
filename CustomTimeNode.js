
export function _CustomTimeNode() { return (
  class CustomTimeNode {
    constructor() {
      this.addOutput("in ms", "object");
      this.addOutput("in sec", "object");
      this.properties = { rightSide: "t", leftSide: "", uvName: "t"};
    

      this.nameWidget = this.addWidget("text","Variablenname","t","rightSide");

      this.title = "Time";
      this.desc = "Time";
    }

    onExecute = function() {
      var outputSec = {
        value: this.graph.globaltime,
        rightSide: this.properties["rightSide"],
        leftSide: this.properties["leftSide"], 
        uvName: this.properties["rightSide"],
      }
      var outputMil = {
        value: this.graph.globaltime * 1000,
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