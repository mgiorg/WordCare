
    // Carica lista pazienti
    fetch('/pazienti')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('lista-pazienti');
        data.forEach(p => {
          const row = document.createElement('div');
          row.className = 'card-row';
          row.innerHTML = `
            <div><strong>${p.nome} ${p.cognome}</strong> - Età: ${p.eta} - Patologia: ${p.patologia}</div>
          `;
          row.onclick = () => window.location.href = '/pazienti/' + p.id;
          container.appendChild(row);
        });
      });

    // Aggiungi paziente
    function aggiungiPaziente() {
      const id = document.getElementById('paziente-id').value;
      const nome = document.getElementById('paziente-nome').value;
      const cognome = document.getElementById('paziente-cognome').value;

      fetch('/pazienti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nome, cognome })
      })
      .then(res => {
        if (res.ok) return location.reload();
        alert('Errore durante l\'aggiunta');
      });
    }
