const tutorialKey = 'tutorialVisto';

if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    // è un vero reload, puoi decidere se rimuovere la chiave oppure no
    localStorage.removeItem(tutorialKey);
}

if (!localStorage.getItem(tutorialKey)) {
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
                    description: `Usa questa barra per accedere rapidamente alle principali sezioni del sito:
                  • 🏠 Dashboard: il tuo centro di controllo.
                  • 📅 Agenda: i tuoi appuntamenti a portata di clic.
                  • 💪 Esercizi: monitora i tuoi progressi.
                  
                  Tutto è sempre accessibile dall'alto, ovunque ti trovi.`
                }
            },
            {
                element: '#esercizi-card',
                popover: {
                    title: 'Navigazione Principale',
                    description: `Usa questa barra per accedere rapidamente alle principali sezioni del sito:
                  • 🏠 Dashboard: il tuo centro di controllo.
                  • 📅 Agenda: i tuoi appuntamenti a portata di clic.
                  • 💪 Esercizi: monitora i tuoi progressi.
                  
                  Tutto è sempre accessibile dall'alto, ovunque ti trovi.`
                }
            },
            {
                element: '#professionista-card',
                popover: {
                    title: 'Il Tuo Professionista',
                    description: `Qui trovi:
                  • Il nome del professionista che ti segue.
                  • Tutte le informazioni aggiuntive che ti consentono di conoscere al meglio il professionista che ti segue.
                  • Un riferimento sempre visibile a chi si prende cura del tuo percorso.
                  
                  Se non è assegnato, verrà mostrato “Non assegnato”.`
                }
            },
            {
                element: '#ultima-visita-card',
                popover: {
                    title: 'Ultima Visita',
                    description: `Hai bisogno di un rapido promemoria?
                  • Qui trovi la data della tua ultima visita.
                  • È utile per sapere da quanto tempo non ti sottoponi a un controllo.
                  
                  Se la data non è disponibile, significa che non ci sono visite registrate.`
                }
            },
            {
                element: '.appointments-container',
                popover: {
                    title: 'Prossimo Appuntamento',
                    description: `Tieniti sempre aggiornato:
                  • Qui viene mostrato il tuo prossimo appuntamento confermato.
                  • Verifica data, ora e professionista.
                  
                  Non dimenticare: puoi cliccare per maggiori dettagli.`
                }
            },
            {
                element: '#btn-all-appointments',
                popover: {
                    title: 'Tutti gli Appuntamenti',
                    description: `Vuoi una panoramica completa?
                  • Consulta la lista di tutti i tuoi appuntamenti futuri e passati.
                  • Gli appuntamenti sono ordinati e colorati per una lettura più semplice.
                  
                  Una cronologia utile per tenere traccia del tuo percorso.`
                }
            },
            {
                element: '.navbar-avatar',
                popover: {
                    title: 'Menu Profilo',
                    description: `Gestisci il tuo account:
                  • Modifica le informazioni personali.
                  • Accedi ai messaggi e alle impostazioni.
                  • Esci in sicurezza dal sistema.
                  
                  Tutto in un solo clic, in alto a destra.`
                }
            }
        ],
        onReset: () => {
            localStorage.setItem(tutorialKey, 'true');
        },
        onDeselected: () => {
            localStorage.setItem(tutorialKey, 'true');
        }
    });

    driverObj.drive();
}