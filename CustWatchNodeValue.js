export function _CustWatchNodeValue() { return(
    class CustWatchNodeValue {
      constructor() {
        this.size = [60, 30];
        this.color = "#CE8A53"; //Titelfarbe
        this.bgcolor = "#FFFFFF"; //Hintergrundfarbe


        this.addInput("","object");
        //this.addInput("UV", "object");
        this.inputData = 0;
        this.title = "Wert";
        this.desc = "Show value of input";
        
        this.properties = {
          FormulaFromInput: "",   
          uvValueFromInput: 0,
          uvNameFromInput: "", 
          displayValue: 0
        };



        this.oldFormula = "";
        this.olduvValue = 0;
        this.olduvNameFromInput = "";

       

      }
  
      onExecute() {

   // Eingabedaten holen
    //const inputData = this.getInputData(0);

    // Ausgabe der empfangenen Eingabedaten in der Konsole
    //console.log("Empfangene Eingabedaten:", inputData);


        if (this.getInputData(0)) {
          this.inputData = this.getInputData(0);
          this.properties.FormulaFromInput = this.inputData["rightSide"];
          this.properties.uvValueFromInput = this.inputData["uvValue"]; // Gegen UV Value tauschen
          this.properties.uvNameFromInput = this.inputData["uvName"]; 

          if ( this.oldFormula != this.properties.FormulaFromInput || this.olduvValue != this.properties.uvValueFromInput || this.olduvNameFromInput != this.properties.uvNameFromInput) {
           
            try {
              this._func = new Function(this.properties.uvNameFromInput,"return " + this.properties.FormulaFromInput); // Erstelle neue Funktion -> To Do funktion vorher sicher machen

              this.properties.displayValue = this._func(this.properties.uvValueFromInput); // Wert aus Funktion ausrechen
              //console.log("this._func lautet",this._func);
              //console.log("rechnentest",this._func(1));
              this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg

              this.oldFormula = this.properties.FormulaFromInput;
              this.olduvValue = this.properties.uvValueFromInput;
              this.olduvNameFromInput = this.properties.uvNameFromInput;
            }
            catch (err) {
              console.error("Fehler in der Formel:", err); // Fehlerbehandlung bei Problemen mit der Formel
              this.boxcolor = "red"; // Fehlerfarbmarkierung
            }


          }  
        }
      };
  
      getTitle() {
        if (this.flags.collapsed) { //Nochmal checken was das heißt
            return this.inputs[0].label;
        }
        return this.title;
      };
  
      toString = function(o) {
        if (o == null) {
            return "";
        } 
        //else if (!o["value"] || o["value"] == null) {
          //  return "Fehler";
        //}
         else {
            var num = o;
            num = Math.round((num + Number.EPSILON) * 100) / 100;
            return num;
        }
      };
  
      onDrawBackground = function(ctx) {
        //show the current value
        this.inputs[0].label = this.toString(this.properties.displayValue);
        // this.inputs[0].label = "Hi Nico"
      };
    }
  )}