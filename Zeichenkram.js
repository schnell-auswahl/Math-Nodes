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

//Input
ctx.beginPath();
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
for(let i=1; i<5; i++){

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
 ctx.fillStyle = paramLabelsColor;
 ctx.fill();
}