// Caricamento delle informazioni utente
function loadUserInfo() {
	$.ajax({
		url: '/api/patient-info',
		method: 'GET',
		dataType: 'json',
		xhrFields: { withCredentials: true },
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

function loadProssimoAppuntamento() {
	$.ajax({
		url: '/paziente/prossimo-appuntamento',
		method: 'GET',
		dataType: 'json',
		success: function (app) {
			const container = $('.appointments-container');
			container.empty();

			if (!app) {
				container.html(`
					<div class="appointment-card no-data">
						<p class="text-center">Nessun appuntamento programmato</p>
					</div>
				`);
				return;
			}

			const dataObj = new Date(app.data + 'T' + app.ora);
			const mese = dataObj.toLocaleString('it-IT', { month: 'short' });
			const giorno = String(dataObj.getDate()).padStart(2, '0');
			const ora = app.ora.slice(0, 5); // HH:MM

			container.html(`
				<div class="appointment-card">
					<div class="date-badge">
						<div class="month">${mese.charAt(0).toUpperCase() + mese.slice(1)}</div>
						<div class="day">${giorno}</div>
					</div>
					<div class="appointment-details">
						<p><i class="fas fa-user-md"></i> ${app.professionista}</p>
						<p><i class="fas fa-clock"></i> ${ora}</p>
						<p><i class="fas fa-map-marker-alt"></i> ${app.sede}</p>
					</div>
				</div>
			`);
		},
		error: function () {
			console.error('Errore nel recupero del prossimo appuntamento');
		}
	});
}

function loadEserciziSvolti() {
	$.ajax({
		url: '/api/esercizi-svolti',
		method: 'GET',
		dataType: 'json',
		success: function (data) {
			$("#esercizi-card span").text(data.totale || '0');
		},
		error: function (err) {
			console.error('Errore nel recupero degli esercizi svolti:', err);
		}
	});
}

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

	loadUserInfo();
	loadProssimoAppuntamento();
	loadEserciziSvolti();
});
