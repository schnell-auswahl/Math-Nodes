export function _TextInputNode() {
    return class TextInputNode {
      constructor() {
        this.addOutput("Text", "string");
        this.textInput_widget = this.addWidget("text", "Text eingeben", "", (v) => {
          this.text = v;
        });
        this.title = "Text Eingabe";
        this.text = "";
      }
  
      onExecute() {
        this.setOutputData(0, this.text);
      }
    };
  }