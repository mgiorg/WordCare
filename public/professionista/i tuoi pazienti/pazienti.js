// /professionista/i tuoi pazienti/pazienti.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lista-pazienti');

  fetch('/pazienti')
    .then(res => {
      if (!res.ok) throw new Error("Errore durante il caricamento dei pazienti");
      return res.json();
    })
    .then(data => {
      // Svuota contenuto predefinito
      container.innerHTML = '';

      if (data.length === 0) {
        container.innerHTML = '<p style="color: var(--paragraph);">Nessun paziente in cura.</p>';
        return;
      }

      data.forEach(p => {
        const row = document.createElement('div');
        row.className = 'card-row';
        row.innerHTML = `
          <div><strong>${p.nome} ${p.cognome}</strong> - Età: ${calcolaEta(p.data_nascita)} - Patologia: ${p.patologia}</div>
        `;
        row.onclick = () => {
          window.location.href = `/pazienti/${p.id}/view`;
        };
        container.appendChild(row);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<p style="color: red;">Errore durante il caricamento dei pazienti</p>';
    });
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
