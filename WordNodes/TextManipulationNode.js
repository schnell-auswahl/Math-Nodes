export function createTextManipulationNode({ title, description, logic }) {
    const NodeClass = class {
        constructor() {
            this.addInput("IN", "string");
            this.addOutput("OUT", "string");
            this.title = title; // Dynamischer Titel
            this.size = [220, 100];
            this.resizable = false;
            this.description = description; // Beschreibung für die Node
        }

        onExecute() {
            const inputText = this.getInputData(0);
            if (inputText) {
                this.setOutputData(0, logic(inputText));
            }
        }

        onDrawForeground(ctx) {
            // Textformat für die Beschreibung
            ctx.font = "12px Arial";
            ctx.fillStyle = "#FFFFFF";

            const lineHeight = 14;
            const startY = 30;

            const lines = this.description.split("\n");
            lines.forEach((line, index) => {
                const textWidth = ctx.measureText(line).width;
                const x = (this.size[0] - textWidth) / 2;
                const y = startY + (index + 1) * lineHeight;
                ctx.fillText(line, x, y);
            });

            // Zeichne die Input- und Output-Slots
            const NODE_SLOT_HEIGHT = LiteGraph.NODE_SLOT_HEIGHT;
            const inputPosX = labelInputPosX;
            const nodeWidth = this.size[0];
            const outputPosX = nodeWidth;
            const width = labelWidth;
            const height = labelHeight;
            const inputPosY = 14;

            ctx.beginPath();
            ctx.moveTo(0, inputPosY - height / 2);
            ctx.lineTo(inputPosX, inputPosY - height / 2);
            ctx.arc(inputPosX, inputPosY, height / 2, 0, 2 * Math.PI);
            ctx.lineTo(inputPosX, inputPosY + height / 2);
            ctx.lineTo(0, inputPosY + height / 2);
            ctx.closePath();
            ctx.fillStyle = inLabelsColor;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(outputPosX, inputPosY - height / 2);
            ctx.lineTo(outputPosX - width, inputPosY - height / 2);
            ctx.arc(outputPosX - width, inputPosY, height / 2, 0, 2 * Math.PI, true);
            ctx.lineTo(outputPosX - width, inputPosY + height / 2);
            ctx.lineTo(outputPosX, inputPosY + height / 2);
            ctx.closePath();
            ctx.fillStyle = outLabelsColor;
            ctx.fill();
        }
    };

    // Setze den Klassennamen dynamisch basierend auf dem Titel
    Object.defineProperty(NodeClass, "name", { value: title.replace(/\s+/g, "") });

    return NodeClass;
}