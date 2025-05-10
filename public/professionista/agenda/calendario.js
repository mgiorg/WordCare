let dataSelezionata = null;

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const anno = today.getFullYear();
  const mese = today.getMonth();
  document.getElementById("titolo-mese").textContent = today.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

  generaCalendario(anno, mese);
  caricaEventi();

  document.getElementById("close-modal").onclick = chiudiModal;
  document.getElementById("btn-crea-app").onclick = () => toggleVisibili("form-appuntamento");
  document.getElementById("btn-crea-prom").onclick = () => toggleVisibili("form-promemoria");
  document.getElementById("btn-elimina").onclick = mostraEliminazione;

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
    fetch("/agenda").then(r => r.json()),
    fetch("/promemoria").then(r => r.json())
  ]).then(([apps, proms]) => {
    apps.forEach(app => {
      creaEventoHTML(app.data, app.ora, "appuntamento", `${app.nome} ${app.cognome} (${app.patologia})`, app.id);
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
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("selected-date").textContent = `Data selezionata: ${data}`;
  document.querySelectorAll("#modal form, #lista-eliminazione").forEach(el => el.classList.add("hidden"));
}

function chiudiModal() {
  document.getElementById("modal").classList.add("hidden");
  document.querySelectorAll("#modal form, #lista-eliminazione").forEach(el => el.classList.add("hidden"));
  document.getElementById("form-appuntamento").reset();
  document.getElementById("form-promemoria").reset();
}

function toggleVisibili(id) {
  document.querySelectorAll("#modal form, #lista-eliminazione").forEach(el => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function creaAppuntamento(e) {
  e.preventDefault();
  const dati = Object.fromEntries(new FormData(e.target).entries());
  dati.data = dataSelezionata;

  fetch("/agenda", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dati)
  }).then(r => r.ok && location.reload());
}

function creaPromemoria(e) {
  e.preventDefault();
  const dati = Object.fromEntries(new FormData(e.target).entries());
  dati.data = dataSelezionata;

  fetch("/promemoria", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dati)
  }).then(r => r.ok && location.reload());
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
  toggleVisibili("lista-eliminazione");
}

function eliminaEvento(id, isAppuntamento) {
  const url = isAppuntamento ? `/agenda/${id}/elimina` : `/promemoria/${id}/elimina`;
  fetch(url, { method: "POST" }).then(r => r.ok && location.reload());
}
