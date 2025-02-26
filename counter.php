<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Pfad zur CSV-Datei
$file = '../private/counter.csv';

// Aktuelles Datum
$date = date('Y-m-d');

// Unterseite ermitteln - aus GET-Parameter auslesen
if (isset($_GET['page'])) {
    // Seite aus GET-Parameter verwenden
    $page = $_GET['page'];
} else {
    // Fallback auf die alte Methode
    $page = basename($_SERVER['SCRIPT_NAME'], '.php');
    // Falls es eine HTML-Datei ist, .html entfernen
    if (substr($page, -5) === '.html') {
        $page = basename($page, '.html');
    }
}

// Überprüfen, ob die Datei existiert
if (!file_exists($file)) {
    // Datei erstellen und Kopfzeile hinzufügen
    file_put_contents($file, "Datum\n");
    echo "Datei erstellt und Kopfzeile hinzugefügt.\n";
}

// Dateiinhalt lesen
$data = array_map('str_getcsv', file($file));

// Überprüfen, ob die Datei leer ist
if (empty($data)) {
    // Kopfzeile hinzufügen, falls die Datei leer ist
    $data[] = ["Datum"];
}

// Letzte Zeile der Datei
$lastLine = end($data);

// Überprüfen, ob das Datum der letzten Zeile dem aktuellen Datum entspricht
if ($lastLine && $lastLine[0] == $date) {
    // Zugriffszähler für die entsprechende Seite erhöhen
    $pageIndex = array_search($page, $data[0]);
    if ($pageIndex === false) {
        // Seite nicht gefunden, neue Spalte hinzufügen
        $data[0][] = $page;
        $pageIndex = count($data[0]) - 1;
        foreach ($data as $key => $row) {
            if ($key > 0) {
                $data[$key][] = 0;
            }
        }
        echo "Neue Spalte für Seite '$page' hinzugefügt.\n";
    }
    $lastLine[$pageIndex]++;
    // Letzte Zeile aktualisieren
    $data[count($data) - 1] = $lastLine;
    echo "Zugriffszähler für Seite '$page' erhöht.\n";
} else {
    // Neue Zeile für das aktuelle Datum hinzufügen
    $newLine = array_fill(0, count($data[0]), 0);
    $newLine[0] = $date;
    $pageIndex = array_search($page, $data[0]);
    if ($pageIndex === false) {
        // Seite nicht gefunden, neue Spalte hinzufügen
        $data[0][] = $page;
        $pageIndex = count($data[0]) - 1;
        foreach ($data as $key => $row) {
            if ($key > 0) {
                $data[$key][] = 0;
            }
        }
        echo "Neue Spalte für Seite '$page' hinzugefügt.\n";
    }
    $newLine[$pageIndex] = 1;
    $data[] = $newLine;
    echo "Neue Zeile für Datum '$date' hinzugefügt.\n";
}

// Dateiinhalt aktualisieren
$fp = fopen($file, 'w');
foreach ($data as $line) {
    fputcsv($fp, $line);
}
fclose($fp);

echo "Zähler aktualisiert.\n";
?>