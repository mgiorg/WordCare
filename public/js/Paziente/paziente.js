$(function () {
	// Gestione del dropdown dell'avatar
	$(".navbar-avatar").on("click", function () {
		$(".avatar-dropdown").toggleClass("active");
	});

	// Chiudi il dropdown quando si clicca altrove
	$(document).on("click", function (event) {
		if (!$(event.target).closest('.navbar-avatar').length) {
			$(".avatar-dropdown").removeClass("active");
		}
	});

	// Funzioni per gestire il modal migliorato
	function openModal() {
		const modal = document.getElementById('modal-professionista');
		modal.classList.add('show');
		document.body.style.overflow = 'hidden';
	}

	function closeModal() {
		const modal = document.getElementById('modal-professionista');
		modal.classList.remove('show');
		document.body.style.overflow = 'auto';
	}

	// Event listener per aprire il modal cliccando sulla card del professionista
	$("#professionista-card").on("click", function () {
		$.ajax({
			url: '/paziente/professionista-in-cura',
			method: 'GET',
			dataType: 'json',
			xhrFields: { withCredentials: true },
			success: function (data) {
				// Popola i dati nel modal
				$('#prof-nome').text(data.nome);
				$('#prof-cognome').text(data.cognome);
				$('#prof-data-nascita').text(data.data_nascita);
				$('#prof-specializzazione').text(data.specializzazione);
				$('#prof-sede').text(data.sede);
				$('#prof-data-inizio').text(data.data_inizio);

				// Apri il modal con le nuove animazioni
				openModal();
			},
			error: function (xhr) {
				alert('Errore nel caricamento del professionista.');
			}
		});
	});

	// Event listener per chiudere il modal con il pulsante X
	$(document).on('click', '.close-btn', function () {
		closeModal();
	});

	// Event listener per chiudere il modal cliccando fuori dal contenuto
	$('#modal-professionista').on('click', function (e) {
		if (e.target === this) {
			closeModal();
		}
	});

	// Event listener per chiudere il modal con il tasto ESC
	$(document).on('keydown', function (e) {
		if (e.key === 'Escape') {
			const modal = document.getElementById('modal-professionista');
			if (modal.classList.contains('show')) {
				closeModal();
			}
		}
	});

	// Event listener per il pulsante "Contatta" nel footer del modal (opzionale)
	$(document).on('click', '.btn-primary', function () {
		// Qui puoi implementare la logica per contattare il professionista
		alert('Funzionalità di contatto non ancora implementata');
		// Esempio: window.location.href = '/paziente/contatta-professionista';
	});

	function openAppointmentsModal() {
		const modal = document.getElementById('modal-appuntamenti');
		modal.classList.add('show');
		document.body.style.overflow = 'hidden';
	}

	function closeAppointmentsModal() {
		const modal = document.getElementById('modal-appuntamenti');
		modal.classList.remove('show');
		document.body.style.overflow = 'auto';
	}

	$('#btn-all-appointments').on('click', function () {
		$.ajax({
			url: '/paziente/appuntamenti',
			method: 'GET',
			dataType: 'json',
			success: function (data) {
				const now = new Date();
				const container = $('#lista-appuntamenti');
				container.empty();

				data.forEach((app, index) => {
					const dataApp = new Date(app.data + 'T' + app.ora);
					const dataIt = dataApp.toLocaleDateString('it-IT', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					});

					let classe = 'appointment-futuro';
					let statusText = 'Programmato';
					let iconClass = 'fas fa-calendar-check';

					if (dataApp < now) {
						classe = 'appointment-passato';
						statusText = 'Completato';
						iconClass = 'fas fa-check-circle';
					} else if (!data.some(a => new Date(a.data + 'T' + a.ora) > now && new Date(a.data + 'T' + a.ora) < dataApp)) {
						classe = 'appointment-prossimo';
						statusText = 'Prossimo';
						iconClass = 'fas fa-clock';
					}

					container.append(`
                    <div class="appointment-list-item ${classe}">
                        <div class="appointment-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="appointment-details">
                            <div class="appointment-date">${dataIt} alle ${app.ora}</div>
                            <div class="appointment-type">${app.tipo}</div>
                            <div class="appointment-professional">Con: ${app.professionista}</div>
                        </div>
                        <div class="appointment-status">${statusText}</div>
                    </div>
                `);
				});

				openAppointmentsModal();
			},
			error: () => alert('Errore nel recupero degli appuntamenti.')
		});
	});

	$(document).on('keydown', function (e) {
		if (e.key === 'Escape') {
			const modal = document.getElementById('modal-appuntamenti');
			if (modal.classList.contains('show')) {
				closeAppointmentsModal();
			}
		}
	});

	$('#modal-appuntamenti').on('click', function (e) {
		if (e.target === this) {
			closeAppointmentsModal();
		}
	});
	$(document).on('click', '.close-appointments-btn', function () {
		closeAppointmentsModal();
	});

	function loadUserInfo() {
		$.ajax({
			url: '/api/patient-info',
			method: 'GET',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			success: function (data) {
				console.log('Dati ricevuti:', data);
				$('.patient-title').text(`Dashboard di ${data.nome} ${data.cognome}`);
				$('.avatar-dropdown .user-name').text(`Ciao, ${data.nome}`);
				$("#nome-professionista-in-cura").text(data.professionista || "Non assegnato");
				$("#data-ultima-visita").text(data.ultimaVisita || 'Non disponibile');
			},
			error: function (xhr, status, error) {
				console.error('Errore nel recupero del nome utente:', error);
			}
		});
	}

	// Caricamento delle informazioni utente
	loadUserInfo();
});