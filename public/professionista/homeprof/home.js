document.addEventListener("DOMContentLoaded", () => {
  // Welcome message
  fetch("/profilo")
    .then(res => res.json())
    .then(data => {
      const welcome = document.getElementById("welcomeMessage");
      welcome.textContent = `Benvenuto, Dr. ${data.nome} ${data.cognome}`;
    });

  // Appuntamenti
  fetch("/appuntamenti")
    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const weekAhead = new Date();
      weekAhead.setDate(today.getDate() + 7);

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
  fetch("/promemoria")
    .then(res => res.json())
    .then(data => {
      const today = new Date();
      const weekAhead = new Date();
      weekAhead.setDate(today.getDate() + 7);

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



