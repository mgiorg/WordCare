
// Array con i dati dei 6 minigiochi
const giochi = [
    {
        id: 1,
        titolo: "Collega le immaigini",
        descrizione: "Prendi e trascina le immagini con i suoni duri e suoni dolci nelle apposite aree",
        difficolta: 1,
        tags: ["Discriminazione"],
        richiedeAssistenza:false,
        percorso: "../../../Giochi/CollegaImmagineCH_C/game.html"
    },
    {
        id: 2,
        titolo: "Completa la frase",
        descrizione: "Completa con l'opzione che ti sembra più corretta.",
        difficolta: 1,
        tags: ["Morfosintassi"],
        richiedeAssistenza:false,
        percorso: "../../../Giochi/CompletaFrase/game.html"
    },
    {
        id: 3,
        titolo: "Alla ricerca delle sillabe",
        descrizione: "Con che sillaba inizia questa immagine?",
        difficolta: 3,
        tags: ["Metafonologia", "Riconoscimento Sillaba Iniziale"],
        richiedeAssistenza:false,
        percorso: "../../../Giochi/ConCheSillaba/game.html"
    },
    {
        id: 4,
        titolo: "B o P?",
        descrizione: "Pronuncia correttamente le sillabe che trovi nelle immagini",
        difficolta: 2,
        tags: ["Fonetica", "Fonologia", "Sordo/sono"],
        richiedeAssistenza:true,
        percorso: "../../../Giochi/GiocoCarte_BP/game.html"
    },
    {
        id: 5,
        titolo: "Memory",
        descrizione: "Riesci a ricordare la posizione delle carte? Diamo il via alla sfida!",
        difficolta: 3,
        tags: ["Memoria viso-spaziale", "Lessico", "MBT"],
        richiedeAssistenza:false,
        percorso: "../../../Giochi/Memory/game.html"
    },
    {
        id: 6,
        titolo: "Leggi e ripeti",
        descrizione: "Tachistoscopio, setta le impostazioni, e ripeti la parola prima che ne appaia una nuova",
        difficolta: 3,
        tags: ["MBT", "Movimenti Saccadici", "Lettura Globale"],
        richiedeAssistenza:true,
        percorso: "../../../Giochi/CollegaImmagineCH_C/game.html"
    },
];

// Funzione per visualizzare i puntini di difficoltà
function creaPuntiniDifficolta(livello) {
    const difficoltaDiv = document.createElement('div');
    difficoltaDiv.className = 'difficulty';
    
    for (let i = 1; i <= 3; i++) {
        const dot = document.createElement('div');
        dot.className = i <= livello ? 'difficulty-dot active' : 'difficulty-dot inactive';
        difficoltaDiv.appendChild(dot);
    }
    
    return difficoltaDiv;
}

// Funzione per caricare tutti i giochi nella dashboard
function caricaGiochi(giochi) {
    const container = document.getElementById('gamesContainer');
    container.innerHTML = ''; // Pulisce il contenitore
    
    giochi.forEach(gioco => {
        // Crea la card del gioco
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('data-id', gioco.id);
        
        // Aggiunge immagine
        const immagine = document.createElement('div');
        immagine.className = 'game-image';
        immagine.style.backgroundImage = `url('${gioco.immagine}')`;
        card.appendChild(immagine);
        
        // Se richiede assistenza, aggiunge il badge
        if (gioco.richiedeAssistenza) {
            const badge = document.createElement('div');
            badge.className = 'caregiver-badge';
            const icon = document.createElement('i');
            icon.className = 'fas fa-user-friends';
            badge.appendChild(icon);
            card.appendChild(badge);
        }
        
        // Aggiunge le informazioni del gioco
        const info = document.createElement('div');
        info.className = 'game-info';
        
        // Titolo
        const titolo = document.createElement('h3');
        titolo.className = 'game-title';
        titolo.textContent = gioco.titolo;
        info.appendChild(titolo);
        
        // Descrizione
        const descrizione = document.createElement('p');
        descrizione.className = 'game-description';
        descrizione.textContent = gioco.descrizione;
        info.appendChild(descrizione);
        
        // Difficoltà
        info.appendChild(creaPuntiniDifficolta(gioco.difficolta));
        
        // Tags
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'game-tags';
        
        // Aggiunge altri tag
        gioco.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
        
        info.appendChild(tagsDiv);
        card.appendChild(info);
        
        // Aggiunge evento click per aprire il gioco
        card.addEventListener('click', () => {
            window.location.href = gioco.percorso;
        });
        
        container.appendChild(card);
    });
}

// Funzione per filtrare i giochi in base alla ricerca
function filtraGiochi() {
    const searchInput = document.getElementById('searchGames');
    
    searchInput.addEventListener('input', () => {
        const testoDaCercare = searchInput.value.toLowerCase();
        
        const giochiFiltratiPerTesto = giochi.filter(gioco => {
            return (
                gioco.titolo.toLowerCase().includes(testoDaCercare) ||
                gioco.descrizione.toLowerCase().includes(testoDaCercare) ||
                gioco.tags.some(tag => tag.toLowerCase().includes(testoDaCercare))
            );
        });
        
        caricaGiochi(giochiFiltratiPerTesto);
    });
}

// Inizializza la dashboard al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    caricaGiochi(giochi);
    filtraGiochi();
});