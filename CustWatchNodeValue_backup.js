export function _CustWatchNodeValue() { return(
    class CustWatchNodeValue {
      constructor() {
        this.size = [60, 30];
        this.color = "#CE8A53"; //Titelfarbe
        this.bgcolor = "#FFFFFF"; //Hintergrundfarbe


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