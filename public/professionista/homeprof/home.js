document.addEventListener("DOMContentLoaded", () => {
  // Messaggio di benvenuto
  fetch("/professionista/profilo")
    .then(res => res.json())
    .then(data => {
      console.log("✅ Dati ricevuti:", data);
      const welcome = document.getElementById("welcomeMessage");
      if (welcome) {
        welcome.textContent = `Bentornato, Dr. ${data.cognome} ${data.nome}`;
      }
    })
    .catch(err => {
      console.error("❌ Errore nel caricamento del profilo:", err);
    });

  // Appuntamenti
  fetch("/professionista/agenda")
    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const weekAhead = new Date();
      weekAhead.setDate(today.getDate() + 7);

      // Aggiunta dati demo per la presentazione
      if (!data || data.length === 0) {
        data = [
          { data: "2025-06-04", ora: "10:00", paziente_nome: "Marco", paziente_cognome: "Verdi" },
          { data: "2025-06-05", ora: "14:00", paziente_nome: "Sara", paziente_cognome: "Rossi" },
          { data: "2025-06-06", ora: "16:30", paziente_nome: "Luca", paziente_cognome: "Bianchi" }
        ];
      }

      const filtered = data.filter(app => {
        const appDate = new Date(app.data);
        return appDate >= today && appDate <= weekAhead;
      }).slice(0, 3);

      const list = document.getElementById("appuntamentiList");
      filtered.forEach(app => {
        const li = document.createElement("li");
        li.className = "card__list_item";
        li.innerHTML = `<span>•</span> ${app.data} - ${app.ora} (${app.paziente_nome} ${app.paziente_cognome})`;
        list.appendChild(li);
      });
    });

  // Promemoria
  fetch("/professionista/promemoria")
    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const weekAhead = new Date();
      weekAhead.setDate(today.getDate() + 7);

      // Aggiunta dati demo per la presentazione
      if (!data || data.length === 0) {
        data = [
          { data: "2025-06-05", ora_notifica: "09:00", nota: "Controllare referti paziente Rossi" },
          { data: "2025-06-06", ora_notifica: "11:30", nota: "Inviare report alla logopedista" },
          { data: "2025-06-07", ora_notifica: "15:00", nota: "Telefonata di follow-up a Bianchi" }
        ];
      }

      const filtered = data.filter(p => {
        const promDate = new Date(p.data);
        return promDate >= today && promDate <= weekAhead;
      }).slice(0, 3);

      const list = document.getElementById("promemoriaList");
      filtered.forEach(p => {
        const li = document.createElement("li");
        li.className = "card__list_item";
        li.innerHTML = `<span>•</span> ${p.data} - ${p.ora_notifica}: ${p.nota}`;
        list.appendChild(li);
      });
    });
});
