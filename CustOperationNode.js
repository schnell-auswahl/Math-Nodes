export function _OperationNode(){
    return (
        class OperationNode {
            constructor() {
                
                this.size = [160, 40];  

                this.addInput("", "object");
                this.addInput("", "object");
                this.addOutput("", "object");

                this.properties = {
                    // In1_Formula: "",
                    // In1_Value: 0,
                    // In2: "",
                    // In2_Value: 0,
                    Out_leftSideOfEquation: "",
                    Out_rightSideOfEquation: "",
                    Result_Value: 0,
                    Operation: "", 
                    Fehlermeldung: ""
                  };

                this.addWidget(
                    "combo",             // Widgettyp: ComboBox (Dropdown-Menü)
                    "Operation",         // Beschreibung des Widgets
                    " ",                 // Standardwert
                    (value) => {         // Callback-Funktion, die ausgeführt wird, wenn sich der Wert ändert
                        switch (value) {
                            case "+":
                                this.properties["Operation"] = "+";
                                break;
                            case "-":
                                this.properties["Operation"] = "-";
                                break;
                            case "·":
                                this.properties["Operation"] = "*";
                                break;
                            case ":":
                                this.properties["Operation"] = "/";
                                break;
                            default:
                                console.warn("Unbekannte Operation: " + value);
                                this.properties["Operation"] = "";
                        }
                    },
                    { values: ["+", "-", "·", ":"] } // Optionen für das Dropdown-Menü
                ); 

                this.title = "Operation";
                this.desc = "Computes Funktions and Values with the choosen Operation"; // Beschreibung des Knotens
                this.size = [160, 150]; // Größe des Knotens in Pixeln
            }


            getTitle() {
                if (this.properties["Fehlermeldung"] = "durch 0 geteilt"){
                     return "Durch 0 geteilt"
                } else if(this.properties["Fehlermeldung"] = "UV unterschiedlich"){
                    return "UV unterschiedlich"
                } else if( this.properties["Operation"]){
                    if (this.properties["Operation"] == "*"){
                        return "·"
                    } else {
                        return this.properties.Operation;
                    }
                } else {
                    return "Wähle Operation"
                }

            }

            onDrawBackground() {
                this.outputs[0].label = this.properties["Result_Value"].toFixed(2);
            }
            
            onExecute() {
                if (this.getInputData(0) && this.getInputData(1)){
                    var In1_inputData = this.getInputData(0);
                    var In2_inputData = this.getInputData(1);

                    var In1_leftSideOfEquation  = In1_inputData["leftSide"];
                    var In1_rightSideOfEquation = In1_inputData["rightSide"];
                    var In2_leftSideOfEquation  = In2_inputData["leftSide"];
                    var In2_rightSideOfEquation = In2_inputData["rightSide"];

                    var In1_Value = In1_inputData["value"];
                    var In2_Value = In2_inputData["value"];

                    var In1_UV = In1_inputData["uvName"];
                    var In2_UV = In2_inputData["uvName"];

                    this.properties["Out_leftSideOfEquation"] = "(" + In1_leftSideOfEquation + ")" + " " + this.properties["Operation"] + " " + "(" + In2_leftSideOfEquation + ")"  ;
                    this.properties["Out_rightSideOfEquation"] = "(" + In1_rightSideOfEquation + ")"+ " " + this.properties["Operation"] + " " + "(" + In2_rightSideOfEquation+ ")";

                    if (In1_UV == In2_UV){
                        switch (this.properties["Operation"]) {
                            case "+":
                                this.properties["Result_Value"] = In1_Value + In2_Value;
                                break;
                            case "-":
                                this.properties["Result_Value"] = In1_Value - (In2_Value);
                                break;
                            case "*":
                                this.properties["Result_Value"] = In1_Value * In2_Value;
                                break;
                            case "/":
                                if (In2_Value == 0){
                                    this.boxcolor = "red"; // Fehlerfarbmarkierung
                                    this.properties["Fehlermeldung"] = "durch 0 geteilt"
                                }
                                this.properties["Result_Value"] = In2_Value !== 0 ? In1_Value / In2_Value : 0; // Division durch 0 vermeiden
                                break;
                            default:
                                console.error("Keine Operation gewählt");
                                this.properties["Result_Value"] = 0;
                                break;
                        
                        }
                        this.setOutputData(0, { uvValue: In1_inputData["uvValue"], value: this.properties["Result_Value"], leftSide:   this.properties["Out_leftSideOfEquation"], rightSide:   this.properties["Out_rightSideOfEquation"], uvName: In1_UV });
                        this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg  
                    } else { 
                        this.properties["Fehlermeldung"] = "UV unterschiedlich"
                        this.boxcolor = "red"; // Fehlerfarbmarkierung
                        
                    }    



                }

            }
        }
    );
}