function openProfessionistaModal() {
	const modal = document.getElementById('modal-professionista');
	modal.classList.add('show');
	document.body.style.overflow = 'hidden';
}

function closeProfessionistaModal() {
	const modal = document.getElementById('modal-professionista');
	modal.classList.remove('show');
	document.body.style.overflow = 'auto';
}

function loadProfessionistaInfo() {
	$.ajax({
		url: '/paziente/professionista-in-cura',
		method: 'GET',
		dataType: 'json',
		xhrFields: { withCredentials: true },
		success: function (data) {
			if (!data || !data.nome || !data.cognome) {
				$('#modal-professionista .modal-body').html(`
					<div class="no-data-message">
						<p class="text-center">Nessun professionista associato a te</p>
					</div>
        `);
		openProfessionistaModal();
			} else {
				$('#prof-nome').text(data.nome);
				$('#prof-cognome').text(data.cognome);
				$('#prof-data-nascita').text(data.data_nascita || 'Non disponibile');
				$('#prof-specializzazione').text(data.specializzazione);
				$('#prof-sede').text(data.sede);
				$('#prof-data-inizio').text(convertiDataInFormatoItaliano(data.data_inizio));
			}
			openProfessionistaModal();
		},
		error: function () {
			$('#modal-professionista .modal-body').html(`
					<div class="no-data-message">
						<p class="text-center">Nessun professionista associato a te</p>
					</div>
			`);
			openProfessionistaModal();
		}
	});
}

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

function renderAppuntamenti(data) {
	const now = new Date();
	const container = $('#lista-appuntamenti');
	container.empty();

	if (!data || data.length === 0) {
		container.html(`
            <div class="no-data-message">
                <p class="text-center">Nessun appuntamento prenotato</p>
            </div>
        `);
		return openAppointmentsModal();
	}

	data.forEach((app) => {
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
		} else if (!data.some(a => {
			const other = new Date(a.data + 'T' + a.ora);
			return other > now && other < dataApp;
		})) {
			classe = 'appointment-prossimo';
			statusText = 'Prossimo';
			iconClass = 'fas fa-clock';
		}

		container.append(`
            <div class="appointment-list-item ${classe}">
                <div class="appointment-icon"><i class="${iconClass}"></i></div>
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
}


$(function () {
	// Modal Professionista
	$("#professionista-card").on("click", loadProfessionistaInfo);
	$(document).on('click', '.close-btn', closeProfessionistaModal);
	$('#modal-professionista').on('click', function (e) {
		if (e.target === this) closeProfessionistaModal();
	});
	$(document).on('keydown', function (e) {
		if (e.key === 'Escape' && $('#modal-professionista').hasClass('show')) {
			closeProfessionistaModal();
		}
	});
	$(document).on('click', '.btn-primary', function () {
		alert('Funzionalità di contatto non ancora implementata');
	});

	// Modal Appuntamenti
	$('#btn-all-appointments').on('click', function () {
		$.ajax({
			url: '/paziente/appuntamenti',
			method: 'GET',
			dataType: 'json',
			success: renderAppuntamenti,
			error: () => alert('Errore nel recupero degli appuntamenti.')
		});
	});
	$("#ultima-visita-card").on("click", function () {
		$.ajax({
			url: '/paziente/appuntamenti',
			method: 'GET',
			dataType: 'json',
			success: renderAppuntamenti,
			error: () => alert('Errore nel recupero degli appuntamenti.')
		});
	});
	$(document).on('keydown', function (e) {
		if (e.key === 'Escape' && $('#modal-appuntamenti').hasClass('show')) {
			closeAppointmentsModal();
		}
	});
	$('#modal-appuntamenti').on('click', function (e) {
		if (e.target === this) closeAppointmentsModal();
	});
	$(document).on('click', '.close-appointments-btn', closeAppointmentsModal);
});