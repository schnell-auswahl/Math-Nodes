// To Do: UV_Name und UV_Value Ausgabe je nachdem wo das angeschlossen ist -> gecheckt 

export function _OperationNode(){
    return (
        class OperationNode {
            constructor() {
                this.color = opNodesColor;
                this.bgcolor = bgColor2;
                
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
                    Fehlermeldung: "",
                    In1_isNumberNode: "",
                    In2_isNumberNode: ""
                  };

                this.code_widget = this.addWidget(
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
                if (this.properties["Fehlermeldung"] == "durch 0 geteilt"){
                     return "Durch 0 geteilt"
                } else if(this.properties["Fehlermeldung"] == "UV unterschiedlich"){
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

                    var In1_UV_Value = In1_inputData["uvValue"];
                    var In2_UV_Value = In2_inputData["uvValue"];

                    var UV_Value_internal = 0; //Falls es zwei UVs gibt und sich für eine entschieden werden muss
                    var UV_Name_internal = "";

                    // var In1_isNumberNode = In1_inputData["isNumberNode"];
                    // var In2_isNumberNode = In2_inputData["isNumberNode"];

                    this.properties.In1_isNumberNode = In1_inputData["isNumberNode"];
                    this.properties.In2_isNumberNode = In2_inputData["isNumberNode"];



                    
                    this.properties["Out_leftSideOfEquation"] =  In1_leftSideOfEquation + " " + this.properties["Operation"] + " " + In2_leftSideOfEquation ;
                    this.properties["Out_rightSideOfEquation"] = "(" + In1_rightSideOfEquation + ")"+ " " + this.properties["Operation"] + " " + "(" + In2_rightSideOfEquation+ ")";

                    if (!In1_inputData || !In2_inputData) {
                        this.properties["Fehlermeldung"] = "Input fehlt"
                        this.boxcolor = "red"; // Fehlerfarbmarkierung   
                    }
                    if ( In1_inputData && In2_inputData && (this.properties.In1_isNumberNode != "UV" && this.properties.In1_isNumberNode != "Parameter")  && (this.properties.In2_isNumberNode != "UV" && this.properties.In2_isNumberNode != "Parameter") && In1_UV != In2_UV ||
                    In1_inputData && In2_inputData && this.properties.In1_isNumberNode == "UV" && (this.properties.In2_isNumberNode != "UV" && this.properties.In2_isNumberNode != "Parameter") && In1_UV != In2_UV || //Fall UV Node + Funktion
                    In1_inputData && In2_inputData && (this.properties.In1_isNumberNode != "UV" && this.properties.In1_isNumberNode != "Parameter") && this.properties.In2_isNumberNode == "UV" && In1_UV != In2_UV ||
                    In1_inputData && In2_inputData && this.properties.In1_isNumberNode == "UV" && this.properties.In2_isNumberNode == "UV" && In1_UV != In2_UV
                        ){
                        this.properties["Fehlermeldung"] = "UV unterschiedlich"
                        this.boxcolor = "red"; // Fehlerfarbmarkierung   
                    }
                   

                   
                    if (
                            In1_inputData && In2_inputData && (this.properties.In1_isNumberNode != "UV" && this.properties.In1_isNumberNode != "Parameter")  && (this.properties.In2_isNumberNode != "UV" && this.properties.In2_isNumberNode != "Parameter") && In1_UV == In2_UV || //Für den Fall, dass keine NumberNodes angeschlossen sind, dürfen zwei UV behaftete Nodes angeschlossen sein, sofern sie die gleiche uv betreffen
                            In1_inputData && In2_inputData && this.properties.In1_isNumberNode == "UV" && (this.properties.In2_isNumberNode != "UV" && this.properties.In2_isNumberNode != "Parameter") && In1_UV == In2_UV || //Fall UV Node + Funktion
                            In1_inputData && In2_inputData && (this.properties.In1_isNumberNode != "UV" && this.properties.In1_isNumberNode != "Parameter") && this.properties.In2_isNumberNode == "UV" && In1_UV == In2_UV || //Fall Funktion + UV Node
                            In1_inputData && In2_inputData && In1_UV == "" || //Fall Parameter + Funktion oder Param + Param oder UV + Param
                            In1_inputData && In2_inputData && In2_UV == "" 
                        ){
                        switch (this.properties["Operation"]) {
                            case "+":
                                this.properties["Result_Value"] = In1_Value + In2_Value;
                                this.properties["Fehlermeldung"] = "";
                                break;
                            case "-":
                                this.properties["Result_Value"] = In1_Value - (In2_Value);
                                this.properties["Fehlermeldung"] = "";
                                break;
                            case "*":
                                this.properties["Result_Value"] = In1_Value * In2_Value;
                                this.properties["Fehlermeldung"] = "";
                                break;
                            case "/":
                                if (In2_Value == 0){
                                    this.boxcolor = "red"; // Fehlerfarbmarkierung
                                    this.properties["Fehlermeldung"] = "durch 0 geteilt";
                                    this.properties["Result_Value"] = 0;
                                } else {
                                this.properties["Result_Value"] =  In1_Value / In2_Value; 
                                this.boxcolor = ""; // Fehlerfarbmarkierung
                                this.properties["Fehlermeldung"] = "";
                                }
                                break;
                            // default:
                            //     console.error("Keine Operation gewählt");
                            //     this.properties["Result_Value"] = 0;
                            //     break;
                        } 
                    }  else {
                        this.properties["Result_Value"] = 0;
                        this.boxcolor = "red";
                    }


                    if (this.properties["Fehlermeldung"] == "") {
                        if (In1_UV != ""){
                            UV_Name_internal = In1_UV;
                            UV_Value_internal = In1_UV_Value;
                        } else if (In2_UV != ""){
                            UV_Name_internal = In2_UV;
                            UV_Value_internal = In2_UV_Value;
                        } else {
                            UV_Name_internal = "";
                            UV_Value_internal = 0;
                        }


                        this.setOutputData(0, { uvValue: UV_Value_internal, value: this.properties["Result_Value"], leftSide:   this.properties["Out_leftSideOfEquation"], rightSide:   this.properties["Out_rightSideOfEquation"], uvName: UV_Name_internal});
                        this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg 
                    }

                }

            }
        }
    );
}