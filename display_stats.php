<?php
// Pfad zur CSV-Datei
$file = '../private/counter.csv';

// Überprüfen, ob die Datei existiert
if (!file_exists($file)) {
    die("Die Statistikdatei existiert nicht.");
}

// Dateiinhalt lesen
$data = array_map('str_getcsv', file($file));

// HTML-Tabelle erstellen
echo '<table border="1">';
echo '<tr>';
foreach ($data[0] as $header) {
    echo '<th>' . htmlspecialchars($header) . '</th>';
}
echo '</tr>';

foreach ($data as $row) {
    echo '<tr>';
    foreach ($row as $cell) {
        echo '<td>' . htmlspecialchars($cell) . '</td>';
    }
    echo '</tr>';
}
echo '</table>';
?>