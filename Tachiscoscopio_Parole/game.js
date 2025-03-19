// Elementi DOM
const listaTipo = document.getElementById('listaTipo');
const nuovaListaInput = document.getElementById('nuovaListaInput');
const listaPredefinitaSettings = document.getElementById('listaPredefinitaSettings');
const contenutoLista = document.getElementById('contenutoLista');
const numParole = document.getElementById('numParole');
const startButton = document.getElementById('startGame');
const exitButton = document.getElementById('exitGame');
const settingsScreen = document.getElementById('settingsScreen');
const gameScreen = document.getElementById('gameScreen');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const anteprimaListaDiv = document.getElementById('anteprimaLista');
const tempoVisibileInput = document.getElementById('tempoVisibile');
const intertempoInput = document.getElementById('intertempo');

// Creazione della textarea per l'anteprima
const listaAnteprima = document.createElement('textarea');
listaAnteprima.id = "textareaAnteprima";
listaAnteprima.rows = 10;
listaAnteprima.cols = 50;
listaAnteprima.style.resize = 'none'; // Impedisci il ridimensionamento
listaAnteprima.style.display = 'none'; // Nascondi inizialmente
anteprimaListaDiv.appendChild(listaAnteprima); // Aggiungi la textarea al DOM

// Dimensioni canvas
gameCanvas.width = 800;
gameCanvas.height = 600;

// Dati delle liste preimpostate
const paroleDueSillabe = ["Cane", "Pane", "Papà", "Mano", "Gatto", "Mela", "Sole", "Zampa", "Donna", "Casa", "Torre"];
const paroleTreSillabe = ["Carota", "Banana", "Matita", "Bambino", "Pantera", "Campana", "Cucina"];
const paroleQuattroSillabe = ["Ristorante", "Campanello", "Tamburino", "Bicicletta", "Canarino", "Elefante", "Cavaliere"];
const sillabe = ["Ca", "Co", "Cu", "Chi", "Che", "Ci", "Ce", "La", "Lo", "Lu", "Li", "Le"];
const coppieMinime = [
  ["Cane", "Casa"], ["Palla", "Pala"], ["Gatto", "Tetto"], ["Porto", "Morto"]
];

// Funzione per aggiornare l'anteprima della lista
function aggiornaAnteprima() {
  const contenuto = contenutoLista.value;
  const numDaEstrarre = parseInt(numParole.value, 10);
  let paroleFiltrate = [];

  if (contenuto === 'parole2') {
    paroleFiltrate = paroleDueSillabe.sort(() => 0.5 - Math.random()).slice(0, numDaEstrarre);
  } else if (contenuto === 'parole3') {
    paroleFiltrate = paroleTreSillabe.sort(() => 0.5 - Math.random()).slice(0, numDaEstrarre);
  } else if (contenuto === 'parole4') {
    paroleFiltrate = paroleQuattroSillabe.sort(() => 0.5 - Math.random()).slice(0, numDaEstrarre);
  } else if (contenuto === 'sillabe') {
    paroleFiltrate = sillabe.sort(() => 0.5 - Math.random()).slice(0, numDaEstrarre);
  } else if (contenuto === 'coppieMinime') {
    const coppieRandomizzate = coppieMinime.sort(() => 0.5 - Math.random()).slice(0, numDaEstrarre);
    paroleFiltrate = coppieRandomizzate.flat(); // Appiattisci le coppie in una lista singola
  }

  // Mostra l'anteprima nella text area
  listaAnteprima.style.display = 'block';
  listaAnteprima.value = paroleFiltrate.join(', '); // Rendi modificabili le parole nella text area
}

// Gestione delle opzioni di tipo lista
listaTipo.addEventListener('change', () => {
  if (listaTipo.value === 'custom') {
    nuovaListaInput.style.display = 'block';
    listaPredefinitaSettings.style.display = 'none';
    listaAnteprima.style.display = 'none'; // Nascondi l'anteprima per "Nuova Lista"
  } else {
    nuovaListaInput.style.display = 'none';
    listaPredefinitaSettings.style.display = 'block';
    aggiornaAnteprima(); // Aggiorna l'anteprima quando si passa a "Lista Preesistente"
  }
});

// Aggiorna l'anteprima quando si cambiano le impostazioni
contenutoLista.addEventListener('change', aggiornaAnteprima);
numParole.addEventListener('change', aggiornaAnteprima);

// Avvio del gioco
startButton.addEventListener('click', () => {
  settingsScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  // Leggi le parole dalla text area (anche quelle modificate dall'utente)
  const paroleGioco = listaAnteprima.value.split(',').map(p => p.trim());
  startGame(paroleGioco);
});

// Uscita dal gioco
exitButton.addEventListener('click', () => {
  settingsScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulizia del canvas
});

// Funzione di gioco
function startGame(parole) {
  const tempoVisibile = parseInt(tempoVisibileInput.value, 10); // Tempo di visualizzazione personalizzato
  const intertempo = parseInt(intertempoInput.value, 10); // Intertempo personalizzato
  let index = 0;

  // Mostra il countdown sul canvas
  let countdown = 3;
  const countdownInterval = setInterval(() => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulisci il canvas
    ctx.font = '48px Arial'; // Imposta il font
    ctx.textAlign = 'center'; // Allinea il testo al centro
    ctx.textBaseline = 'middle'; // Allinea verticalmente al centro
    ctx.fillText(countdown, gameCanvas.width / 2, gameCanvas.height / 2); // Disegna il numero del countdown
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval); // Ferma il countdown
      startGameLoop(parole, tempoVisibile, intertempo); // Avvia il gioco
    }
  },1000);
}

// Funzione per avviare il ciclo del gioco
function startGameLoop(parole, tempoVisibile, intertempo) {
  let index = 0;

  const interval = setInterval(() => {
    if (index >= parole.length) {
      clearInterval(interval); // Ferma il ciclo quando tutte le parole sono state mostrate
      return;
    }

    // Disegna la parola corrente sul canvas
    const parola = parole[index++];
    renderWord(parola);

    // Cancella la parola dopo il tempo di visualizzazione
    setTimeout(() => {
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }, tempoVisibile);

  }, tempoVisibile + intertempo); // Tempo complessivo = tempoVisibile + intertempo
}

// Funzione per disegnare una parola sul canvas
function renderWord(parola) {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulisci il canvas
  ctx.font = '48px Arial'; // Imposta il font
  ctx.textAlign = 'center'; // Allinea il testo al centro
  ctx.textBaseline = 'middle'; // Allinea verticalmente al centro
  ctx.fillText(parola, gameCanvas.width / 2, gameCanvas.height / 2); // Disegna la parola
}


// Gestione delle opzioni di tipo lista
listaTipo.addEventListener('change', () => {
  if (listaTipo.value === 'custom') {
    nuovaListaInput.style.display = 'block';
    listaPredefinitaSettings.style.display = 'none';
    document.getElementById('anteprimaLista').style.display = 'none'; // Nascondi l'anteprima
  } else if (listaTipo.value === 'predefinite') {
    nuovaListaInput.style.display = 'none';
    listaPredefinitaSettings.style.display = 'block';
    document.getElementById('anteprimaLista').style.display = 'block'; // Mostra l'anteprima
    aggiornaAnteprima(); // Popola l'anteprima con le parole
  }
});

