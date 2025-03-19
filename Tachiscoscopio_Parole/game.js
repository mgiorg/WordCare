// Elementi DOM
const posizioneParolaSelect = document.getElementById('posizioneParola');
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
const modalitaGioco = document.getElementById('modalitaGioco');
const feedbackButtons = document.getElementById('feedbackButtons');
const correttoButton = document.getElementById('corretto');
const sbagliatoButton = document.getElementById('sbagliato');
let punteggio = 0; // Variabile per il punteggio
const dimensioneParolaInput = document.getElementById('dimensioneParola');

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
  const tempoVisibile = parseInt(tempoVisibileInput.value, 10);
  const intertempo = parseInt(intertempoInput.value, 10);
  let index = 0;

  // Mostra il countdown prima di iniziare
  let countdown = 3;
  const countdownInterval = setInterval(() => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(countdown, gameCanvas.width / 2, gameCanvas.height / 2);
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

      // Modalità di gioco
      if (modalitaGioco.value === "automatico") {
        feedbackButtons.style.display = 'none'; // Nasconde i bottoni per "Automatico"

        // Ciclo automatico delle parole
        const interval = setInterval(() => {
          if (index >= parole.length) {
            clearInterval(interval);
            return;
          }
          const parola = parole[index++];
          renderWord(parola);
          setTimeout(() => ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height), tempoVisibile);
        }, tempoVisibile + intertempo);

      } else if (modalitaGioco.value === "feedback") {
        feedbackButtons.style.display = 'block'; // Mostra i bottoni per "Feedback"

        // Mostra la prima parola
        let parolaCorrente = parole[index];
        renderWord(parolaCorrente);

        // Gestione del feedback
        correttoButton.onclick = () => {
          punteggio++; // Aumenta il punteggio
          nextWord(); // Passa alla parola successiva
        };

        sbagliatoButton.onclick = () => {
          nextWord(); // Passa alla parola successiva senza cambiare il punteggio
        };

        function nextWord() {
          index++;
          if (index < parole.length) {
            parolaCorrente = parole[index];
            renderWord(parolaCorrente);
          } else {
            // Fine del gioco
            feedbackButtons.style.display = 'none'; // Nascondi i bottoni
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            alert(`Gioco finito! Punteggio finale: ${punteggio}`);
          }
        }
      }
    }
  }, 1000); // Countdown intervallo di 1 secondo
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

// Funzione per ottenere le coordinate della posizione scelta
function getWordPosition(option) {
  let x, y;

  switch (option) {
    case 'centro':
      x = gameCanvas.width / 2;
      y = gameCanvas.height / 2;
      break;
    case 'sinistra':
      x = gameCanvas.width * 0.25;
      y = gameCanvas.height / 2;
      break;
    case 'destra':
      x = gameCanvas.width * 0.75;
      y = gameCanvas.height / 2;
      break;
    case 'alto':
      x = gameCanvas.width / 2;
      y = gameCanvas.height * 0.25;
      break;
    case 'basso':
      x = gameCanvas.width / 2;
      y = gameCanvas.height * 0.75;
      break;
    case 'random':
      x = Math.random() * gameCanvas.width;
      y = Math.random() * gameCanvas.height;
      break;
    default:
      x = gameCanvas.width / 2;
      y = gameCanvas.height / 2;
  }

  return { x, y };
}

// Funzione per disegnare una parola sul canvas
function renderWord(parola) {
  const posizione = getWordPosition(posizioneParolaSelect.value); // Ottieni la posizione scelta
  const dimensioneParola = parseInt(dimensioneParolaInput.value, 10); // Leggi la dimensione della parola
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulisci il canvas
  ctx.font = `${dimensioneParola}px Arial`; // Imposta la dimensione del font
  ctx.textAlign = 'center'; // Allinea il testo al centro
  ctx.textBaseline = 'middle'; // Allinea verticalmente al centro
  ctx.fillText(parola, posizione.x, posizione.y); // Disegna la parola
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

