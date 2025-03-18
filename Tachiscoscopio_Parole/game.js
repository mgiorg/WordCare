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
const paroleDueSillabe = ["Cane", "Pane", "Papà", "Mano", "Gatto", "Mela", "Sole", "Zampa", "Donna", "Casa", "Torre", "Sasso", "Fiume", "Bosco", "Latte", "Cuore", "Porto", "Moto", "Ferro", "Stella", "Filo", "Vento", "Luna", "Faro", "Porto", "Zaino", "Scala", "Fiore", "Braccio", "Lago", "Viso", "Tetto", "Fondo", "Porta", "Fede", "Ramo", "Campo", "Freddo", "Coppa", "Roccia", "Luce", "Scoglio", "Valle", "Sabbia", "Nave", "Ruota", "Frutto"];
const paroleTreSillabe = ["Carota", "Banana", "Matita", "Bambino", "Pantera", "Campana", "Cucina", "Marino", "Fiumara", "Pesante", "Leggenda", "Taverna", "Montagna", "Finestra", "Partita", "Artista", "Avvento", "Rossetto", "Capanna", "Canzone", "Chitarra", "Pastore", "Castello", "Cavallo", "Tessera", "Vicenda", "Maniche", "Contrada", "Tesoro", "Cammino", "Parente", "Dentista", "Amiche", "Rotonda", "Budino", "Altare", "Speranza", "Bandiera", "Cassetto", "Campione", "Motore", "Pianeta", "Costume", "Antenna", "Broccato", "Giornale", "Bottone"];
const paroleQuattroSillabe = ["Ristorante", "Campanello", "Tamburino", "Bicicletta", "Canarino", "Elefante", "Cavaliere", "Formicaio", "Aquilone", "Trasparente", "Proiettore", "Sassolino", "Candelabro", "Lavatrice", "Croccantino", "Pasticcere", "Ventilato", "Operaio", "Carrozzina", "Cucchiaino", "Giardiniere", "Musicista", "Calciatore", "Pennarello", "Lavorato", "Pianoforte", "Coltivato", "Costruzione", "Lampadina", "Passeggiata", "Cantastorie", "Pescatore", "Violoncello", "Giornalista", "Corridore", "Stagnatore", "Bucaneve", "Macchinina", "Navigare"];
const sillabe = ["Ca", "Co", "Cu", "Chi", "Che", "Ci", "Ce", "La", "Lo", "Lu", "Li", "Le", "Ma", "Mo", "Mu", "Mi", "Me", "Sa", "So", "Su", "Si", "Se", "Ta", "To", "Tu", "Ti", "Te", "Va", "Vo", "Vu", "Vi", "Ve", "Ra", "Ro", "Ru", "Ri", "Re", "Pa", "Po", "Pu", "Pi", "Pe", "Na", "No", "Nu", "Ni", "Ne", "Ga", "Go", "Gu", "Gi", "Ge", "Fa", "Fo", "Fu", "Fi", "Fe", "Da", "Do", "Du", "Di", "De", "Ba", "Bo", "Bu", "Bi", "Be", "Tra", "Tre", "Tro", "Tru", "Tri", "Fra", "Fre", "Fro", "Fru", "Fri", "Spa", "Spo", "Spu", "Spi", "Spe", "Bra", "Bre", "Bro", "Bru", "Bri"];
const coppieMinime = [
  ["Cane", "Casa"], ["Palla", "Pala"], ["Gatto", "Tetto"], ["Porto", "Morto"],
  ["Sasso", "Passo"], ["Fiume", "Lume"], ["Mela", "Mare"], ["Donna", "Gonna"],
  ["Filo", "Pino"], ["Freddo", "Tetto"], ["Scala", "Gala"],
  ["Faro", "Caro"], ["Bosco", "Tosco"], ["Latte", "Tatto"], ["Moto", "Foto"],
  ["Fede", "Rete"], ["Freddo", "Terzo"]
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

  // Mostra l'anteprima in textarea
  if (paroleFiltrate.length > 0) {
    listaAnteprima.style.display = 'block';
    listaAnteprima.value = paroleFiltrate.join(', '); // Mostra parole/coppie separati da virgola
  } else {
    console.warn("Nessuna parola disponibile per l'anteprima.");
    listaAnteprima.style.display = 'none';
  }
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
    let index = 0;
  
    const interval = setInterval(() => {
      if (index >= parole.length) {
        clearInterval(interval); // Ferma il ciclo quando tutte le parole sono state mostrate
        return;
      }
  
      // Disegna la parola corrente sul canvas
      const parola = parole[index++];
      renderWord(parola);
  
      // Cancella la parola dopo un breve periodo
      setTimeout(() => {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      }, 1000);
    }, 1500); // Intervallo tra la visualizzazione delle parole
  }
  
  // Funzione per disegnare una parola sul canvas
  function renderWord(parola) {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulisci il canvas
    ctx.font = '48px Arial'; // Imposta il font
    ctx.textAlign = 'center'; // Allinea il testo al centro
    ctx.textBaseline = 'middle'; // Allinea verticalmente al centro
    ctx.fillText(parola, gameCanvas.width / 2, gameCanvas.height / 2); // Disegna la parola
  }
  