const imageDatabase = [
        { name: "astuccio", image: "images/astuccio.jpg" },
        { name: "bicicletta", image: "images/bicicletta.jpg" },
        { name: "cane", image: "images/cane.jpg" },
        { name: "dado", image: "images/dado.jpg" },
        { name: "elefante", image: "images/elefante.jpg" },
        { name: "foca", image: "images/foca.jpg" },
        { name: "giraffa", image: "images/giraffa.jpg" },
        { name: "hotel", image: "images/hotel.jpg" },
        { name: "isola", image: "images/isola.jpg" },
        { name: "limone", image: "images/limone.jpg" },
        { name: "macchina", image: "images/macchina.jpg" },
        { name: "navetta", image: "images/navetta.jpg" },
        { name: "orologio", image: "images/orologio.jpg" },
        { name: "pennarello", image: "images/pennarello.jpg" },
        { name: "quaderno", image: "images/quaderno.jpg" },
        { name: "racchetta", image: "images/racchetta.jpg" },
        { name: "sedia", image: "images/sedia.jpg" },
        { name: "tavolo", image: "images/tavolo.jpg" },
        { name: "vestito", image: "images/vestito.jpg" },
        { name: "yogurt", image: "images/yogurt.jpg" },
        { name: "zaino", image: "images/zaino.jpg" },
        { name: "zebra", image: "images/zebra.jpg" }
    ];

function getRandomItems(arr, num) {
    let shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function startGame() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";
    let selectedItems = getRandomItems(imageDatabase, 5);

    selectedItems.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        const correctSyllable = item.name.substring(0, 2);
        const syllables = [
            correctSyllable,
            "Bi", "Ca", "Da", "El"
        ].sort(() => Math.random() - 0.5);

        const optionContainer = document.createElement("div");
        syllables.forEach(syllable => {
            const button = document.createElement("button");
            button.textContent = syllable;
            button.onclick = () => checkAnswer(syllable, correctSyllable);
            optionContainer.appendChild(button);
        });

        gameContainer.appendChild(img);
        gameContainer.appendChild(optionContainer);
    });
}

function checkAnswer(selectedSyllable, correctSyllable) {
    const result = document.getElementById("result");
    if (selectedSyllable === correctSyllable) {
        result.textContent = "Corretto!";
        result.style.color = "green";
    } else {
        result.textContent = "Sbagliato, riprova!";
        result.style.color = "red";
    }
}

document.addEventListener("DOMContentLoaded", startGame);
