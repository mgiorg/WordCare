const images = [
    { src: '/views/Giochi/CollegaImmagineCH_C/arancia.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cenerentola.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cervello.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cervo.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cespuglio.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cesto.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/ciambella.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/ciccione.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cielo.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/ciliegia.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cinema.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cipolla.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/ciuccio.jpg', type: 'c' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cappello.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/carota.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/castello.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/chiave.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/chitarra.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/coccinella.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cocco.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/coccodrillo.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/comodino.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/computer.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/coniglio.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cubo.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cuore.jpg', type: 'ch' },
    { src: '/views/Giochi/CollegaImmagineCH_C/cuscino.jpg', type: 'ch' },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    const shuffledImages = shuffle(images).slice(0, 9);
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';

    shuffledImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.id = `img-${Math.random().toString(36).substr(2, 9)}`;
        imgElement.src = image.src;
        imgElement.classList.add('image');
        imgElement.dataset.type = image.type;
        imgElement.draggable = true;
        imgElement.addEventListener('dragstart', dragStart);
        imageContainer.appendChild(imgElement);
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}


function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const imageId = event.dataTransfer.getData('text/plain'); // Ottieni l'ID dell'immagine
    const draggedImage = document.getElementById(imageId); // Trova l'immagine corretta

    // Troviamo il contenitore giusto, evitando problemi di selezione errata
    const targetBox = event.target.closest('.box');

    if (draggedImage && targetBox) {
        targetBox.appendChild(draggedImage.cloneNode(true)); // Aggiungiamo l'immagine
        draggedImage.remove(); // Rimuoviamo l'originale
    }
}

function highlight(event) {
    event.preventDefault();
    event.target.classList.add('dragover');
}

function removeHighlight(event) {
    event.target.classList.remove('dragover');
}

function checkAnswers() {
    let score = 0;

    const chBoxImages = document.getElementById('ch-box').getElementsByTagName('img');
    const cBoxImages = document.getElementById('c-box').getElementsByTagName('img');

    // Controlla immagini nel box SUONI DURI (ch)
    for (let img of chBoxImages) {
        if (img.dataset.type === 'ch') score++;
    }

    // Controlla immagini nel box SUONI DOLCI (c)
    for (let img of cBoxImages) {
        if (img.dataset.type === 'c') score++;
    }

    score += 1;

    document.getElementById('score-display').innerText = `Punteggio: ${score}`;
}


document.getElementById('ch-box').addEventListener('dragenter', highlight);
document.getElementById('ch-box').addEventListener('dragleave', removeHighlight);
document.getElementById('c-box').addEventListener('dragenter', highlight);
document.getElementById('c-box').addEventListener('dragleave', removeHighlight);





document.getElementById('ch-box').addEventListener('dragover', allowDrop);
document.getElementById('ch-box').addEventListener('drop', drop);
document.getElementById('c-box').addEventListener('dragover', allowDrop);
document.getElementById('c-box').addEventListener('drop', drop);

window.onload = startGame;
