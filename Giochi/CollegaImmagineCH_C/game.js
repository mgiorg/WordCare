const images = [
    { src: 'arancia.jpg', type: 'c' },
    { src: 'cenerentola.jpg', type: 'c' },
    { src: 'cervello.jpg', type: 'c' },
    { src: 'cervo.jpg', type: 'c' },
    { src: 'cespuglio.jpg', type: 'c' },
    { src: 'cesto.jpg', type: 'c' },
    { src: 'ciambella.jpg', type: 'c' },
    { src: 'ciccione.jpg', type: 'c' },
    { src: 'cielo.jpg', type: 'c' },
    { src: 'ciliegia.jpg', type: 'c' },
    { src: 'cinema.jpg', type: 'c' },
    { src: 'cipolla.jpg', type: 'c' },
    { src: 'ciuccio.jpg', type: 'c' },
    { src: 'cappello.jpg', type: 'ch' },
    { src: 'carota.jpg', type: 'ch' },
    { src: 'castello.jpg', type: 'ch' },
    { src: 'chiave.jpg', type: 'ch' },
    { src: 'chitarra.jpg', type: 'ch' },
    { src: 'coccinella.jpg', type: 'ch' },
    { src: 'cocco.jpg', type: 'ch' },
    { src: 'coccodrillo.jpg', type: 'ch' },
    { src: 'comodino.jpg', type: 'ch' },
    { src: 'computer.jpg', type: 'ch' },
    { src: 'coniglio.jpg', type: 'ch' },
    { src: 'cubo.jpg', type: 'ch' },
    { src: 'cuore.jpg', type: 'ch' },
    { src: 'cuscino.jpg', type: 'ch' },
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





document.getElementById('ch-box').addEventListener('dragover', allowDrop);
document.getElementById('ch-box').addEventListener('drop', drop);
document.getElementById('c-box').addEventListener('dragover', allowDrop);
document.getElementById('c-box').addEventListener('drop', drop);

window.onload = startGame;
