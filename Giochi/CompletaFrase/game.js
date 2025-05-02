const sentences = [
    { sentence: "IL ___ SALTELLA NEL BOSCO", correct: "CONIGLIO", options: ["CONILIO", "CONIGLO", "CONIGLIO"] },
    { sentence: "LA ___ HA IL COLLO LUNGO", correct: "GIRAFFA", options: ["GIRAFA", "GIRAFFA", "GIRAFFO"] },
    { sentence: "LA ___ FA LE UOVA", correct: "GALLINA", options: ["GALLINA", "GALLINO", "GALLENA"] },
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
        let availableSentences = sentences.filter(s => !usedSentences.includes(s.sentence));

        if (availableSentences.length > 0) {
            currentSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
            usedSentences.push(currentSentence.sentence); // Salva solo la stringa della frase

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
        }
    } else {
        document.getElementById('sentence').innerText = 'GIOCO TERMINATO';
        document.getElementById('options').innerHTML = '';
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
