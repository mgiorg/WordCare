document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const btnCorrect = document.getElementById('btnCorrect');
  const btnWrong = document.getElementById('btnWrong');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const finishSound = new Audio('finish.mp3');
  let score = 0;
  let musicEnabled = false;
  let lastTwoColors = [];
  let lastCard = null;

  let deck = [
    { color: 'blue', syllable: 'BA', image: 'ba.png' },
    { color: 'blue', syllable: 'BE', image: 'be.png' },
    { color: 'blue', syllable: 'BI', image: 'bi.png' },
    { color: 'blue', syllable: 'BO', image: 'bo.png' },
    { color: 'blue', syllable: 'BU', image: 'bu.png' },
    { color: 'yellow', syllable: 'PA', image: 'pa.png' },
    { color: 'yellow', syllable: 'PE', image: 'pe.png' },
    { color: 'yellow', syllable: 'PI', image: 'pi.png' },
    { color: 'yellow', syllable: 'PO', image: 'po.png' },
    { color: 'yellow', syllable: 'PU', image: 'pu.png' }
  ];

  let currentCard = null;
  let currentCardIndex = -1;

  backgroundMusic.pause();
  musicToggle.textContent = '🔇';

  musicToggle.addEventListener('click', function () {
    if (musicEnabled) {
      backgroundMusic.pause();
      musicToggle.textContent = '🔇';
    } else {
      backgroundMusic.play();
      musicToggle.textContent = '🔊';
    }
    musicEnabled = !musicEnabled;
  });

  function newCard() {
    if (deck.length === 0) {
      currentCard = null;
      return;
    }
    let possibleCards = deck.filter(card => {
      const isDifferentFromLastCard = lastCard ? card.syllable !== lastCard.syllable : true;
      const isValidColor =
        lastTwoColors.length < 2 ||
        !(lastTwoColors[0] === card.color && lastTwoColors[1] === card.color);
      return isDifferentFromLastCard && isValidColor;
    });
    if (possibleCards.length === 0) possibleCards = deck;
    currentCardIndex = Math.floor(Math.random() * possibleCards.length);
    currentCard = possibleCards[currentCardIndex];
    lastCard = currentCard;
    lastTwoColors.push(currentCard.color);
    if (lastTwoColors.length > 2) {
      lastTwoColors.shift();
    }
    updateGame();
  }

  function drawCard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!currentCard) {
      ctx.fillStyle = "#000";
      ctx.font = "36px Arial";
      ctx.fillText("Nessuna carta da mostrare", canvas.width / 2 - 180, canvas.height / 2);
      return;
    }
    const cardWidth = 200;
    const cardHeight = 300;
    const x = (canvas.width - cardWidth) / 2;
    const y = (canvas.height - cardHeight) / 2;
    ctx.fillStyle = currentCard.color;
    ctx.fillRect(x, y, cardWidth, cardHeight);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, cardWidth, cardHeight);
    const img = new Image();
    img.src = currentCard.image;
    img.onload = function () {
      const imgWidth = 150;
      const imgHeight = 150;
      const imgX = (canvas.width - imgWidth) / 2;
      const imgY = y + 40;
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    };
    const text = currentCard.syllable;
    ctx.font = "36px Arial";
    ctx.fillStyle = "#000";
    const textWidth = ctx.measureText(text).width;
    const textX = (canvas.width - textWidth) / 2;
    const textY = y + cardHeight + 40;
    ctx.fillText(text, textX, textY);
  }

  function updateScore() {
    scoreDisplay.textContent = "Punteggio: " + score;
  }

  function updateGame() {
    updateScore();
    drawCard();
  }

  function startBackgroundColorLoop() {
    const changeColor = () => {
      const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      document.body.style.backgroundColor = randomColor;
    };
    setInterval(changeColor, 500);
  }

  function addGlowEffect() {
    canvas.classList.add('glow');
    setTimeout(() => canvas.classList.remove('glow'), 300);
  }

  function addShakeEffect() {
    canvas.classList.add('shake');
    setTimeout(() => canvas.classList.remove('shake'), 300);
  }

  function showMedal() {
    const medal = new Image();
    medal.src = 'medal.png';
    medal.onload = function () {
      const medalWidth = 100;
      const medalHeight = 100;
      const x = (canvas.width - medalWidth) / 2;
      const y = canvas.height / 2;
      ctx.drawImage(medal, x, y, medalWidth, medalHeight);
    };
  }

  btnCorrect.addEventListener('click', function () {
    if (!currentCard) return;

    addGlowEffect(); // Glow effect
    score++;
    deck.splice(currentCardIndex, 1);

    if (score >= 7) {
      backgroundMusic.pause();
      finishSound.play();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Hai vinto!", canvas.width / 2, canvas.height / 2 - 50);

      showMedal(); // Mostra la medaglia sotto la scritta "Hai vinto!"
      btnCorrect.disabled = true;
      btnWrong.disabled = true;
      startBackgroundColorLoop(); // Inizia il loop di colori di sfondo
      updateScore();
      return;
    }

    newCard();
  });

  btnWrong.addEventListener('click', function () {
    if (!currentCard) return;

    addShakeEffect(); // Shake effect
    newCard();
  });

  newCard();
});
