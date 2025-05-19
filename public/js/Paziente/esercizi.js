document.addEventListener('DOMContentLoaded', function () {
    // Elementi DOM
    const exercisesGrid = document.getElementById('exercises-grid');
    const gameFilter = document.getElementById('game-filter');
    const exerciseCardTemplate = document.getElementById('exercise-card-template');

    // Dati di esempio per gli esercizi
    const exercises = [
        {
            id: 1,
            title: 'Memoria Visiva',
            description: 'Esercizio per migliorare la memoria visiva e la capacità di riconoscimento.',
            image: '../../images/exercises/memory.jpg',
            difficulty: 'Facile',
            duration: '10 min',
            progress: 75,
            status: 'assigned',
            badge: 'Assegnato'
        },
        {
            id: 2,
            title: 'Pronuncia',
            description: 'Esercizi di pronuncia per migliorare la chiarezza del linguaggio.',
            image: '../../images/exercises/pronunciation.jpg',
            difficulty: 'Media',
            duration: '15 min',
            progress: 30,
            status: 'assigned',
            badge: 'Assegnato'
        },
        {
            id: 3,
            title: 'Comprensione',
            description: 'Test di comprensione per valutare il livello di comprensione del linguaggio.',
            image: '../../images/exercises/comprehension.jpg',
            difficulty: 'Difficile',
            duration: '20 min',
            progress: 100,
            status: 'completed',
            badge: 'Completato'
        }
    ];

    // Funzione per creare una card esercizio
    function createExerciseCard(exercise) {
        const card = exerciseCardTemplate.content.cloneNode(true);

        // Imposta l'immagine
        const img = card.querySelector('.exercise-image img');
        img.src = exercise.image;
        img.alt = exercise.title;

        // Imposta il badge
        const badge = card.querySelector('.exercise-badge');
        badge.textContent = exercise.badge;
        badge.classList.add(exercise.status);

        // Imposta il titolo e la descrizione
        card.querySelector('.exercise-title').textContent = exercise.title;
        card.querySelector('.exercise-description').textContent = exercise.description;

        // Imposta le meta info
        card.querySelector('.exercise-difficulty').innerHTML =
            `<i class="fas fa-signal"></i> ${exercise.difficulty}`;
        card.querySelector('.exercise-duration').innerHTML =
            `<i class="fas fa-clock"></i> ${exercise.duration}`;

        // Imposta la barra di progresso
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        progressFill.style.width = `${exercise.progress}%`;
        progressText.textContent = `${exercise.progress}%`;

        // Aggiungi l'evento click al pulsante
        const startButton = card.querySelector('.btn-start-exercise');
        startButton.addEventListener('click', () => startExercise(exercise.id));

        return card;
    }

    // Funzione per filtrare gli esercizi
    function filterExercises(status) {
        const filteredExercises = status === 'all'
            ? exercises
            : exercises.filter(exercise => exercise.status === status);

        renderExercises(filteredExercises);
    }

    // Funzione per renderizzare gli esercizi
    function renderExercises(exercisesToRender) {
        exercisesGrid.innerHTML = '';
        exercisesToRender.forEach(exercise => {
            exercisesGrid.appendChild(createExerciseCard(exercise));
        });
    }

    // Funzione per avviare un esercizio
    function startExercise(exerciseId) {
        // Qui puoi implementare la logica per avviare l'esercizio
        console.log(`Avvio esercizio ${exerciseId}`);
        // Per esempio, reindirizzare alla pagina dell'esercizio
        // window.location.href = `/esercizi/${exerciseId}`;
    }

    // Event listener per il filtro
    gameFilter.addEventListener('change', (e) => {
        filterExercises(e.target.value);
    });

    // Inizializza la vista con tutti gli esercizi
    filterExercises('all');
}); 