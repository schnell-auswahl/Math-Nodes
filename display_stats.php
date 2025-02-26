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

foreach ($data as $index => $row) {
    if ($index === 0) {
        continue; // Überspringe die Kopfzeile
    }
    echo '<tr>';
    foreach ($row as $cell) {
        echo '<td>' . htmlspecialchars($cell) . '</td>';
    }
    echo '</tr>';
}
echo '</table>';

// Daten für die Graphen vorbereiten
$monthlyLabels = [];
$monthlyData = [];
$yearlyLabels = [];
$yearlyData = [];

foreach ($data as $index => $row) {
    if ($index === 0) {
        continue; // Überspringe die Kopfzeile
    }
    $date = $row[0];
    $indexAccess = $row[1];

    // Daten für den letzten Monat (Beispiel: letzten 30 Tage)
    if (strtotime($date) >= strtotime('-30 days')) {
        $monthlyLabels[] = $date;
        $monthlyData[] = (int)$indexAccess;
    }

    // Daten für das ganze Jahr (Beispiel: alle Daten im aktuellen Jahr)
    if (date('Y', strtotime($date)) === date('Y')) {
        $yearlyLabels[] = $date;
        $yearlyData[] = (int)$indexAccess;
    }
}

// Daten als JSON für JavaScript
echo '<script>';
echo 'const monthlyData = ' . json_encode(['labels' => $monthlyLabels, 'data' => $monthlyData]) . ';';
echo 'const yearlyData = ' . json_encode(['labels' => $yearlyLabels, 'data' => $yearlyData]) . ';';
echo '</script>';
?>