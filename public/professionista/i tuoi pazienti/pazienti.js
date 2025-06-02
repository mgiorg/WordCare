// /professionista/i tuoi pazienti/pazienti.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lista-pazienti');
  const form = document.getElementById('form-aggiungi-paziente');

  // 🔄 Carica pazienti esistenti
  fetch('/professionista/pazienti')
    .then(res => {
      if (!res.ok) throw new Error("Errore durante il caricamento dei pazienti");
      return res.json();
    })
    .then(data => {
      container.innerHTML = '';

      if (data.length === 0) {
  // Paziente predefinito
      const pazienteExtra = {
        id: 'extra',
        nome: 'Mario',
        cognome: 'Rossi',
        data_nascita: '1980-01-01',
        patologia: 'Pazzie varie'
      };

      const row = document.createElement('div');
      row.className = 'card-row';
      row.innerHTML = `
        <div><strong>${pazienteExtra.nome} ${pazienteExtra.cognome}</strong> - Età: ${calcolaEta(pazienteExtra.data_nascita)} - Patologia: ${pazienteExtra.patologia}</div>
      `;
      row.onclick = () => {
      window.location.href = '/professionista/i tuoi pazienti/dettagli/dettagli.html';
    };
      container.appendChild(row);
      return;
    }

      data.forEach(p => {
        const row = document.createElement('div');
        row.className = 'card-row';
        row.innerHTML = `
          <div><strong>${p.nome} ${p.cognome}</strong> - Età: ${calcolaEta(p.data_nascita)} - Patologia: ${p.patologia}</div>
        `;
        row.onclick = () => {
          window.location.href = `/professionista/pazienti/${p.id}/view`;
        };
        container.appendChild(row);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<p style="color: red;">Errore durante il caricamento dei pazienti</p>';
    });

  // ➕ Aggiunta paziente
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const cognome = document.getElementById('cognome').value.trim();
      const data_nascita = document.getElementById('data_nascita').value;
      const patologia = document.getElementById('patologia').value.trim();

      fetch('/professionista/pazienti/aggiungi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, cognome, data_nascita, patologia })
  })
    .then(res => {
      if (!res.ok) throw new Error("Errore durante l'aggiunta del paziente");
      return res.json();
    })
    .then(data => {
      alert("✅ Paziente aggiunto!");
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("❌ Errore durante l'aggiunta del paziente.");
    });
    });
  }
});

// 🔧 Calcolo età da data di nascita (formato YYYY-MM-DD)
function calcolaEta(dataNascita) {
  if (!dataNascita) return 'N/A';
  const oggi = new Date();
  const nascita = new Date(dataNascita);
  let eta = oggi.getFullYear() - nascita.getFullYear();
  const m = oggi.getMonth() - nascita.getMonth();
  if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) {
    eta--;
  }
  return eta;
}
