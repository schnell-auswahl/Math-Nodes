<!DOCTYPE HTML>
<!--
    Forty by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>

<head>
    <title>Statistik</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="assets/css/main.css" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <noscript>
        <link rel="stylesheet" href="assets/css/noscript.css" />
    </noscript>
</head>

<body class="is-preload">

    <!-- Wrapper -->
    <div id="wrapper">

        <!-- Header -->
        <header id="header" class="alt">
            <a href="index.html" class="logo"><strong>Math-Nodes</strong> <span>Nicolas Regel</span></a>
            <nav>
                <a href="#menu">Menü</a>
            </nav>
        </header>
        <!-- Menu -->
        <nav id="menu">
            <ul class="links">
                <li><a href="Wortmaschinen.html">1: Wortmaschinen</a></li>
                <li><a href="Funktionsmaschinen.html">2: Funktionsmaschinen</a></li>
                <li><a href="Funktionsmaschinen.html">3: Funktionsmaschinen</a></li>
                <li><a href="FunktionenHoeren.html">4: Funktionen hören</a></li>
                <li><a href="Eigene_Aufgaben.html">Eigene Aufgaben erstellen</a></li>
                <li><a href="Anleitung_Landing.html">Anleitung</a></li>
                <li><a href="Impressum.html">Impressum</a></li>
                <li><a href="stats.php">Statistik</a></li>
            </ul>
            <ul class="actions stacked">
                <li><a href="index.html" class="button primary fit">Startseite</a></li>
            </ul>
        </nav>


        <!-- Main -->
        <div id="main" class="alt">

            <!-- One -->
            <section id="one">
                <div class="inner">
                    <header class="major">
                        <h1>Statistik</h1>
                    </header>
                    
                                              <!-- Canvas für die Graphen -->
        <canvas id="monthlyChart" width="400" height="200"></canvas>
        <canvas id="yearlyChart" width="400" height="200"></canvas>
                    <?php include 'display_stats.php'; ?>

  

                </div>
            </section>

        </div>

        <!-- Contact -->
        <section id="contact">
            <div class="inner">
                
                <section>
                    <section>
                        <div class="contact-method">
                            <span class="icon solid alt fa-envelope"></span>
                            <h3>Mail</h3>
                            <a href="mailto:Nicolas.Regel@TU-Dresden.de">Nicolas.Regel@TU-Dresden.de</a>
                        </div>
                    </section>
                    <section>
                        <div class="contact-method">
                            <span class="icon solid alt fa-phone"></span>
                            <h3>Telefon</h3>
                            <span>0351 46332074</span>
                        </div>
                    </section>

                </section>
            </div>
        </section>

        <!-- Footer -->
        <footer id="footer">
            <div class="inner">
                <ul class="icons">
                    <li><a href="https://github.com/schnell-auswahl/Math-Nodes" class="icon brands alt fa-github"><span class="label">GitHub</span></a></li>
                </ul>
                <ul class="copyright">
                    <li>&copy; Nicolas Regel 2024</li><li><a href="Impressum.html" >Impressum</a></li><li>Designtemplate: <a href="https://html5up.net">HTML5 UP</a></li>
                </ul>
            </div>
        </footer>

    <!-- Scripts -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/jquery.scrolly.min.js"></script>
    <script src="assets/js/jquery.scrollex.min.js"></script>
    <script src="assets/js/browser.min.js"></script>
    <script src="assets/js/breakpoints.min.js"></script>
    <script src="assets/js/util.js"></script>
    <script src="assets/js/main.js"></script>

    <script>
    // Konfiguration für den monatlichen Graphen
    const monthlyConfig = {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Zugriffe im letzten Monat',
                data: monthlyData.data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white' // Schriftfarbe auf Weiß setzen
                    }
                },
                x: {
                    ticks: {
                        color: 'white' // Schriftfarbe auf Weiß setzen
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Schriftfarbe auf Weiß setzen
                    }
                }
            }
        }
    };

    // Konfiguration für den jährlichen Graphen
    const yearlyConfig = {
        type: 'line',
        data: {
            labels: yearlyData.labels,
            datasets: [{
                label: 'Zugriffe im Jahr',
                data: yearlyData.data,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white' // Schriftfarbe auf Weiß setzen
                    }
                },
                x: {
                    ticks: {
                        color: 'white' // Schriftfarbe auf Weiß setzen
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Schriftfarbe auf Weiß setzen
                    }
                }
            }
        }
    };

    // Initialisierung der Graphen
    const monthlyChart = new Chart(
        document.getElementById('monthlyChart'),
        monthlyConfig
    );

    const yearlyChart = new Chart(
        document.getElementById('yearlyChart'),
        yearlyConfig
    );
</script>


</body>

</html>