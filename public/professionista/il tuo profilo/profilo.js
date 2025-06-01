
document.addEventListener('DOMContentLoaded', () => {
  const esito = document.getElementById('esito');

  // Fetch profilo professionista dalla sessione utente
  fetch('/professionista/profilo')
    .then(res => {
      if (!res.ok) throw new Error("Errore nel recupero dati profilo");
      return res.json();
    })
    .then(data => {
      document.getElementById('user_id').value = data.id || '';
      document.getElementById('nome').value = data.nome || '';
      document.getElementById('cognome').value = data.cognome || '';
      document.getElementById('data_nascita').value = data.data_nascita || '';
      document.getElementById('sede').value = data.sede || '';
      document.getElementById('specializzazione').value = data.specializzazione || '';
    })
    .catch(err => {
      console.error(err);
      esito.textContent = "Errore nel caricamento del profilo";
      esito.style.color = 'red';
    });

  // Salvataggio modifiche
  document.getElementById('salvaBtn').addEventListener('click', () => {
    const payload = {
      nome: document.getElementById('nome').value,
      cognome: document.getElementById('cognome').value,
      data_nascita: document.getElementById('data_nascita').value,
      sede: document.getElementById('sede').value,
      specializzazione: document.getElementById('specializzazione').value
    };

    fetch('/professionista/profilo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        esito.textContent = "Salvataggio riuscito ✅";
        esito.style.color = 'lightgreen';
      } else {
        throw new Error("Salvataggio non riuscito");
      }
    })
    .catch(err => {
      console.error(err);
      esito.textContent = "Errore durante il salvataggio ❌";
      esito.style.color = 'red';
    });
  });
});

