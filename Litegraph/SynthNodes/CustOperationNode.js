// To Do: UV_Name und UV_Value Ausgabe je nachdem wo das angeschlossen ist -> gecheckt 

export function _OperationNode(){
    return (
        class OperationNode {
            constructor() {
                this.color = opNodesColor;
                this.bgcolor = bgColor2;
                
                this.size = [120, 90];  

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
                    In2_isNumberNode: "",
                    widgetVisible: true
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
                //this.size = [160, 150]; // Größe des Knotens in Pixeln
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

            onDrawForeground(ctx) {

                if (this.flags.collapsed) {
                    return; // Zeichne nichts, wenn die Node collapsed ist
                   }
                //this.outputs[0].label = this.properties["Result_Value"].toFixed(2);
                
                
                let opDisplay = "";

                if (this.properties["Operation"] == "*"){
                    opDisplay = "·";
                } else {
                    opDisplay = this.properties.Operation;
                }
                   

                    ctx.font = "40px Arial";
                    ctx.fillStyle = "#FFFFFF";
                    ctx.textAlign = "center";
                    ctx.fillText(
                        opDisplay,
                        this.size[0] * 0.5,
                        2 * LiteGraph.NODE_SLOT_HEIGHT
                        //(this.size[1] + LiteGraph.NODE_TITLE_HEIGHT) * 0.5
                    );
                    ctx.textAlign = "left";
                



                // Färbe den Eingang oder zeichne einen Kreis darum
                const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
                // Relativer x-Wert für Eingänge (meistens am linken Rand der Node)
                const inputPosX = labelInputPosX;
                const nodeWidth = this.size[0];      
                const outputPosX = nodeWidth; // Rechter Rand der Node
                // Parameter für die Trichterform
                const width = labelWidth; // Breite der Basis (linke Seite)
                const height = labelHeight; // Höhe des Trichters (von Basis bis Spitze)

                const inputPosY = (0) * NODE_SLOT_HEIGHT + 14;

                //Output:
                // Berechnung der x-Position auf der rechten Seite der Node
                ctx.beginPath();
                ctx.moveTo(outputPosX, inputPosY - height / 2);              // Obere rechte Ecke
                ctx.lineTo(outputPosX - width, inputPosY - height / 2);      // Nach links zur Basis
                ctx.arc(outputPosX - width,inputPosY,height / 2 ,0, 2 * Math.PI,true)
                ctx.lineTo(outputPosX - width, inputPosY + height / 2);      // Nach unten zur linken Unterkante
                ctx.lineTo(outputPosX, inputPosY + height / 2); 
                ctx.closePath();
                ctx.fillStyle = outLabelsColor;
                ctx.fill();
                // Setze die Labels der Parameter-Eingänge basierend auf den Parameternamen und Zeichne die Formen darum
                for(let i=0; i<2; i++){

                    const inputPosY = (i) * NODE_SLOT_HEIGHT + 14;
                
                    ctx.beginPath();
                    // Input Trichter
                    ctx.moveTo(0, inputPosY - height / 2);
                    ctx.lineTo(inputPosX ,inputPosY - height / 2);
                    ctx.arc(inputPosX,inputPosY,height / 2 ,0, 2 * Math.PI)
                    ctx.lineTo(inputPosX ,inputPosY + height / 2);
                    ctx.lineTo(0 ,inputPosY + height / 2);
                    ctx.lineTo(0 ,inputPosY + height / 2);
                    ctx.closePath();
                    // Füllen des Trichters
                    ctx.fillStyle = inLabelsColor;
                    ctx.fill();
                }



            }
            
            onExecute() {
                if (this.properties.widgetVisible == false) {
                    this.widgets = []; // Alle Widgets entfernen
                    this.size = [100, 80];  
                    } else {
                        //this.size = [120, 90];   
                    }

                    this.inputs[0].color_off = "#000000";
                    this.inputs[1].color_off = "#000000";
                    this.outputs[0].color_off = "#000000";

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

                    this.inputs[0].color_on = adjustColor("#00FF00","#FF0000",In1_Value);
                    this.inputs[1].color_on = adjustColor("#00FF00","#FF0000",In2_Value);


                    
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
                        this.outputs[0].color_on = adjustColor("#00FF00","#FF0000",this.properties["Result_Value"]);
                        this.boxcolor = null; // Zurücksetzen der Farbe bei Erfolg 
                    }

                }

            }
        }
    );
}