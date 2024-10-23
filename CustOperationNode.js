export function _OperationNode(){
    return (
        class OperationNode {
            constructor() {
                
                this.size = [160, 40];  

                this.addInput("", "object");
                this.addInput("", "object");
                this.addOutput("", "object");

                this.properties = {
                    In1_Formula: "",
                    In1_Value: 0,
                    In2: "",
                    In2_Value: 0,
                    Result_Formula: "",
                    Result_Value: 0,
                    Operation: "" 
                  };

                this.addWidget(
                   "combo",             // Widgettyp: ComboBox (Dropdown-Menü)
                   "Operation",                  // Beschreibung des Widgets
                   "+",                      // Beschreibung des Widgets
                   (value) => {         // Callback-Funktion, die ausgeführt wird, wenn sich der Wert ändert
                       this.properties.Operation = value;
                   },
                   { values: ["+", "-", "·", ":"] } // Optionen für das Dropdown-Menü
                );   

                this.title = "Operation";
                this.desc = "Computes Funktions and Values with the choosen Operation"; // Beschreibung des Knotens
                this.size = [160, 150]; // Größe des Knotens in Pixeln
            }


            getTitle() {
                if( this.properties["Operation"]){
                    return this.properties.Operation;
                } else {
                    return "Operation"
                }

            }

            onDrawBackground() {
                this.outputs[0].label = this.properties["Result_Value"].toFixed(2);
            }
            
            onExecute() {

            }
        }
    );
}