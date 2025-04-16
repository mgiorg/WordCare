// Variabili globali
let currentView = 'month'; // oppure "week"
let currentDate = new Date();  // Data corrente della vista
let appointments = {};  // archivia gli appuntamenti con chiave in formato "YYYY-MM-DD"

// Formatta una data in YYYY-MM-DD
function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Ritorna la data di domani
function getTomorrow(date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

// Aggiorna la scritta della data corrente in header
function updateCurrentDateDisplay() {
  const display = document.getElementById('currentDateDisplay');
  display.textContent = `Visualizzazione per: ${currentView === 'month' ? 'Mese' : 'Settimana'} - ${currentDate.toLocaleDateString('it-IT')}`;
}

// Renderizza il calendario in base alla vista corrente
function renderCalendar() {
  updateCurrentDateDisplay();
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = ''; // pulizia

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  // Intestazione con i giorni della settimana (lunedì come primo giorno)
  const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  giorni.forEach(giorno => {
    const th = document.createElement('th');
    th.textContent = giorno;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  if (currentView === 'month') {
    // Vista mese: determina il primo giorno del mese e crea la tabella
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    let startDay = firstDayOfMonth.getDay();
    // Adattare: in JS getDay() restituisce 0 per domenica; in Italia la settimana inizia di lunedì
    startDay = startDay === 0 ? 7 : startDay;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startDay - 1 + daysInMonth) / 7) * 7;
    let dayCounter = 1;

    for (let i = 0; i < totalCells / 7; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const td = document.createElement('td');
        const cellIndex = i * 7 + j;
        if (cellIndex >= startDay - 1 && dayCounter <= daysInMonth) {
          const cellDate = new Date(year, month, dayCounter);
          const cellDateStr = formatDate(cellDate);
          td.textContent = dayCounter;
          td.setAttribute('data-date', cellDateStr);

          // Evidenzia il giorno corrente (se combacia con oggi)
          if (cellDateStr === formatDate(new Date())) {
            td.classList.add('today');
          }

          // Se per questo giorno è presente un appuntamento, aggiunge una classe/indicatore
          if (appointments[cellDateStr]) {
            td.classList.add('has-appointment');
            const note = document.createElement('div');
            note.className = 'appointment-note';
            note.textContent = appointments[cellDateStr].patientName;
            note.style.fontSize = "0.7rem";
            note.style.marginTop = "5px";
            td.appendChild(note);
          }

          // Verifica se per questo giorno c'è un appuntamento che richiede reminder (oggi o domani)
          const todayStr = formatDate(new Date());
          const tomorrowStr = formatDate(getTomorrow(new Date()));
          if (appointments[cellDateStr] && (cellDateStr === todayStr || cellDateStr === tomorrowStr)) {
            td.classList.add('reminder');
          }

          // Aggiunge l'evento di click alla cella
          td.addEventListener('click', () => openModal(cellDateStr));

          dayCounter++;
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  } else if (currentView === 'week') {
    // Vista settimana: calcola il lunedì della settimana corrente
    const dayOfWeek = currentDate.getDay();
    // Se la domenica (0), consideriamola come ultimo giorno
    const diff = currentDate.getDay() === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + diff);

    const tr = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      const td = document.createElement('td');
      const cellDate = new Date(monday);
      cellDate.setDate(monday.getDate() + i);
      const cellDateStr = formatDate(cellDate);
      td.textContent = cellDate.getDate();
      td.setAttribute('data-date', cellDateStr);

      if (cellDateStr === formatDate(new Date())) {
        td.classList.add('today');
      }
      if (appointments[cellDateStr]) {
        td.classList.add('has-appointment');
        const note = document.createElement('div');
        note.className = 'appointment-note';
        note.textContent = appointments[cellDateStr].patientName;
        note.style.fontSize = "0.7rem";
        note.style.marginTop = "5px";
        td.appendChild(note);
      }
      const todayStr = formatDate(new Date());
      const tomorrowStr = formatDate(getTomorrow(new Date()));
      if (appointments[cellDateStr] && (cellDateStr === todayStr || cellDateStr === tomorrowStr)) {
        td.classList.add('reminder');
      }

      td.addEventListener('click', () => openModal(cellDateStr));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  calendarDiv.appendChild(table);

  updateReminders();
}

// Aggiorna la lista dei reminder (appuntamenti per oggi o domani)
function updateReminders() {
  const reminderList = document.getElementById('reminderList');
  reminderList.innerHTML = '';
  const todayStr = formatDate(new Date());
  const tomorrowStr = formatDate(getTomorrow(new Date()));

  for (let key in appointments) {
    if (key === todayStr || key === tomorrowStr) {
      const li = document.createElement('li');
      const app = appointments[key];
      li.textContent = `[${key}] ${app.appTime} - ${app.patientName} presso ${app.location}`;
      reminderList.appendChild(li);
    }
  }
}

// Apertura del popup per aggiungere/modificare/cancellare un appuntamento
function openModal(dateStr) {
  const modal = document.getElementById('appointmentModal');
  modal.style.display = 'block';
  
  // Imposta il campo data in sola lettura
  document.getElementById('appDate').value = dateStr;
  
  // Se esiste già un appuntamento per questa data, pre-compila i campi
  if (appointments[dateStr]) {
    const app = appointments[dateStr];
    document.getElementById('appTime').value = app.appTime;
    document.getElementById('patientName').value = app.patientName;
    document.getElementById('location').value = app.location;
    document.getElementById('disorder').value = app.disorder || '';
    // Per il pdf non gestiamo la pre-compilazione (file input non supporta setting value)
    document.getElementById('modalTitle').textContent = "Modifica Appuntamento";
  } else {
    document.getElementById('appTime').value = '';
    document.getElementById('patientName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('disorder').value = '';
    document.getElementById('modalTitle').textContent = "Nuovo Appuntamento";
  }
}

// Funzione di salvataggio dell'appuntamento
function saveAppointment(event) {
  event.preventDefault();
  const dateStr = document.getElementById('appDate').value;
  const appTime = document.getElementById('appTime').value;
  const patientName = document.getElementById('patientName').value;
  const location = document.getElementById('location').value;
  const disorder = document.getElementById('disorder').value;
  // Per il pdf, in questo esempio, lo gestiamo solo con il nome del file (senza upload effettivo)
  const pdfInput = document.getElementById('pdfFile');
  const pdfFile = pdfInput.files.length > 0 ? pdfInput.files[0].name : '';

  // Inserisce/aggiorna l'appuntamento
  appointments[dateStr] = {
    appTime,
    patientName,
    location,
    disorder,
    pdfFile
  };

  closeModal();
  renderCalendar();
}

// Funzione per cancellare un appuntamento
function deleteAppointment() {
  const dateStr = document.getElementById('appDate').value;
  if (appointments[dateStr]) {
    if (confirm("Sei sicuro di voler cancellare l'appuntamento?")) {
      delete appointments[dateStr];
    }
  }
  closeModal();
  renderCalendar();
}

// Chiude il modal
function closeModal() {
  const modal = document.getElementById('appointmentModal');
  modal.style.display = 'none';
  document.getElementById('appointmentForm').reset();
}

// Navigazione avanti/indietro
function previous() {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() - 1);
  } else {
    currentDate.setDate(currentDate.getDate() - 7);
  }
  renderCalendar();
}

function next() {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() + 1);
  } else {
    currentDate.setDate(currentDate.getDate() + 7);
  }
  renderCalendar();
}

// Cambia vista
function setView(view) {
  currentView = view;
  renderCalendar();
}

// Event listeners
document.getElementById('monthViewBtn').addEventListener('click', () => setView('month'));
document.getElementById('weekViewBtn').addEventListener('click', () => setView('week'));
document.getElementById('prevBtn').addEventListener('click', previous);
document.getElementById('nextBtn').addEventListener('click', next);

document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  const modal = document.getElementById('appointmentModal');
  if (event.target === modal) {
    closeModal();
  }
});

document.getElementById('appointmentForm').addEventListener('submit', saveAppointment);
document.getElementById('deleteBtn').addEventListener('click', deleteAppointment);

// Rendering iniziale
renderCalendar();
