var $calendarDays, $currentMonthEl, $prevBtn, $nextBtn;
var $notesList, $selectedDateEl, $addNoteBtn, $noteForm, $addNoteForm, $cancelNoteBtn;
var today, selectedDate, currentMonth, currentYear;
var monthNames, notesMap, editingNoteId;

function formatKey(date) {
	return date.toISOString().slice(0, 10);
}

function formatDisplay(date) {
	return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

function loadNotes() {
	$.ajax({
		url: '/api/paziente-agenda',
		method: 'GET',
		dataType: 'json',
		success: function (data) {
			notesMap = {};
			data.forEach(function (note) {
				var key = note.data;
				if (!notesMap[key]) notesMap[key] = [];
				notesMap[key].push(note);
			});
			renderCalendar(currentMonth, currentYear);
			selectDate(today);
		},
		error: function (xhr, status, err) {
			console.error('Errore caricamento note:', err);
		}
	});
}

function saveNote(payload, callback) {
	$.ajax({
		url: '/api/paziente-agenda',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		dataType: 'json',
		success: function (saved) {
			var key = saved.data;
			if (!notesMap[key]) notesMap[key] = [];
			notesMap[key].push(saved);
			callback(null, saved);
		},
		error: function (xhr, status, err) {
			callback(err);
		}
	});
}

function deleteNote(id, callback) {
	$.ajax({
		url: '/api/paziente-agenda/' + id,
		method: 'DELETE',
		dataType: 'json',
		success: function () { callback(null); },
		error: function (xhr, status, err) { callback(err); }
	});
}

function updateNote(id, payload, callback) {
	$.ajax({
		url: '/api/paziente-agenda/' + id,
		method: 'PUT',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		dataType: 'json',
		success: function (updated) { callback(null, updated); },
		error: function (xhr, status, err) { callback(err); }
	});
}

function renderCalendar(month, year) {
	$calendarDays.empty();
	var firstDay = new Date(year, month, 1);
	var lastDay = new Date(year, month + 1, 0);
	var startIdx = (firstDay.getDay() + 6) % 7;

	for (var i = 0; i < startIdx; i++) {
		$('<div/>', { class: 'calendar-day day-other-month' }).appendTo($calendarDays);
	}

	for (var d = 1; d <= lastDay.getDate(); d++) {
		(function (day) {
			var dateObj = new Date(year, month, day);
			var key = formatKey(dateObj);
			var $cell = $('<div/>', { class: 'calendar-day day-current-month', text: day });

			if (dateObj.getDay() === 0 || dateObj.getDay() === 6) $cell.addClass('day-weekend');
			if (dateObj.toDateString() === today.toDateString()) $cell.addClass('day-today');
			if (dateObj.toDateString() === selectedDate.toDateString()) $cell.addClass('day-selected');
			if (notesMap[key] && notesMap[key].length > 0) $cell.addClass('has-notes');

			$cell.on('click', function () { selectDate(dateObj); });
			$cell.appendTo($calendarDays);
		})(d);
	}

	$currentMonthEl.text(monthNames[month] + ' ' + year);
}

function renderNotes(dateObj) {
	$notesList.empty();
	var key = formatKey(dateObj);
	var notes = notesMap[key] || [];

	if (notes.length === 0) {
		$notesList.html(
			'<div class="empty-notes-message">' +
			'<i class="fas fa-sticky-note empty-icon"></i>' +
			'<p>Nessuna nota per questo giorno.<br>Premi "Nuova nota" per aggiungerne una.</p>' +
			'</div>'
		);
		return;
	}

	notes.forEach(function (n) {
		var $item = $('<div/>', { class: 'note-item', 'data-id': n.id });
		if (n.segnalazione) $item.addClass('alert');
		$item.html(
			'<h3>' + n.titolo + '</h3>' +
			'<p>' + n.note + '</p>' +
			'<div class="note-meta">' +
			'<span>' + formatDisplay(dateObj) + '</span>' +
			(n.segnalazione ? '<span class="note-alert-badge"><i class="fas fa-exclamation-circle"></i> Segnalata</span>' : '') +
			'</div>'
		);
		var $actions = $('<div/>', { class: 'note-actions' });
		$('<button/>', { class: 'btn-note-action btn-edit', 'data-id': n.id, html: '<i class="fas fa-edit"></i>' }).appendTo($actions);
		$('<button/>', { class: 'btn-note-action btn-delete', 'data-id': n.id, html: '<i class="fas fa-trash"></i>' }).appendTo($actions);
		$item.append($actions);
		$notesList.append($item);
	});
}

function selectDate(dateObj) {
	selectedDate = new Date(dateObj);
	renderCalendar(currentMonth, currentYear);
	$selectedDateEl.text(formatDisplay(dateObj));
	renderNotes(dateObj);
	$noteForm.hide();
	editingNoteId = null;
	$addNoteForm[0].reset();
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
	
	$calendarDays = $('#calendar-days');
	$currentMonthEl = $('#current-month');
	$prevBtn = $('#prev-month');
	$nextBtn = $('#next-month');
	$notesList = $('#notes-list');
	$selectedDateEl = $('#selected-date');
	$addNoteBtn = $('#add-note-btn');
	$noteForm = $('#note-form');
	$addNoteForm = $('#add-note-form');
	$cancelNoteBtn = $('#cancel-note');

	today = new Date();
	today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	selectedDate = new Date(today);
	currentMonth = today.getMonth();
	currentYear = today.getFullYear();
	monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
	notesMap = {};
	editingNoteId = null;

	$prevBtn.on('click', function () {
		currentMonth--;
		if (currentMonth < 0) { currentMonth = 11; currentYear--; }
		renderCalendar(currentMonth, currentYear);
	});

	$nextBtn.on('click', function () {
		currentMonth++;
		if (currentMonth > 11) { currentMonth = 0; currentYear++; }
		renderCalendar(currentMonth, currentYear);
	});

	$addNoteBtn.on('click', function () {
		editingNoteId = null;
		$addNoteForm[0].reset();
		$noteForm.slideDown();
	});

	$cancelNoteBtn.on('click', function () {
		editingNoteId = null;
		$addNoteForm[0].reset();
		$noteForm.slideUp();
	});

	$addNoteForm.on('submit', function (e) {
		e.preventDefault();
		var titolo = $('#note-title').val().trim();
		var content = $('#note-content').val().trim();
		var segnalazione = $('#note-alert').is(':checked') ? 1 : 0;
		var data = formatKey(selectedDate);

		if (editingNoteId) {
			updateNote(editingNoteId, { data, titolo, note: content, segnalazione }, function (err, updated) {
				if (err) return alert('Errore aggiornamento');
				var arr = notesMap[data] || [];
				var idx = arr.findIndex(n => n.id === updated.id);
				if (idx > -1) arr[idx] = updated;
				editingNoteId = null;
				$addNoteForm[0].reset();
				$noteForm.slideUp();
				renderCalendar(currentMonth, currentYear);
				selectDate(selectedDate);
			});
		} else {
			saveNote({ data, titolo, note: content, segnalazione }, function (err, saved) {
				if (err) return alert('Errore nel salvataggio');
				$addNoteForm[0].reset();
				$noteForm.slideUp();
				renderCalendar(currentMonth, currentYear);
				selectDate(selectedDate);
			});
		}
	});

	$notesList.on('click', '.btn-delete', function () {
		var id = $(this).data('id');
		if (!confirm('Eliminare questa nota?')) return;
		deleteNote(id, function (err) {
			if (err) return alert('Errore durante l\'eliminazione');
			var key = formatKey(selectedDate);
			notesMap[key] = (notesMap[key] || []).filter(n => n.id !== id);
			renderCalendar(currentMonth, currentYear);
			selectDate(selectedDate);
		});
	});

	$notesList.on('click', '.btn-edit', function () {
		var id = $(this).data('id');
		var key = formatKey(selectedDate);
		var note = (notesMap[key] || []).find(n => n.id === id);
		if (!note) return;
		$('#note-title').val(note.titolo);
		$('#note-content').val(note.note);
		$('#note-alert').prop('checked', !!note.segnalazione);
		editingNoteId = id;
		$noteForm.slideDown();
	});

	loadNotes();
});
