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
const coloreParolaInput = document.getElementById('coloreParola');
const coloreSfondoInput = document.getElementById('coloreSfondo');

// Creazione della textarea per l'anteprima
const listaAnteprima = document.createElement('textarea');
listaAnteprima.id = "textareaAnteprima";
listaAnteprima.rows = 10;
listaAnteprima.cols = 50;
listaAnteprima.style.resize = 'none'; // Impedisci il ridimensionamento
listaAnteprima.style.display = 'none'; // Nascondi inizialmente
anteprimaListaDiv.appendChild(listaAnteprima); // Aggiungi la textarea al DOM

// Dimensioni canvas
gameCanvas.width = 1000;
gameCanvas.height = 700;

// Dati delle liste preimpostate
const paroleDueSillabe = ["Casa", "Mela", "Luna", "Dente", "Palla", "Bello", "Forte", "Piuma", "Muro", "Vento", "Menta", "Suono", "Ponte", "Fiume", "Strada", "Pioggia", "Fumo", "Pasta", "Carta", "Raggio", "Bosco", "Dorso", "Fondo", "Brilla", "Bacio", "Ladro", "Pranzo", "Campo", "Tenda", "Mondo", "Fame", "Tigre", "Fiore", "Danza", "Tosca", "Bimbo", "Chiesa", "Testa", "Ombra", "Tazza", "Punto", "Cielo", "Scuola", "Zampa", "Miele", "Corte", "Sponda", "Pugno", "Festa", "Tasto"];
const paroleTreSillabe = ["Albero", "Strumento", "Fragola", "Mimosa", "Gazzella", "Farfalla", "Bambino", "Sentiero", "Tappeto", "Lampada", "Montagna", "Finestra", "Cammino", "Gelato", "Cuscino", "Zucchero", "Trombone", "Colomba", "Risotto", "Pistola", "Campana", "Matita", "Magnete", "Segnale", "Portone", "Bottone", "Volante", "Cancello", "Famoso", "Ragione", "Vigneto", "Rialzo", "Assurdo", "Divano", "Dipinto", "Realtà", "Cornice", "Riposo", "Fenice", "Miraggio", "Cultura", "Scultura", "Dirupo", "Segreto", "Dolore", "Felice"];
const paroleQuattroSillabe = ["Abbracciare", "Primavera", "Calendario", "Semplicione", "Candelabro", "Crocifisso", "Programmare", "Anticipa", "Corrisponde", "Educato", "Orientale", "Illumina", "Manifesta", "Personale", "Rappresenta", "Luminoso", "Generoso", "Realizzare", "Pericolo", "Pasticcere", "Concludere", "Rallentare", "Espressione", "Indossare", "Ricordare", "Discutere", "Formazione", "Comportare", "Dimostrare", "Allargare", "Compilare", "Misterioso", "Ponderare", "Bilanciare", "Sostenere", "Capitano", "Appendice", "Apparente", "Scorpione", "Navigante"];
const sillabe = ["Ca", "Ne", "Pa", "Ne", "Go", "La", "Ra", "Na", "To", "Po", "Ta", "Vo", "Lo", "Ma", "Re", "Fi", "Me", "Mon", "Te", "Sal", "To", "Car", "Ta", "Fo", "Gli", "Sor", "So", "Ne", "Ve", "Ta", "La", "Ro", "Fre", "Fri", "Me", "Te", "Bri", "Do", "Zuc", "Che", "Ro", "Gra", "De", "Cam", "Po", "Ra", "Mi", "Fi", "Ri", "Ar", "Co", "No", "To", "Bre", "Ze", "Vol", "To", "Gi", "Quo", "Re", "Cen", "Tro", "Fro"];
const nonParole = ["Tabe", "Pome", "Luto", "Buto", "Sane", "Dane", "Mefa", "Tefa", "Giso", "Viso",
    "Rupa", "Zupa", "Dimo", "Nimo", "Feto", "Leto", "Pobu", "Tobu", "Sila", "Mila", "Tabero", "Pomilo", "Lutero", "Butano", "Sanepo", "Danefu", "Mefaro", "Tefima", "Gisolo", "Visane",
    "Rupado", "Zupano", "Dimera", "Nimato", "Fetimo", "Letovo", "Pobera", "Tobisi", "Silovo", "Milote"]
const coppieMinime = [
    ["Fata", "Vata"], ["Casa", "Cassa"], ["Lama", "Rama"],
    ["Mare", "Pare"], ["Torre", "Corre"], ["Vela", "Zela"], ["Dente", "Lente"], ["Bello", "Pello"],
    ["Duro", "Puro"], ["Fumo", "Lumo"], ["Giro", "Viro"], ["Corte", "Porte"], ["Tasto", "Rasto"],
    ["Zampa", "Tampa"], ["Diva", "Viva"], ["Punto", "Munto"], ["Pesto", "Vesto"]
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
        paroleFiltrate = coppieRandomizzate.flat();
    } else if (contenuto === 'nonParole') {
        paroleFiltrate = nonParole.sort(() => 0.5 - Math.random()).slice(0, numDaEstrarre); // Logica per "Non parole"
    }

    // Mostra l'anteprima nella text area
    listaAnteprima.style.display = 'block';
    listaAnteprima.value = paroleFiltrate.join(', ');
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

    let paroleGioco = [];

    if (listaTipo.value === 'custom') {
        // Se l'utente ha scelto "Nuova Lista", prendi le parole dalla textarea
        let inputText = document.getElementById('inputParole').value.trim();
        if (inputText) {
            paroleGioco = inputText.split(',').map(p => p.trim());
        }
    } else {
        // Se ha scelto una lista predefinita, usa le parole dall'anteprima
        paroleGioco = listaAnteprima.value.split(',').map(p => p.trim());
    }

    // Mescola le parole per farle apparire in un ordine sempre diverso
    paroleGioco = shuffleArray(paroleGioco);

    startGame(paroleGioco);
});



// Uscita dal gioco
exitButton.addEventListener('click', () => {
    settingsScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulizia del canvas
});

function aggiornaSfondoCanvas() {
    ctx.fillStyle = coloreSfondoInput.value; // Imposta il colore di sfondo
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Riempi il canvas con il colore
}

function startGame(parole) {
    // Funzione per impostare il canvas a schermo intero
    function setCanvasFullScreen() {
        gameCanvas.width = window.innerWidth - 25;
        gameCanvas.height = window.innerHeight - 25;
    }

    // Imposta il canvas a schermo intero all'avvio
    setCanvasFullScreen();

    // Aggiorna le dimensioni del canvas quando la finestra viene ridimensionata
    window.addEventListener('resize', setCanvasFullScreen);

    // Nascondi la schermata delle impostazioni e mostra quella di gioco
    settingsScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    // Posiziona i pulsanti sopra il canvas
    feedbackButtons.style.position = 'absolute';
    feedbackButtons.style.top = '70%';
    feedbackButtons.style.left = '50%';
    feedbackButtons.style.transform = 'translateX(-50%)';
    feedbackButtons.style.display = modalitaGioco.value === "feedback" ? 'flex' : 'none';

    exitButton.style.position = 'absolute';
    exitButton.style.top = '5%';
    exitButton.style.right = '5%';

    const tempoVisibile = parseInt(tempoVisibileInput.value, 10);
    const intertempo = parseInt(intertempoInput.value, 10);
    let index = 0;

    // Funzione di supporto per verificare la sovrapposizione
    function isOverlapping(x, y, width, height, area) {
        return (
            x < area.x + area.width &&
            x + width > area.x &&
            y < area.y + area.height &&
            y + height > area.y
        );
    }

    // Funzione per ottenere una posizione valida per le parole
    function getValidWordPosition(parola) {
        const dimensioneParola = parseInt(dimensioneParolaInput.value, 10);
        const parolaLarghezza = ctx.measureText(parola).width;
        const parolaAltezza = dimensioneParola;

        let posizione;

        do {
            posizione = getWordPosition(posizioneParolaSelect.value);

            // Definisce l'area del pulsante "Esci"
            const areaPulsanteEsci = {
                x: window.innerWidth - exitButton.offsetWidth - 25,
                y: 5,
                width: exitButton.offsetWidth,
                height: exitButton.offsetHeight,
            };

            // Controlla i limiti del canvas per non far sforare la parola
            let x = Math.max(parolaLarghezza / 2, Math.min(posizione.x, gameCanvas.width - parolaLarghezza / 2));
            let y = Math.max(parolaAltezza / 2, Math.min(posizione.y, gameCanvas.height - parolaAltezza / 2));

            // Se la parola non si sovrappone al pulsante "Esci", esce dal loop
            if (!isOverlapping(x - parolaLarghezza / 2, y - parolaAltezza / 2, parolaLarghezza, parolaAltezza, areaPulsanteEsci)) {
                posizione.x = x;
                posizione.y = y;
                break;
            }

        } while (true);

        return posizione;
    }


    // Countdown iniziale prima dell'avvio
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        ctx.fillStyle = coloreSfondoInput.value;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = coloreParolaInput.value;
        ctx.fillText(countdown, gameCanvas.width / 2, gameCanvas.height / 2);
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);

            ctx.fillStyle = coloreSfondoInput.value;
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            // Modalità di gioco
            if (modalitaGioco.value === "automatico") {
                feedbackButtons.style.display = 'none';

                const interval = setInterval(() => {
                    if (index >= parole.length) {
                        clearInterval(interval); // Fine del gioco
                        fineGioco();
                        return;
                    }

                    const parola = parole[index++];

                    // Mostra la parola in una posizione valida
                    const posizione = getValidWordPosition(parola);
                    renderWord(parola, posizione);

                    setTimeout(() => {
                        // Cancella la parola e mostra "####"
                        ctx.fillStyle = coloreSfondoInput.value;
                        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

                        ctx.font = '48px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = coloreParolaInput.value;
                        ctx.fillText("####", gameCanvas.width / 2, gameCanvas.height / 2);

                        setTimeout(() => {
                            ctx.fillStyle = coloreSfondoInput.value;
                            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
                        }, 200);
                    }, tempoVisibile);
                }, tempoVisibile + intertempo);

            } else if (modalitaGioco.value === "feedback") {
                let index = 0;

                feedbackButtons.style.display = 'none';

                function mostraProssimaParola() {
                    if (index >= parole.length) {
                        feedbackButtons.style.display = 'none';
                        fineGioco();
                        return;
                    }

                    let parolaCorrente = parole[index];
                    let posizione = getValidWordPosition(parolaCorrente);

                    // Mostra la parola
                    renderWord(parolaCorrente, posizione);

                    // Dopo il tempo stabilito, la parola scompare
                    setTimeout(() => {
                        ctx.fillStyle = coloreSfondoInput.value;
                        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

                        // Mostra il messaggio "Che parola hai letto?"
                        ctx.font = "32px Arial";
                        ctx.fillStyle = "#000";
                        ctx.textAlign = "center";
                        ctx.fillText("Che parola hai letto?", gameCanvas.width / 2, gameCanvas.height / 2);

                        // Dopo un piccolo ritardo, mostra i pulsanti di feedback
                        setTimeout(() => {
                            feedbackButtons.style.display = 'flex';
                        }, 300); // Ritardo prima di mostrare i pulsanti
                    }, tempoVisibile);
                }

                correttoButton.onclick = () => {
                    punteggio++;
                    feedbackButtons.style.display = 'none';
                    index++;
                    mostraProssimaParola();
                };

                sbagliatoButton.onclick = () => {
                    feedbackButtons.style.display = 'none';
                    index++;
                    mostraProssimaParola();
                };

                // Avvia il primo ciclo
                mostraProssimaParola();
            }


        }
    }, 1000); // Countdown intervallo di 1 secondo
}



// Funzione per gestire la fine del gioco
function fineGioco() {
    // Mostra la frase "Hai vinto!"
    ctx.fillStyle = coloreSfondoInput.value; // Colore dello sfondo
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulisce il canvas
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = coloreParolaInput.value; // Colore della frase
    ctx.fillText("Gioco completato!", gameCanvas.width / 2, gameCanvas.height / 2);

    // Torna alla schermata delle impostazioni dopo 3 secondi
    setTimeout(() => {
        gameScreen.style.display = 'none';
        settingsScreen.style.display = 'block'; // Mostra la schermata iniziale
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Pulisce il canvas
    }, 3000);
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

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
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

function renderWord(parola) {
    // Leggi la posizione, dimensione della parola e se le parole devono essere maiuscole
    const posizione = getWordPosition(posizioneParolaSelect.value);
    const dimensioneParola = parseInt(dimensioneParolaInput.value, 10);
    const maiuscolo = document.getElementById('maiuscoloParole').checked;

    // Trasforma la parola in maiuscolo, se la checkbox è selezionata
    if (maiuscolo) {
        parola = parola.toUpperCase();
    }

    aggiornaSfondoCanvas(); // Applica lo sfondo del canvas

    ctx.font = `${dimensioneParola}px Arial`; // Imposta il font e la dimensione
    ctx.textAlign = 'center'; // Allinea il testo orizzontalmente al centro
    ctx.textBaseline = 'middle'; // Allinea il testo verticalmente al centro
    ctx.fillStyle = coloreParolaInput.value; // Imposta il colore della parola

    // Misura la larghezza della parola in pixel
    const parolaLarghezza = ctx.measureText(parola).width;

    // Imposta i limiti per non far uscire la parola dai bordi del canvas
    let x = posizione.x;
    let y = posizione.y;

    if (x - parolaLarghezza / 2 < 0) {
        x = parolaLarghezza / 2; // Limite sinistro
    } else if (x + parolaLarghezza / 2 > gameCanvas.width) {
        x = gameCanvas.width - parolaLarghezza / 2; // Limite destro
    }

    if (y - dimensioneParola / 2 < 0) {
        y = dimensioneParola / 2; // Limite superiore
    } else if (y + dimensioneParola / 2 > gameCanvas.height) {
        y = gameCanvas.height - dimensioneParola / 2; // Limite inferiore
    }

    // Disegna la parola nelle coordinate corrette
    ctx.fillText(parola, x, y);
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

