// /professionista/i tuoi pazienti/dettagli/dettagli.js

document.addEventListener('DOMContentLoaded', () => {
  const patientId = getPatientIdFromUrl();

  // Carica dati anagrafici paziente
  fetch(`/professionista/pazienti/${patientId}/dati`)
    .then(res => res.json())
    .then(data => {
      const header = document.querySelector('.card_title__container');
      header.innerHTML = `
        <div class="card_paragraph">ID Paziente: ${data.id} &nbsp; | &nbsp; Patologia: ${data.patologia}</div>
        <div class="card_paragraph">Nome: ${data.nome} &nbsp; | &nbsp; Cognome: ${data.cognome}</div>
        <div class="card_paragraph">Data di nascita: ${formatDate(data.data_nascita)} &nbsp; | &nbsp;
          <a href="#" style="color: var(--paragraph); text-decoration: underline;">Cartella Clinica</a>
        </div>
      `;
    });

  // Carica esercizi assegnati
  fetch(`/professionista/pazienti/${patientId}/esercizi`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('tbody');
      tbody.innerHTML = '';

      data.forEach(es => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" ${es.ripetizioni_svolte >= es.ripetizioni_assegnate ? 'checked' : ''}></td>
          <td>${es.gioco}</td>
          <td>${formatDate(es.scadenza)}</td>
          <td>${es.ripetizioni_svolte}/${es.ripetizioni_assegnate}</td>
        `;
        tbody.appendChild(tr);
      });
    });

  // Inizializza i grafici statici
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(drawCharts);
});

function getPatientIdFromUrl() {
  const parts = window.location.pathname.split('/');
  return parts[2]; // /pazienti/:id/view
}

function formatDate(data) {
  if (!data) return '';
  const [y, m, d] = data.split('-');
  return `${d}/${m}/${y}`;
}

// ----------------- GRAFICI STATICI ------------------

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
