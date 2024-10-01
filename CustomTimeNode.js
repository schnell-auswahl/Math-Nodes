
export function _CustomTimeNode() { return (
  class CustomTimeNode {
    constructor() {
      this.addOutput("in ms", "object");
      this.addOutput("in sec", "object");
      this.properties = { glgr: "t", glgl: "", uvName: "t"};
    

      this.nameWidget = this.addWidget("text","Variablenname","t","glgr");

      this.title = "Time";
      this.desc = "Time";
    }

    onExecute = function() {
      var outputSec = {
        value: this.graph.globaltime,
        glgr: this.properties["glgr"],
        glgl: this.properties["glgl"], 
        uvName: this.properties["glgr"],
      }
      var outputMil = {
        value: this.graph.globaltime * 1000,
        glgr: this.properties["glgr"],
        glgl: this.properties["glgl"],
        uvName: this.properties["glgr"],
      }
      this.setOutputData(0, outputMil);
      this.setOutputData(1, outputSec);
    };

    getTitle() {
      let title = "Zeit"
      if(this.properties["glgr"]){
        title = title + " " + this.properties["glgr"];
      }
      return title;
    };
  }
)}