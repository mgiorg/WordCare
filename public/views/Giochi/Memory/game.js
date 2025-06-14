let players = [];
let currentPlayerIndex = 0;
let scores = {};
let flippedCards = [];

function startGame() {
    const selectedCategory = document.getElementById("category").value;
    const playerNames = document.getElementById("players").value.split(",");

    if (playerNames.length < 2) {
        alert("Inserisci almeno due giocatori!");
        return;
    }

    players = playerNames.map(player => player.trim());
    players.forEach(player => scores[player] = 0);

    document.getElementById("settings-container").style.display = "none";
    document.getElementById("game-container").style.display = "block";

    initializeGame(selectedCategory);
}

function initializeGame(category) {
    let items = getCategoryImages(category);
    let shuffledCards = [...items, ...items].sort(() => 0.5 - Math.random());

    const board = document.getElementById("board");
    board.innerHTML = "";

    shuffledCards.forEach((item) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-item", item);
        card.onclick = () => flipCard(card);

        let img = document.createElement("img");
        img.src = "images/" + item;
        img.alt = item.split(".")[0];
        card.appendChild(img);

        board.appendChild(card);
    });

    updateTurnInfo();
}

function getCategoryImages(category) {
    const categories = {
        house: ["/views/Giochi/Memory/images/casa.jpg", "/views/Giochi/Memory/images/letto.jpg", "/views/Giochi/Memory/images/pc.jpg", "/views/Giochi/Memory/images/porta.jpg", "/views/Giochi/Memory/images/sedia.jpg", "/views/Giochi/Memory/images/vasca.jpg", "/views/Giochi/Memory/images/orologio.jpg", "/views/Giochi/Memory/images/piatto.jpg"],
        jobs: ["/views/Giochi/Memory/images/medico.jpg", "/views/Giochi/Memory/images/cuoco.jpg", "/views/Giochi/Memory/images/astronauta.jpg", "/views/Giochi/Memory/images/poliziotto.jpg", "/views/Giochi/Memory/images/insegnante.jpg", "/views/Giochi/Memory/images/operaio.jpg", "/views/Giochi/Memory/images/fotografo.jpg", "/views/Giochi/Memory/images/cantante.jpg"],
        animals: ["/views/Giochi/Memory/images/cane.jpg", "/views/Giochi/Memory/images/gatto.jpg", "/views/Giochi/Memory/images/panda.jpg", "/views/Giochi/Memory/images/leone.jpg", "/views/Giochi/Memory/images/tartaruga.jpg", "/views/Giochi/Memory/images/serpente.jpg", "/views/Giochi/Memory/images/elefante.jpg", "/views/Giochi/Memory/images/uccello.jpg"]
    };
    return categories[category];
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        flippedCards.push(card);
    }

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute("data-item") === card2.getAttribute("data-item")) {
        scores[players[currentPlayerIndex]]++;
        card1.style.backgroundColor = "#32CD32";
        card2.style.backgroundColor = "#32CD32";
    } else {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        nextTurn();
    }

    flippedCards = [];

    if (document.querySelectorAll(".flipped").length === 16) {
        endGame();
    }
}

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurnInfo();
}

function updateTurnInfo() {
    document.getElementById("turn-info").textContent = `${players[currentPlayerIndex]}, tocca a te!`;
}

function endGame() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("end-game").style.display = "block";

    let ranking = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(player => `${player[0]}: ${player[1]} punti`)
        .join("<br>");

    document.getElementById("final-score").innerHTML = ranking;
}

function restartGame() {
    document.getElementById("end-game").style.display = "none";
    document.getElementById("settings-container").style.display = "block";
}

function exitGame() {
    document.getElementById("end-game").innerHTML = "<h2>Grazie per aver giocato! 👋</h2>";
}
