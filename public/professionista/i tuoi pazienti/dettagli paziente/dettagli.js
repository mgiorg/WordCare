google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawCharts);
document.getElementById('graficoEsercizi');
document.getElementById('graficoMedia');


function drawCharts() {
  drawEserciziSettimanali();
  drawMediaSettimane();
}

function drawEserciziSettimanali() {
  const data = google.visualization.arrayToDataTable([
    ['Giorno', 'Esercizi svolti'],
    ['Lun', 3],
    ['Mar', 5],
    ['Mer', 2],
    ['Gio', 4],
    ['Ven', 6],
    ['Sab', 7],
    ['Dom', 3]
  ]);

  const options = {
    title: 'Esercizi giornalieri (1-10)',
    legend: { position: 'bottom' },
    backgroundColor: '#1e1f29',
    titleTextStyle: { color: '#ffffff' },
    vAxis: { minValue: 0, maxValue: 10, textStyle: { color: '#ffffff' } },
    hAxis: { textStyle: { color: '#ffffff' } },
    legendTextStyle: { color: '#ffffff' }
  };

  const chart = new google.visualization.ColumnChart(document.getElementById('graficoEsercizi'));
  chart.draw(data, options);
}

function drawMediaSettimane() {
  const data = google.visualization.arrayToDataTable([
    ['Settimana', 'Media'],
    ['Settimana 1', 7.5],
    ['Settimana 2', 8.0],
    ['Settimana 3', 6.2],
    ['Settimana 4', 9.0],
    ['Settimana 5', 8.4],
    ['Settimana 6', 7.8]
  ]);

  const options = {
    title: 'Media settimanale dei risultati (1-10)',
    curveType: 'function',
    legend: { position: 'bottom' },
    backgroundColor: '#1e1f29',
    titleTextStyle: { color: '#ffffff' },
    vAxis: { minValue: 0, maxValue: 10, textStyle: { color: '#ffffff' } },
    hAxis: { textStyle: { color: '#ffffff' } },
    legendTextStyle: { color: '#ffffff' }
  };

  const chart = new google.visualization.LineChart(document.getElementById('graficoMedia'));
  chart.draw(data, options);
}

