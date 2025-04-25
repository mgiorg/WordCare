const imageDatabase = [
    { name: "ASTUCCIO", image: "images/astuccio.jpg" },
    { name: "BICICLETTA", image: "images/bicicletta.jpg" },
    { name: "CANE", image: "images/cane.jpg" },
    { name: "DADO", image: "images/dado.jpg" },
    { name: "ELEFANTE", image: "images/elefante.jpg" },
    { name: "FOCA", image: "images/foca.jpg" },
    { name: "GIRAFFA", image: "images/giraffa.jpg" },
    { name: "HOTEL", image: "images/hotel.jpg" },
    { name: "ISOLA", image: "images/isola.jpg" },
    { name: "LIMONE", image: "images/limone.jpg" }
];

let currentIndex = 0;
let score = 0;
let selectedItems = [];

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

function showNextImage() {
    if (currentIndex >= selectedItems.length) {
        document.getElementById("game-container").innerHTML = "<h2>Hai completato il gioco! 🏆</h2>";
        return;
    }

    const item = selectedItems[currentIndex];
    const correctSyllable = item.name.substring(0, 2).toUpperCase();
    const syllables = [
        correctSyllable,
        "BI", "CA", "DA", "EL"
    ].sort(() => Math.random() - 0.5);

    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    gameContainer.appendChild(img);

    const optionContainer = document.createElement("div");
    syllables.forEach(syllable => {
        const button = document.createElement("button");
        button.textContent = syllable;
        button.onclick = () => checkAnswer(syllable, correctSyllable);
        optionContainer.appendChild(button);
    });

    gameContainer.appendChild(optionContainer);
}

function checkAnswer(selectedSyllable, correctSyllable) {
    const result = document.getElementById("result");
    if (selectedSyllable.toUpperCase() === correctSyllable) {
        result.textContent = "CORRETTO!";
        result.style.color = "green";
        score++;
        document.getElementById("score").textContent = "Punteggio: " + score;
        currentIndex++;
        setTimeout(showNextImage, 1000); // Mostra nuova immagine dopo 1 sec
    } else {
        result.textContent = "SBAGLIATO, RIPROVA!";
        result.style.color = "red";
    }
}

document.addEventListener("DOMContentLoaded", startGame);
