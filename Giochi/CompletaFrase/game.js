const sentences = [
    { sentence: "IL ___ SALTELLA NEL BOSCO", correct: "CONIGLIO", options: ["CONILIO", "CONIGLO", "CONIGLIO"] },
    { sentence: "IL ___ HA IL COLLO LUNGO", correct: "GIRAFFA", options: ["GIRAFA", "GIRAFFA", "GIRAFFO"] },
    { sentence: "IL ___ FA LE UOVA", correct: "GALLINA", options: ["GALLINA", "GALLINO", "GALLENA"] },
    // Aggiungi altre 37 frasi qui
];

let score = 0;
let usedSentences = [];
let currentSentence = {};

function startGame() {
    score = 0;
    usedSentences = [];
    document.getElementById('score').innerText = `PUNTEGGIO: ${score}`;
    showNextSentence();
}

function showNextSentence() {
    if (usedSentences.length < 10) {
        let availableSentences = sentences.filter(s => !usedSentences.includes(s));
        currentSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
        usedSentences.push(currentSentence);
        
        document.getElementById('sentence').innerText = currentSentence.sentence;
        let optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';
        currentSentence.options.forEach(option => {
            let optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerText = option;
            optionDiv.onclick = () => checkAnswer(option);
            optionsDiv.appendChild(optionDiv);
        });
    } else {
        document.getElementById('sentence').innerText = 'GIOCO TERMINATO';
    }
}

function checkAnswer(selectedOption) {
    if (selectedOption === currentSentence.correct) {
        score++;
    }
    document.getElementById('score').innerText = `PUNTEGGIO: ${score}`;
    showNextSentence();
}

function exitGame() {
    alert("Grazie per aver giocato!");
}

startGame();
