

export function _CustNumberNode(){ return(
  class CustNumberNode {
    constructor() {
      this.addOutput("value", "object");
      this.properties = { value: 1.0, glgr: "x"};
      this.numberWidget = this.addWidget("number","Wert",1,"value", {precision: 2});
      this.nameWidget = this.addWidget("text","Variablenname","x","glgr");
      this.widgets_up = true;
      this.size = [180, 60];
    };


    
    onExecute() {
      var output = {
        value: parseFloat(this.properties["value"]),
        glgr: this.properties["glgr"],
        glgl: this.properties["glgr"],
        uvName: this.properties["glgr"],
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
      if(this.properties["glgr"]){
        title = title + " " + this.properties["glgr"];
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