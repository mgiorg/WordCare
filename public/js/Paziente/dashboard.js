const motivationalPhrases = [
	"Oggi è una nuova opportunità per migliorare. Facciamo progressi insieme!",
	"Ogni passo conta. Non fermarti adesso!",
	"Piccoli progressi portano a grandi risultati.",
	"Credi in te stesso: sei più forte di quanto pensi.",
	"Non guardare quanto manca, guarda quanto hai già fatto.",
	"La costanza è il segreto del cambiamento.",
	"Ogni giorno è una possibilità per diventare una versione migliore di te stesso.",
	"Continua a camminare: ogni passo ti avvicina al traguardo.",
	"Il successo è fatto di piccoli sforzi ripetuti ogni giorno.",
	"Non è importante quanto vai veloce, ma che tu non ti fermi.",
	"Rallenta se serve, ma non smettere mai.",
	"Oggi può essere il giorno in cui tutto cambia.",
	"Sii fiero di ogni progresso, anche il più piccolo.",
	"Non arrenderti: i risultati arrivano a chi persiste.",
	"Hai già superato tanto. Continua così!",
	"Ogni allenamento ti avvicina al tuo obiettivo.",
	"Dai il massimo, sempre. Anche oggi.",
	"Ogni giornata è un nuovo inizio.",
	"Corpo e mente si rafforzano insieme.",
	"Scegli di migliorare, un passo alla volta."
];

function mostraFraseMotivazionale() {
	const frase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
	$('#fraseMotivazionale').text(frase);
}

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
	$(".navbar-avatar").on("click", function () {
		$(".avatar-dropdown").toggleClass("active");
	});

	$(document).on("click", function (event) {
		if (!$(event.target).closest('.navbar-avatar').length) {
			$(".avatar-dropdown").removeClass("active");
		}
	});

	$(".menu-toggle").on("click", function () {
		$(".navbar-links").toggleClass("active");
	});

	loadUserInfo();
	loadProssimoAppuntamento();
	loadEserciziSvolti();
	mostraFraseMotivazionale();
});
