let dataSelezionata = null;

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const anno = today.getFullYear();
  const mese = today.getMonth();
  document.getElementById("titolo-mese").textContent = today.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

  generaCalendario(anno, mese);
  caricaEventi();

  document.getElementById("form-appuntamento").onsubmit = creaAppuntamento;
  document.getElementById("form-promemoria").onsubmit = creaPromemoria;
});

function generaCalendario(anno, mese) {
  const ul = document.getElementById("calendar-list");
  const giorni = new Date(anno, mese + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  for (let i = 1; i <= giorni; i++) {
    const data = new Date(anno, mese, i);
    const iso = data.toISOString().split("T")[0];

    const li = document.createElement("li");
    li.dataset.date = iso;

    const time = document.createElement("time");
    time.setAttribute("datetime", iso);
    time.textContent = i;

    li.appendChild(time);
    if (iso === today) li.classList.add("today");

    li.onclick = () => apriModal(iso);
    ul.appendChild(li);
  }
}

function caricaEventi() {
  Promise.all([
    fetch("/professionista/agenda").then(r => r.json()),
    fetch("/professionista/promemoria").then(r => r.json())
  ]).then(([apps, proms]) => {
    apps.forEach(app => {
      creaEventoHTML(app.data, app.ora, "appuntamento", `${app.paziente_nome} ${app.paziente_cognome}`, app.id);
    });
    proms.forEach(prom => {
      creaEventoHTML(prom.data, prom.ora_notifica, "promemoria", prom.nota, prom.id);
    });
  });
}

function creaEventoHTML(data, ora, tipo, descrizione, id) {
  const box = document.querySelector(`li[data-date="${data}"]`);
  if (!box) return;

  const div = document.createElement("div");
  div.className = `event ${tipo}`;
  div.textContent = `${ora} - ${descrizione}`;
  div.dataset.id = id;
  box.appendChild(div);
}

function apriModal(data) {
  dataSelezionata = data;
  document.getElementById("data-attiva").textContent = data;
  mostraEliminazione();
}

function creaAppuntamento(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const dati = {
  data: form.get('data'),
  ora: form.get('ora'),
  sede: form.get('sede'),
  paziente_id: form.get('paziente_id')
};

  if (!dati.data) {
    alert("Inserisci una data valida.");
    return;
  }

  console.log("📤 Invio appuntamento:", dati);

  fetch("/professionista/agenda", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dati)
  }).then(res => {
    if (res.ok) {
      alert("✅ Appuntamento salvato!");
      location.reload();
    } else {
      alert("❌ Errore nel salvataggio.");
    }
  });
}

function creaPromemoria(e) {
  e.preventDefault();
  const dati = Object.fromEntries(new FormData(e.target).entries());

  if (!dati.data) {
    alert("Inserisci una data valida.");
    return;
  }

  console.log("📤 Invio promemoria:", dati);

  fetch("/professionista/promemoria", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dati)
  }).then(res => {
    if (res.ok) {
      alert("✅ Promemoria salvato!");
      location.reload();
    } else {
      alert("❌ Errore nel salvataggio.");
    }
  });
}

function mostraEliminazione() {
  const lista = document.getElementById("eventi-giorno");
  lista.innerHTML = "";
  document.querySelectorAll(`#calendar-list li[data-date="${dataSelezionata}"] .event`)
    .forEach(ev => {
      const li = document.createElement("li");
      li.textContent = ev.textContent;

      const btn = document.createElement("button");
      btn.textContent = "X";
      btn.onclick = () => eliminaEvento(ev.dataset.id, ev.classList.contains("appuntamento"));

      li.appendChild(btn);
      lista.appendChild(li);
    });
}

function eliminaEvento(id, isAppuntamento) {
  const url = isAppuntamento ? `/professionista/agenda/${id}/elimina` : `/professionista/promemoria/${id}/elimina`;
  fetch(url, { method: "POST" }).then(r => r.ok && location.reload());
}
