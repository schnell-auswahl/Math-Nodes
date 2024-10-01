
export function _CustWatchNodeString() { return(
  class CustWatchNodeString {
    constructor() {
      this.size = [80, 30];
      this.color = "#CE8A53"; //Titelfarbe
      this.bgcolor = "#FFFFFF"; //Hintergrundfarbe


      this.addInput("value", 0, { label: "" });
      this.value = 0;
      this.title = "Gleichung";
      this.desc = "Show Equation of input";
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
      } else if (!o["glgr"] || o["glgr"] == null) {
        return "Fehler";
      } else {
          //return "f(" + o["uvName"] + ") = " + o["glgr"];
          return o["glgl"] + " = " + o["glgr"];
      }
    };

    onDrawBackground = function(ctx) {
      //show the current value
      this.inputs[0].label = this.toString(this.value);
      // this.inputs[0].label = "Hi Nico"
    };
  }
)}