//Ausgewählte maschinen löschen
function delNode(canvasId) {
  const canvas = document.getElementById(canvasId); // Canvas über ID holen
  if (!canvas) {
    alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  const graph = canvas.graph; // LGraph-Objekt vom Canvas
  if (!graph) {
    alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
    return;
  }
  graph.list_of_graphcanvas[0].deleteSelectedNodes();
  
}


function goFullscreen(canvasId) {
  const canvas = document.getElementById(canvasId); // Canvas über ID holen
  if (!canvas) {
    alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  const graph = canvas.graph; // LGraph-Objekt vom Canvas
  if (!graph) {
    alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
    return;
  }

  const LGcanvas = graph.list_of_graphcanvas[0];
  if (!LGcanvas) {
    console.error("Kein gültiges LGraphCanvas-Objekt gefunden.");
    return;
  }

  // Überprüfen, ob sich der Canvas im Vollbildmodus befindet
  if (document.fullscreenElement === canvas.parentNode) {
    // Vollbildmodus verlassen
    document
      .exitFullscreen()
      .then(() => {
        setTimeout(() => {
          LGcanvas.resize(); // Größe zurücksetzen
          for (let i = 0; i < 3; i++) {
            autoPositionNodes(canvasId);
          }
        }, 100); // Verzögerung von 100 ms
      })
      .catch((err) => {
        console.error("Fehler beim Beenden des Vollbildmodus:", err);
      });
  } else {
    // In den Vollbildmodus wechseln
    canvas.parentNode
      .requestFullscreen()
      .then(() => {
  
        setTimeout(() => {
          LGcanvas.resize(); // Canvas-Größe anpassen
          for (let i = 0; i < 3; i++) {
            autoPositionNodes(canvasId); // Node-Positionen anpassen
          }
        }, 100); // Verzögerung von 100 ms
      })
      .catch((err) => {
        console.error("Fehler beim Starten des Vollbildmodus:", err);
      });
  }
}

// Graph speichern in datei
function saveGraphToFile(canvasId) {
  const canvas = document.getElementById(canvasId); // Canvas über ID holen
  if (!canvas) {
    alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  const graph = canvas.graph; // LGraph-Objekt vom Canvas
  if (!graph) {
    alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
    return;
  }

  const graphData = graph.serialize(); // Graph serialisieren
  const dataStr = JSON.stringify(graphData);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${canvasId}_graph_config.json`; // Datei benennen
  a.click();
  URL.revokeObjectURL(url);

}

// Funktion zum Laden des Graphen aus einer Datei über einen Pfad

function loadGraphFromFile(canvasId) {
  // Zeige eine Bestätigungsabfrage
  const confirmation = confirm(
    "Möchtest du den aktuellen Graphen wirklich überschreiben? Alle nicht gespeicherten Änderungen gehen verloren!"
  );

  // Wenn der Benutzer bestätigt, lade den Graphen
  if (confirmation) {
    const canvas = document.getElementById(canvasId); // Canvas über ID holen
        if (!canvas) {
      alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
      return;
    }
    
    const graph = canvas.graph; // LGraph-Objekt vom Canvas
    if (!graph) {
      alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
      return;
    }
    
    graph.clear();
    // console.log("Graph wurde geleert.");
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    
    input.addEventListener("change", function (event) {
      // console.log("Event-Listener ausgelöst.");
      const file = event.target.files[0];
      if (file) {
        // console.log("Datei ausgewählt:", file.name);
        const reader = new FileReader();
        reader.onload = function (e) { // Callback-Funktion für das Laden der Datei
          try {
            // console.log("Datei wird gelesen...");
            const json = JSON.parse(e.target.result);
            // console.log("JSON erfolgreich geparst:", json);
            
            // Graph aktualisieren
            graph.stop();
            // console.log("Graph gestoppt.");
            graph.configure(json);
            // console.log("Graph konfiguriert.");
            
            // Kurze Verzögerung einfügen
            setTimeout(() => {
              graph.start();
              // console.log("Graph gestartet.");
              autoPositionNodes(canvas.id);
              // console.log("Knoten automatisch positioniert.");
            }, 300); // 300 Millisekunden Verzögerung
    
          } catch (error) {
            console.error("Fehler beim Laden des Graphen:", error);
            alert("Ungültige Datei. Bitte überprüfe das JSON-Format.");
          }
        };
        reader.readAsText(file); // Datei als Text einlesen
      } else {
        // console.log("Keine Datei ausgewählt.");
      }
    });
    document.body.appendChild(input); // Input-Element zum DOM hinzufügen
    // console.log("Event-Listener hinzugefügt.");
    input.click();
    // console.log("Input-Element geklickt.");
  } 
}

function loadGraphFromServerAsync(canvasId, jsonFilePath) {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      return reject(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    }

    const graph = canvas.graph;
    if (!graph) {
      return reject(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
    }

    graph.clear();

    fetch(jsonFilePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Fehler beim Laden der JSON-Datei: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((json) => {
        try {
          graph.stop();

          graph.configure(json);
          graph.start();

          resolve(); // Ladevorgang erfolgreich abgeschlossen

          //autoPositionNodes(canvas.id); // wird bei loadallgraphesfrooomserver schon aufgerufen
          adjus
        } catch (error) {
          reject(`Fehler beim Konfigurieren des Graphen: ${error.message}`);
        }
      })
      .catch((error) => {
        reject(
          `Fehler beim Laden der Datei "${jsonFilePath}": ${error.message}`
        );
      });
  });
}

function clearGraph(canvasId) {
  // Zeige eine Bestätigungsabfrage
  const confirmation = confirm(
    "Möchtest du den aktuellen Graphen wirklich löschen? Alle nicht gespeicherten Änderungen gehen verloren!"
  );

  if (confirmation) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
    
      return;
    }

    const graph = canvas.graph;
    if (!graph) {
     
      return;
    }
    graph.stop();
    graph.clear(); // Graph löschen
    graph.start();
  
  }
}

async function loadAllGraphs() {
  const canvases = document.querySelectorAll("canvas[data-config-path]");
  const loadPromises = Array.from(canvases).map((canvas) => {
    const canvasId = canvas.id;
    const jsonFilePath = canvas.dataset.configPath;
    return loadGraphFromServerAsync(canvasId, jsonFilePath);
  });

  try {
    await Promise.all(loadPromises); // Warten, bis alle Graphen geladen sind
    canvases.forEach((canvas) => autoPositionNodes(canvas.id));
    // Nodes anpassen, nachdem alle Graphen geladen sind
    manualDrawFkt(500);
    
    // setTimeout(() => {
    //   canvases.forEach((canvas) => autoPositionNodes(canvas.id));
    // }, 500);
    //console.log("Alle Graphen wurden erfolgreich geladen.");
  } catch (error) {
    console.error("Fehler beim Laden eines oder mehrerer Graphen:", error);
  }
}

// Beim Laden der Seite ausführen
document.addEventListener("DOMContentLoaded", () => {
  loadAllGraphs();
});

//REsizinbg und positioning der Nodes und des canvas

// Dynamisches Resizing eines spezifischen Canvas
function adjustCanvasSize(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  const minWidth = 1000; // Mindestbreite des Canvas
  const browserWidth = window.innerWidth; // Breite des Browsers
  const parent = canvas.parentElement;
  const forceheight = parseFloat(canvas.getAttribute("forceheight"));

  canvas.width = parent.clientWidth;
  if (forceheight) {
    canvas.height = forceheight;
  } else {
    canvas.height = parent.clientHeight;
  }
}

// Dynamisches Resizing für alle Canvas mit data-resize="true"
function adjustAllCanvasSizes() {
  // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
  const resizableCanvases = document.querySelectorAll(
    'canvas[data-resize="true"]'
  );

  // Resize-Funktion für jedes Canvas aufrufen
  resizableCanvases.forEach((canvas) => {
    adjustCanvasSize(canvas.id);
  });
}
//Node positions

// function adjustNodePositions(canvasId) {
//   const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
//     return;
//   }

//   const graph = canvas.graph;
//   if (!graph) {
//     console.error(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
//     return;
//   }
//   const zoomFactor = canvas.zoom || 1;

//   const canvasWidth = canvas.width / zoomFactor;
//   const canvasHeight = canvas.height / zoomFactor;
//   const margin = 20; // Randgröße
//   const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30; // Höhe des Titels

//   // Ursprüngliche Positionen sammeln
//   const nodePositions = graph._nodes.map((node) => ({
//     node: node,
//     x: node.pos[0],
//     y: node.pos[1],
//     width: node.size ? node.size[0] : 150, // Standardbreite eines Nodes
//     height: node.size ? node.size[1] : 100, // Standardhöhe eines Nodes
//   }));

//   // Extremwerte finden, wobei wir die rechte Seite der Nodes berücksichtigen
//   const minX = Math.min(...nodePositions.map((pos) => pos.x));
//   const maxX = Math.max(...nodePositions.map((pos) => pos.x + pos.width)); // Rechte Seite des Nodes
//   const minY = Math.min(...nodePositions.map((pos) => pos.y));
//   const maxY = Math.max(...nodePositions.map((pos) => pos.y + pos.height)); // Untere Seite des Nodes

//   // Skalenfaktoren für X und Y berechnen
//   const scaleX =
//     maxX === minX
//       ? 1 // Wenn alle X-Werte gleich sind, keine Skalierung erforderlich
//       : (canvasWidth - 2 * margin) / (maxX - minX);

//   const scaleY =
//     maxY === minY
//       ? 1 // Wenn alle Y-Werte gleich sind, keine Skalierung erforderlich
//       : (canvasHeight - 2 * margin - titleHeight) / (maxY - minY);

//   // Kleineren Skalierungsfaktor verwenden, um das Verhältnis zu erhalten
//   const scale = Math.min(scaleX, scaleY);

//   // Offset berechnen, um die Nodes innerhalb des Canvas zu verschieben
//   const offsetX = margin - minX * scale;
//   const offsetY = margin + titleHeight - minY * scale;

//   // Nodes neu positionieren
//   nodePositions.forEach(({ node, x, y }) => {
//     // Neue Position basierend auf Skalierung und Offset berechnen
//     node.pos[0] = x * scale + offsetX;
//     node.pos[1] = y * scale + offsetY;

//   });

// }

// Dynamisches Resizing für alle Canvas mit data-resize="true"
function adjustAllNodePositions() {
  // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
  const resizableCanvases = document.querySelectorAll("canvas");

  // Resize-Funktion für jedes Canvas aufrufen
  resizableCanvases.forEach((canvas) => {
    //adjustNodePositions(canvas.id);
    autoPositionNodes(canvas.id);
  });
}

// Dynamisches Resizing für alle Canvas und Neupositionierung der Nodes
function adjustAllCanvasAndNodePositions(shouldAdjustCanvasSize = true, shouldautoPositionNodes = true) {
  // Alle Canvas-Elemente mit dem Attribut data-resize="true" auswählen
  const canvases = document.querySelectorAll("canvas");

  // Für jedes Canvas die Größe und Node-Positionen anpassen
  canvases.forEach((canvas) => {
    if (shouldAdjustCanvasSize) {
      //console.log("adjusting canvas size");
      adjustCanvasSize(canvas.id);
    }
    if (shouldautoPositionNodes) {
      //console.log("adjusting node positions");
      autoPositionNodes(canvas.id);
    }
    // const graph = canvas.graph; // LGraph-Objekt vom Canvas
    // const LGcanvas = graph.list_of_graphcanvas[0];
    // LGcanvas.dirty_bgcanvas = true; // Setzen von dirty_bgcanvas

  });
}

// Beim Laden der Seite die Canvas-Größen und node positionsinitial anpassen
document.addEventListener("DOMContentLoaded", () => {
  adjustAllCanvasAndNodePositions(true,false); // Initial aufrufen

  // Event Listener für Fensteränderungen hinzufügen
  window.addEventListener("resize", adjustAllCanvasAndNodePositions);
});



/**
 * Automatically positions nodes within a canvas element by scaling and translating their positions
 * to fit within the canvas dimensions while maintaining margins.
 *
 * @param {string} canvasId - The ID of the canvas element containing the graph.
 *
 * @throws Will log an error if the canvas element with the specified ID is not found.
 * @throws Will log an error if the graph associated with the canvas is not found.
 * @throws Will log an error if no nodes are found in the graph.
 */
function autoPositionNodes(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  const graph = canvas.graph;
  if (!graph) {
    console.error(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
    return;
  }

  const zoomFactor = canvas.zoom || 1;

  const canvasWidth = canvas.width / zoomFactor;
  const canvasHeight = canvas.height / zoomFactor;
  const margin = 20; // Randgröße
  const titleHeight = LiteGraph.NODE_TITLE_HEIGHT || 30; // Höhe des Titels

  // Ursprüngliche Positionen sammeln
  const nodePositions = graph._nodes.map((node) => ({
    node: node,
    x: node.pos[0],
    y: node.pos[1],
    width: node.size ? node.size[0] : 150, // Standardbreite eines Nodes
    height: node.size ? node.size[1] : 100, // Standardhöhe eines Nodes
  }));

  if (nodePositions.length === 0) {
    console.error("Keine Nodes im Graph gefunden.");
    return;
  }

  // Extremwerte finden
  const minX = Math.min(...nodePositions.map((pos) => pos.x));
  const maxX = Math.max(...nodePositions.map((pos) => pos.x + pos.width)); // Rechte Seite des Nodes
  const minY = Math.min(...nodePositions.map((pos) => pos.y));
  const maxY = Math.max(...nodePositions.map((pos) => pos.y + pos.height)); // Untere Seite des Nodes

  // Schritt 1: Maximierung in X-Richtung
  const scaleX = (canvasWidth - 2 * margin) / (maxX - minX);
  const offsetX = margin - minX * scaleX;

  nodePositions.forEach(({ node, x }) => {
    node.pos[0] = x * scaleX + offsetX;
  });

  // Extremwerte nach X-Skalierung erneut berechnen
  const updatedMinY = Math.min(...nodePositions.map(({ node }) => node.pos[1]));
  const updatedMaxY = Math.max(
    ...nodePositions.map(({ node }) => node.pos[1] + node.size[1])
  );

  // Schritt 2: Maximierung in Y-Richtung
  const scaleY =
    (canvasHeight - 2 * margin - titleHeight) / (updatedMaxY - updatedMinY);
  const offsetY = margin + titleHeight - updatedMinY * scaleY;

  nodePositions.forEach(({ node, y }) => {
    node.pos[1] = y * scaleY + offsetY;

    // Überprüfen, ob die Node im Rechteck 120px x 70px in der oberen linken Ecke liegt
    if (node.pos[0] < 120 && node.pos[1] < 70) {
      node.pos[1] = 70 + titleHeight + margin; // Verschieben der y-Position unter das Rechteck
    }
  });

  const LGcanvas = graph.list_of_graphcanvas[0];
  LGcanvas.dirty_bgcanvas = true; // Setzen von dirty_bgcanvas
}



/**
 * covert canvas to image
 * and save the image file
 */

// Canvas2Image v1.0.9

var Canvas2Image = (function () {
  // check if support sth.
  var $support = (function () {
    var canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");

    return {
      canvas: !!ctx,
      imageData: !!ctx.getImageData,
      dataURL: !!canvas.toDataURL,
      btoa: !!window.btoa,
    };
  })();

  var downloadMime = "image/octet-stream";

  function scaleCanvas(canvas, width, height, background) {
    var w = canvas.width,
      h = canvas.height;
    if (width == undefined) {
      width = w;
    }
    if (height == undefined) {
      height = h;
    }

    var retCanvas = document.createElement("canvas");
    var retCtx = retCanvas.getContext("2d");
    retCanvas.width = width;
    retCanvas.height = height;

    if (background == undefined) {
      background = false;
    }
    if (background === true) {
      retCtx.fillStyle = "#ffffff";
      retCtx.fillRect(0, 0, width, height);
    }

    retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
    return retCanvas;
  }

  function getDataURL(canvas, type, width, height, background) {
    canvas = scaleCanvas(canvas, width, height, background);
    return canvas.toDataURL(type);
  }

  function saveFile(uri, name) {
    function eventFire(el, etype) {
      if (el.fireEvent) {
        el.fireEvent("on" + etype);
      } else {
        var evObj = document.createEvent("Events");
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    //		eventFire(link, "click");
    var body = document.getElementsByTagName("body")[0];

    body.appendChild(link);
    link.click();
    body.removeChild(link);
  }

  function genImage(strData) {
    var img = document.createElement("img");
    img.src = strData;
    return img;
  }
  function fixType(type) {
    type = type.toLowerCase().replace(/jpg/i, "jpeg");
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return "image/" + r;
  }
  function encodeData(data) {
    if (!window.btoa) {
      throw "btoa undefined";
    }
    var str = "";
    if (typeof data == "string") {
      str = data;
    } else {
      for (var i = 0; i < data.length; i++) {
        str += String.fromCharCode(data[i]);
      }
    }

    return btoa(str);
  }
  function getImageData(canvas) {
    var w = canvas.width,
      h = canvas.height;
    return canvas.getContext("2d").getImageData(0, 0, w, h);
  }
  function makeURI(strData, type) {
    return "data:" + type + ";base64;content-disposition=attachment," + strData;
  }

  /**
   * create bitmap image
   
   */
  var genBitmapImage = function (data) {
    var imgHeader = [],
      imgInfoHeader = [];

    var width = data.width,
      height = data.height;

    imgHeader.push(0x42); // 66 -> B
    imgHeader.push(0x4d); // 77 -> M

    var fsize = width * height * 3 + 54; // header size:54 bytes
    imgHeader.push(fsize % 256); // r
    fsize = Math.floor(fsize / 256);
    imgHeader.push(fsize % 256); // g
    fsize = Math.floor(fsize / 256);
    imgHeader.push(fsize % 256); // b
    fsize = Math.floor(fsize / 256);
    imgHeader.push(fsize % 256); // a

    imgHeader.push(0);
    imgHeader.push(0);
    imgHeader.push(0);
    imgHeader.push(0);

    imgHeader.push(54); // offset -> 6
    imgHeader.push(0);
    imgHeader.push(0);
    imgHeader.push(0);

    // info header
    imgInfoHeader.push(40); // info header size
    imgInfoHeader.push(0);
    imgInfoHeader.push(0);
    imgInfoHeader.push(0);

    // ����info
    var _width = width;
    imgInfoHeader.push(_width % 256);
    _width = Math.floor(_width / 256);
    imgInfoHeader.push(_width % 256);
    _width = Math.floor(_width / 256);
    imgInfoHeader.push(_width % 256);
    _width = Math.floor(_width / 256);
    imgInfoHeader.push(_width % 256);

    // ����info
    var _height = height;
    imgInfoHeader.push(_height % 256);
    _height = Math.floor(_height / 256);
    imgInfoHeader.push(_height % 256);
    _height = Math.floor(_height / 256);
    imgInfoHeader.push(_height % 256);
    _height = Math.floor(_height / 256);
    imgInfoHeader.push(_height % 256);

    imgInfoHeader.push(1);
    imgInfoHeader.push(0);
    imgInfoHeader.push(24); // 24λbitmap
    imgInfoHeader.push(0);

    // no compression
    imgInfoHeader.push(0);
    imgInfoHeader.push(0);
    imgInfoHeader.push(0);
    imgInfoHeader.push(0);

    // pixel data
    var dataSize = width * height * 3;
    imgInfoHeader.push(dataSize % 256);
    dataSize = Math.floor(dataSize / 256);
    imgInfoHeader.push(dataSize % 256);
    dataSize = Math.floor(dataSize / 256);
    imgInfoHeader.push(dataSize % 256);
    dataSize = Math.floor(dataSize / 256);
    imgInfoHeader.push(dataSize % 256);

    // blank space
    for (var i = 0; i < 16; i++) {
      imgInfoHeader.push(0);
    }

    var padding = (4 - ((width * 3) % 4)) % 4;
    var imgData = data.data;
    var strPixelData = "";
    var y = height;
    do {
      var offsetY = width * (y - 1) * 4;
      var strPixelRow = "";
      for (var x = 0; x < width; x++) {
        var offsetX = 4 * x;
        strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 2]);
        strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 1]);
        strPixelRow += String.fromCharCode(imgData[offsetY + offsetX]);
      }
      for (var n = 0; n < padding; n++) {
        strPixelRow += String.fromCharCode(0);
      }

      strPixelData += strPixelRow;
    } while (--y);

    return (
      encodeData(imgHeader.concat(imgInfoHeader)) + encodeData(strPixelData)
    );
  };

  /**
   * saveAsImage
   * @param canvasElement
   * @param {String} image type
   * @param {Number} [optional] png width
   * @param {Number} [optional] png height
   * @param {String} [optional] base filename without extension
   * @param {Boolean} [optional] if canvas(saved image) should have white background
   */
  var saveAsImage = function (
    canvas,
    width,
    height,
    type,
    filename,
    background
  ) {
    if ($support.canvas && $support.dataURL) {
      if (type == undefined) {
        type = "png";
      }
      if (filename == undefined) {
        filename = "default." + type;
      } else {
        filename += "." + type;
      }
      type = fixType(type);
      if (/bmp/.test(type)) {
        var data = getImageData(scaleCanvas(canvas, width, height, background));
        var strData = genBitmapImage(data);
        saveFile(makeURI(strData, downloadMime), filename);
      } else {
        var strData = getDataURL(canvas, type, width, height, background);
        saveFile(strData.replace(type, downloadMime), filename);
      }
    }
  };

  var convertToImage = function (canvas, width, height, type) {
    if ($support.canvas && $support.dataURL) {
      if (type == undefined) {
        type = "png";
      }
      type = fixType(type);

      if (/bmp/.test(type)) {
        var data = getImageData(scaleCanvas(canvas, width, height));
        var strData = genBitmapImage(data);
        return genImage(makeURI(strData, "image/bmp"));
      } else {
        var strData = getDataURL(canvas, type, width, height);
        return genImage(strData);
      }
    }
  };

  return {
    saveAsImage: saveAsImage,
    saveAsPNG: function (canvas, width, height, filename, background) {
      return saveAsImage(canvas, width, height, "png", filename, background);
    },
    saveAsJPEG: function (canvas, width, height, filename, background) {
      return saveAsImage(canvas, width, height, "jpeg", filename, background);
    },
    saveAsGIF: function (canvas, width, height, filename, background) {
      return saveAsImage(canvas, width, height, "gif", filename, background);
    },
    saveAsBMP: function (canvas, width, height, filename, background) {
      return saveAsImage(canvas, width, height, "bmp", filename, background);
    },

    convertToImage: convertToImage,
    convertToPNG: function (canvas, width, height) {
      return convertToImage(canvas, width, height, "png");
    },
    convertToJPEG: function (canvas, width, height) {
      return convertToImage(canvas, width, height, "jpeg");
    },
    convertToGIF: function (canvas, width, height) {
      return convertToImage(canvas, width, height, "gif");
    },
    convertToBMP: function (canvas, width, height) {
      return convertToImage(canvas, width, height, "bmp");
    },
  };
})();

function LightgraphtoImage(canvasId) {
  const canvasElement = document.getElementById(canvasId);
  if (!canvasElement) {
    alert(`Canvas mit ID "${canvasId}" nicht gefunden.`);
    return;
  }

  const graph = canvasElement.graph; // LGraph-Objekt vom Canvas
  if (!graph) {
    alert(`Kein Graph mit Canvas-ID "${canvasId}" gefunden.`);
    return;
  }

  const canvas = canvasElement.graph.list_of_graphcanvas[0];

const removeBackground = confirm("Möchtest du den Hintergrund für den Export entfernen? Bei Abbrechen wird er beibehalten.");
if (removeBackground) {
    canvas.clear_background_color = null;
    canvas.draw(true, true); // Zweiter Parameter "true" sorgt für komplettes Redraw
    setTimeout(() => {
        Canvas2Image.saveAsPNG(
          canvasElement,
          canvasElement.width,
          canvasElement.height,
          "Math-Nodes-Export",
          false
        );
        canvas.clear_background_color = canvasbgColor;
        canvas.draw(true, true); // Zweiter Parameter "true" sorgt für komplet
      }, 100); // Kurze Verzögerung, um sicherzustellen, dass der Canvas neu gezeichnet wurde
      
} else {
    Canvas2Image.saveAsPNG(
      canvasElement,
      canvasElement.width,
      canvasElement.height,
      "Math-Nodes-Export",
      false
    );
}
}

