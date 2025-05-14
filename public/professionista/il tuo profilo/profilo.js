document.addEventListener('DOMContentLoaded', () => {
  fetch('/professionista/profilo')
    .then(res => res.json())
    .then(data => {
      document.getElementById('user_id').value = data.id || '';
      document.getElementById('nome').value = data.nome || '';
      document.getElementById('cognome').value = data.cognome || '';
      document.getElementById('data_nascita').value = data.data_nascita || '';
      document.getElementById('sede').value = data.sede || '';
      document.getElementById('specializzazione').value = data.specializzazione || '';
    });

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
      const esito = document.getElementById('esito');
      if (result.success) {
        esito.textContent = "Salvataggio riuscito";
        esito.style.color = 'green';
      } else {
        esito.textContent = "Errore durante il salvataggio";
        esito.style.color = 'red';
      }
    });
  });
});
