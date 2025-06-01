$(function () {
	// === VARIABILI GLOBALI ===
	let isEditing = false;
	let originalData = {};

	// === SELEZIONE ELEMENTI DOM ===
	const $editBtn = $("#edit-btn");
	const $saveBtn = $("#save-btn");
	const $cancelBtn = $("#cancel-btn");
	const $form = $("#profile-form");
	const $message = $("#message");
	const $inputs = $form.find(".form-input");

	// === CARICA I DATI PROFILO ===
	function loadProfileData() {
		$.ajax({
			url: "/api/profilo/info", // deve restituire dati completi: User + Paziente
			method: "GET",
			dataType: "json",
			xhrFields: { withCredentials: true },
			success: function (data) {
				// Popola i campi
				$("#nome").val(data.nome);
				$("#cognome").val(data.cognome);
				$("#username").val(data.username);
				$("#email").val(data.email);
				$("#data_nascita").val(data.data_nascita);
				$("#patologia").val(data.patologia || '');

				// Popola header
				$("#full-name").text(`${data.nome} ${data.cognome}`);
				$("#user-email").text(data.email);
				$(".avatar-dropdown .user-name").text(`${data.nome} ${data.cognome}`);
			},
			error: function () {
				showMessage("Errore nel caricamento del profilo", "error");
			}
		});
	}

	// === MODALITÀ MODIFICA ===
	function enableEditMode() {
		isEditing = true;
		originalData = {};
		$inputs.each(function () {
			const $input = $(this);
			originalData[$input.attr("name")] = $input.val();
            $input.prop("disabled", false);
		});
		$editBtn.hide();
		$saveBtn.show().prop("disabled", false);
		$cancelBtn.show();
		showMessage("Modalità modifica attivata. Modifica i campi che desideri aggiornare.", "success");
	}

	function disableEditMode() {
		isEditing = false;
		$inputs.prop("disabled", true);
		$editBtn.show();
		$saveBtn.hide();
		$cancelBtn.hide();
	}

	function cancelEdit() {
		for (const name in originalData) {
			$(`#${name}`).val(originalData[name]);
		}
		disableEditMode();
		showMessage("Modifiche annullate.", "error");
	}

	function saveProfile() {
		const updatedData = {
			user: {
				username: $("#username").val(),
				email: $("#email").val()
			},
			paziente: {
				nome: $("#nome").val(),
				cognome: $("#cognome").val(),
				data_nascita: $("#data_nascita").val(),
				patologia: $("#patologia").val()
			}
		};

		// Validazione
		if (!updatedData.paziente.nome || !updatedData.paziente.cognome) {
			showMessage("Nome e cognome sono obbligatori", "error");
			return;
		}

		$saveBtn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin"></i> Salvando...');

		$.ajax({
			url: "/api/profilo/info",
			method: "PUT",
			contentType: "application/json",
			data: JSON.stringify(updatedData),
			success: function () {
				disableEditMode();
				loadProfileData();
				showMessage("Profilo aggiornato con successo!", "success");
			},
			error: function () {
				showMessage("Errore nel salvataggio del profilo", "error");
			},
			complete: function () {
				$saveBtn.prop("disabled", false).html('<i class="fas fa-save"></i> Salva Modifiche');
			}
		});
	}

	// === MESSAGGIO VISIVO ===
	function showMessage(text, type) {
		const $span = $message.find("span");
		const $icon = $message.find("i");
		$span.text(text);
		$message.removeClass("success error").addClass(`${type} show`);
		$icon.attr("class", type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-triangle");
		setTimeout(() => $message.removeClass("show"), 5000);
	}

	// === DROPDOWN AVATAR ===
	$(".navbar-avatar").on("click", function (e) {
		e.stopPropagation();
		$(".avatar-dropdown").toggleClass("active");
	});
	$(document).on("click", function () {
		$(".avatar-dropdown").removeClass("active");
	});

	// === EVENTI ===
	$editBtn.on("click", enableEditMode);
	$cancelBtn.on("click", cancelEdit);
	$saveBtn.on("click", saveProfile);

	// === AVVIO ===
	loadProfileData();
});