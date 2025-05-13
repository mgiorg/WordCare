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
			},
			error: function (xhr, status, error) {
				console.error('Errore nel recupero del nome utente:', error);
			}
		});
	}

	// Caricamento delle informazioni utente
	loadUserInfo();
});
