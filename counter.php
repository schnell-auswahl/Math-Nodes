<?php
// Pfad zur CSV-Datei
$file = '../private/counter.csv';

// Aktuelles Datum
$date = date('Y-m-d');

// Unterseite ermitteln
$page = basename($_SERVER['SCRIPT_NAME'], '.php');

// Überprüfen, ob die Datei existiert
if (!file_exists($file)) {
    // Datei erstellen und Kopfzeile hinzufügen
    file_put_contents($file, "Datum,index,Wortmaschinen\n");
}

// Dateiinhalt lesen
$data = array_map('str_getcsv', file($file));

// Letzte Zeile der Datei
$lastLine = end($data);

// Überprüfen, ob das Datum der letzten Zeile dem aktuellen Datum entspricht
if ($lastLine[0] == $date) {
    // Zugriffszähler für die entsprechende Seite erhöhen
    $pageIndex = array_search($page, $data[0]);
    $lastLine[$pageIndex]++;
    // Letzte Zeile aktualisieren
    $data[count($data) - 1] = $lastLine;
} else {
    // Neue Zeile für das aktuelle Datum hinzufügen
    $newLine = array_fill(0, count($data[0]), 0);
    $newLine[0] = $date;
    $pageIndex = array_search($page, $data[0]);
    $newLine[$pageIndex] = 1;
    $data[] = $newLine;
}

// Dateiinhalt aktualisieren
$fp = fopen($file, 'w');
foreach ($data as $line) {
    fputcsv($fp, $line);
}
fclose($fp);

echo "Zähler aktualisiert.";
?>