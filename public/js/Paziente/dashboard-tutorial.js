
const driver = window.driver.js.driver;

const driverObj = driver({
    showProgress: true,
    progressText: 'Passaggio {{current}} di {{total}}',
    overlayColor: '#000000',
    overlayOpacity: 0.6, // oppure 0.5
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayClickBehavior: 'close',
    stagePadding: 8,
    stageRadius: 6,
    disableActiveInteraction: false,
    popoverClass: 'driverjs-theme',
    popoverOffset: 12,
    nextBtnText: 'Avanti',
    prevBtnText: 'Indietro',
    doneBtnText: 'Fine',
    steps: [
        {
            element: '.navbar',
            popover: {
                title: 'Navigazione Principale',
                description: 'Accedi rapidamente alla tua Dashboard, Agenda ed Esercizi.'
            }
        },
        {
            element: '#esercizi-card',
            popover: {
                title: 'Esercizi Svolti',
                description: 'Visualizza gli esercizi che hai svolto e controlla il tuo andamento nel tempo.'
            }
        },
        {
            element: '#professionista-card',
            popover: {
                title: 'Il Tuo Professionista',
                description: 'Visualizza il nome del professionista che ti segue.'
            }
        },
        {
            element: '#ultima-visita-card',
            popover: {
                title: 'Ultima Visita',
                description: 'Controlla la data della tua ultima visita.'
            }
        },
        {
            element: '.appointments-container',
            popover: {
                title: 'Prossimo Appuntamento',
                description: 'Visualizza i dettagli del tuo prossimo appuntamento.'
            }
        },
        {
            element: '#btn-all-appointments',
            popover: {
                title: 'Tutti gli Appuntamenti',
                description: 'Consulta l\'elenco completo dei tuoi appuntamenti.'
            }
        },
        {
            element: '.navbar-avatar',
            popover: {
                title: 'Menu Profilo',
                description: 'Accedi al tuo profilo, messaggi e impostazioni.'
            }
        }
    ]
});

driverObj.drive();
