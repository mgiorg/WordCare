let dataSelezionata = null;

document.addEventListener("DOMContentLoaded", async () => {
  const today = new Date();
  const anno = today.getFullYear();
  const mese = today.getMonth();
  const oggiISO = today.toISOString().split("T")[0];

  document.getElementById("titolo-mese").textContent = today.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric"
  });

  generaCalendario(anno, mese);
  await caricaEventi(); // Attendi il caricamento
  apriModal(oggiISO);   // Seleziona oggi come giorno attivo

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

async function caricaEventi() {
  let [apps, proms] = await Promise.all([
    fetch("/professionista/agenda").then(r => r.json()),
    fetch("/professionista/promemoria").then(r => r.json())
  ]);

  if (!apps || apps.length === 0) {
    apps = [
      { id: "demo1", data: "2025-06-04", ora: "10:00", paziente_nome: "Marco", paziente_cognome: "Verdi" },
      { id: "demo2", data: "2025-06-05", ora: "14:00", paziente_nome: "Sara", paziente_cognome: "Rossi" },
      { id: "demo3", data: "2025-06-06", ora: "16:30", paziente_nome: "Luca", paziente_cognome: "Bianchi" }
    ];
  }

  if (!proms || proms.length === 0) {
    proms = [
      { id: "demo4", data: "2025-06-05", ora_notifica: "09:00", nota: "Controllare referti paziente Rossi" },
      { id: "demo5", data: "2025-06-06", ora_notifica: "11:30", nota: "Inviare report alla logopedista" },
      { id: "demo6", data: "2025-06-07", ora_notifica: "15:00", nota: "Telefonata di follow-up a Bianchi" }
    ];
  }

  apps.forEach(app => {
    creaEventoHTML(app.data, app.ora, "appuntamento", `${app.paziente_nome} ${app.paziente_cognome}`, app.id);
  });
  proms.forEach(prom => {
    creaEventoHTML(prom.data, prom.ora_notifica, "promemoria", prom.nota, prom.id);
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
