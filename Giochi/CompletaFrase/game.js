const sentences = [
    { sentence: "IL ___ SALTELLA NEL BOSCO", correct: "CONIGLIO", options: ["CONILIO", "CONIGLO", "CONIGLIO"] },
    { sentence: "LA ___ HA IL COLLO LUNGO", correct: "GIRAFFA", options: ["GIRAFA", "GIRAFFA", "GIRAFFO"] },
    { sentence: "LA ___ FA LE UOVA", correct: "GALLINA", options: ["GALLINA", "GALLINO", "CALLINA"] },
    { sentence: "IL ___ CORRE VELOCE NELLA SAVANA", correct: "GHEPARDO", options: ["GEPARDo", "GHEPARDO", "GHEPARDI"] },
    { sentence: "LA ___ PRODUCE IL LATTE", correct: "MUCCA", options: ["MUCA", "MUCCA", "MUCCHE"] },
    { sentence: "IL ___ HA UN BECCO LUNGO", correct: "TUCANO", options: ["TUCANA", "TUCANO", "TUCHANO"] },
    { sentence: "IL ___ SI ROTOLA NEL FANGO", correct: "MAIALE", options: ["MAIALE", "MAIALO", "MAIALI"] },
    { sentence: "IL ___ COSTRUISCE UNA RAGNATELA", correct: "RAGNO", options: ["RAGNA", "RAGNO", "RAGNIO"] },
    { sentence: "IL ___ HA LA GOBBA", correct: "CAMMELLO", options: ["CAMMELO", "CAMMELLO", "CAMELLO"] },
    { sentence: "LA ___ SCAVA GALLERIE SOTTOTERRA", correct: "TALPA", options: ["TALBA", "TALPA", "TALPO"] },
    { sentence: "IL ___ È IL RE DELLA FORESTA", correct: "LEONE", options: ["LEONO", "LEONE", "LEONI"] },
    { sentence: "IL ___ HA PINNE PER NUOTARE", correct: "PESCE", options: ["PESCE", "PESCI", "PESCHE"] },
    { sentence: "LA ___ HA GRANDI ORECCHIE", correct: "LEPRE", options: ["LEPRO", "LEPRE", "LEPRI"] },
    { sentence: "LA ___ HA UNA CODA LUNGA", correct: "SCIMMIA", options: ["SCIMIA", "SCIMMIA", "SIMMIA"] },
    { sentence: "LE ___ FANNO IL MIELE", correct: "API", options: ["APE", "API", "APA"] },
    { sentence: "L' ___ HA UNA PELLE RUVIDA", correct: "ELEFANTE", options: ["ELEFANTA", "ELEFANTE", "ELEFANTI"] },
    { sentence: "IL ___ HA UN CORNO SULLA TESTA", correct: "RINOCERONTE", options: ["RINOCERONTE", "RINOCIERONTE", "RINOCERANTE"] },
    { sentence: "LA ___ È UN UCCELLO NOTTURNO", correct: "CIVETTA", options: ["CIVETA", "CIVETTA", "CIVVETA"] },
    { sentence: "IL ___ VOLA IN STORMO", correct: "PASSERO", options: ["PASSERO", "PASERO", "PASSERI"] },
    { sentence: "LA ___ È ROSSA CON PUNTINI NERI", correct: "COCCINELLA", options: ["COCCINELA", "COCCINELLA", "COCCINELLO"] },
    { sentence: "LA ___ HA LA PELLE VERDE E VISCIDA", correct: "RANA", options: ["RANA", "RANO", "RANI"] },
    { sentence: "IL ___ GRUGNISCE NEL BOSCO", correct: "CINGHIALE", options: ["CINGHIALE", "CINGHIALO", "CINGIALE"] },
    { sentence: "IL ___ NUOTA NEL MARE", correct: "DELFINO", options: ["DEFFINO", "DELFINO", "DELFINI"] },
    { sentence: "LA ___ HA UN GUSCIO DURO", correct: "TARTARUGA", options: ["TARTARUGA", "TARTARUCA", "TATTARUGA"] },
    { sentence: "LA ___ VOLA DI FIORE IN FIORE", correct: "FARFALLA", options: ["FARFALLA", "FARFALLE", "FARFALLO"] },
    { sentence: "LA ___ È UN FELINO VELOCE", correct: "PANTERA", options: ["PANTERA", "PATERA", "PANTERI"] },
    { sentence: "IL ___ È UN UCCELLO COLORATO", correct: "PAPPAGALLO", options: ["PAPPAGALO", "PAPPAGALLO", "PAPAGALLO"] },
    { sentence: "IL ___ È UN INSETTO CHE SALTA", correct: "GRILLO", options: ["GRILLO", "GRILLA", "GILLO"] },
    { sentence: "IL ___ È MOLTO INTELLIGENTE", correct: "CORVO", options: ["CORVO", "CORVI", "CORVA"] },
    { sentence: "IL ___ È UN ANIMALE LENTISSIMO", correct: "BRADIPO", options: ["BRADIPO", "BRADIPA", "BRADIPI"] },
    { sentence: "IL ___ HA UNA LUNGA LINGUA", correct: "FORMICHIERE", options: ["FORMICHIERA", "FORMICIERE", "FORMICHIERE"] },
    { sentence: "L' ___ HA GRANDI CORNA", correct: "ALCE", options: ["ALCE", "ALCI", "ALCO"] },
    { sentence: "L' ___ VOLA IN CIELO", correct: "AQUILA", options: ["AQUILA", "ACUILA", "AQUILI"] },
    { sentence: "IL ___ HA LE BRACCIA FORTI", correct: "GORILLA", options: ["GORILLA", "GORILO", "GORILLE"] },
    { sentence: "LA ___ È UN PICCOLO MAMMIFERO NOTTURNO", correct: "DONNOLA", options: ["DONNOLA", "DONOLA", "TONNOLA"] },
    { sentence: "IL ___ CACCIA NELLA NOTTE", correct: "LUPO", options: ["LUPO", "LUPA", "LUPI"] },
    { sentence: "IL ___ SCAVA IN TERRA", correct: "RATTO", options: ["RATTO", "RATTI", "RATO"] }
]
let score = 0;
let usedSentences = [];
let currentSentence = {};
let firstAttempt = true;

function startGame() {
    score = 0;
    usedSentences = [];
    document.body.style.backgroundColor = "#ffcc70"; // Reset dello sfondo
    document.getElementById('score').innerText = `PUNTEGGIO: ${score}`;
    showNextSentence();
}

function showNextSentence() {
    if (usedSentences.length < 10) {
        let availableSentences = sentences.filter(s => !usedSentences.includes(s.sentence));

        if (availableSentences.length > 0) {
            currentSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
            usedSentences.push(currentSentence.sentence);
            firstAttempt = true;

            let sentenceElement = document.getElementById('sentence');
            sentenceElement.innerText = currentSentence.sentence;
            sentenceElement.className = ""; // Reset animazione e colore

            let optionsDiv = document.getElementById('options');
            optionsDiv.innerHTML = '';

            currentSentence.options.forEach(option => {
                let optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerText = option;
                optionDiv.onclick = () => checkAnswer(option, optionDiv);
                optionsDiv.appendChild(optionDiv);
            });
        }
    } else {
        document.getElementById('sentence').innerText = '🎉 GIOCO TERMINATO! 🎉';
        document.getElementById('options').innerHTML = '';
    }
}

function checkAnswer(selectedOption, optionElement) {
    let sentenceElement = document.getElementById('sentence');

    if (selectedOption === currentSentence.correct) {
        if (firstAttempt) {
            score++;
        }

        document.body.style.backgroundColor = "#a8e6a2"; // Verde per risposta corretta
        sentenceElement.classList.add("correct");
        optionElement.classList.add("correct");

        document.getElementById('score').innerText = `PUNTEGGIO: ${score}`;

        setTimeout(() => {
            showNextSentence();
            document.body.style.backgroundColor = "#ffcc70"; // Reset colore
        }, 1000);
    } else {
        firstAttempt = false;
        document.body.style.backgroundColor = "#f8a7a7"; // Rosso per risposta sbagliata
        sentenceElement.classList.add("wrong");
        optionElement.classList.add("wrong");
    }
}

function exitGame() {
    alert("Grazie per aver giocato! Torna presto! 😊");
}

startGame();