const imageDatabase = [
    { name: "BICICLETTA", image: "images/bicicletta.jpg" },
    { name: "CANE", image: "images/cane.jpg" },
    { name: "DADO", image: "images/dado.jpg" },
    { name: "FOCA", image: "images/foca.jpg" },
    { name: "GIRAFFA", image: "images/giraffa.jpg" },
    { name: "LIMONE", image: "images/limone.jpg" },
    { name: "MACCHINA", image: "images/macchina.jpg" },
    { name: "NAVETTA", image: "images/navetta.jpg" },
    { name: "PENNARELLO", image: "images/pennarello.jpg" },
    { name: "SEDIA", image: "images/sedia.jpg" },
    { name: "TAVOLO", image: "images/tavolo.jpg" },
    { name: "VESTITO", image: "images/vestito.jpg" },
    { name: "ZAINO", image: "images/zaino.jpg" },
    { name: "ZEBRA", image: "images/zebra.jpg" },


];

let currentIndex = 0;
let score = 0;
let selectedItems = [];
let attempts = 0;


function startGame() {
    selectedItems = getRandomItems(imageDatabase, 5);
    currentIndex = 0;
    score = 0;
    document.getElementById("score").textContent = "Punteggio: " + score;
    showNextImage();
}

function getRandomItems(arr, num) {
    let shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function generateUniqueSyllables(correctSyllable) {
    const allSyllables = ["BA", "BI", "CA", "CO", "DA", "DE", "LE", "FA", "FI", "GA"];
    let syllables = new Set();
    syllables.add(correctSyllable);

    while (syllables.size < 4) {
        let randomSyllable = allSyllables[Math.floor(Math.random() * allSyllables.length)];
        if (!syllables.has(randomSyllable)) {
            syllables.add(randomSyllable);
        }
    }

    return Array.from(syllables).sort(() => Math.random() - 0.5);
}

function showNextImage() {
    if (currentIndex >= selectedItems.length) {
        endGame();
        return;
    }

    attempts = 0;

    const item = selectedItems[currentIndex];
    const correctSyllable = item.name.substring(0, 2).toUpperCase();
    const syllables = generateUniqueSyllables(correctSyllable);

    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.classList.add("fade-in");
    gameContainer.appendChild(img);

    const optionContainer = document.createElement("div");
    syllables.forEach(syllable => {
        const button = document.createElement("button");
        button.textContent = syllable;
        button.onclick = () => checkAnswer(button, syllable, correctSyllable);
        optionContainer.appendChild(button);
    });

    gameContainer.appendChild(optionContainer);
}

function checkAnswer(button, selectedSyllable, correctSyllable) {
    const result = document.getElementById("result");

    attempts++;

    if (selectedSyllable.toUpperCase() === correctSyllable) {
        if (attempts === 1) {
            score += 2;
        } else if (attempts === 2) {
            score += 1;
        } // Altrimenti 0 punti

        result.textContent = "CORRETTO!";
        result.classList.add("bounce");
        document.getElementById("score").textContent = "Punteggio: " + score;
        currentIndex++;

        setTimeout(() => {
            result.classList.remove("bounce");
            showNextImage();
        }, 1000);
    } else {
        result.textContent = "SBAGLIATO, RIPROVA!";
        button.style.backgroundColor = "red";
        button.disabled = true;
    }
}


function endGame() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = `<h2>Hai completato il gioco! 🏆</h2>
                               <button onclick="startGame()">Gioca di nuovo</button>
                               <button onclick="exitGame()">Esci</button>`;
    document.getElementById("result").textContent = "";
}

function exitGame() {
    document.getElementById("game-container").innerHTML = "<h2>Grazie per aver giocato! 👋</h2>";
    document.getElementById("result").textContent = "";
}

document.addEventListener("DOMContentLoaded", startGame);