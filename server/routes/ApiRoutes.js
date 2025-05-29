/**
 * WordCare - ApiRoutes.js
 */

const express = require('express');
const router = express.Router();
const AgendaRepository = require('../repositories/AgendaRepository');
const PatientRepository = require('../repositories/PatientRepository');

router.get('/patient-info', async (req, res) => {
	if (!req.session.userId) {
		const params = new URLSearchParams({
			code: '401',
			title: 'Utente non loggato',
			message: 'Si è verificato un errore: non sei loggato.',
			returnUrl: '/login'
		});
		return res.redirect(`/error.html?${params.toString()}`);
	}

	const nome = req.session.userName;
	const cognome = req.session.userSurname;

	try {
		let professionista = await PatientRepository.getNomeProfessionistaInCura(req.session.userId);
		if (!professionista) professionista = "Non assegnato";

		let ultimaVisita = await PatientRepository.getUltimaVisita(req.session.userId);
		if (!ultimaVisita) ultimaVisita = "Non disponibile";

		return res.json({ nome, cognome, professionista, ultimaVisita });
	} catch (err) {
		console.error('Errore nel recupero delle info paziente:', err);
		return res.status(500).json({ error: 'Errore interno' });
	}
});


// Ritorna tutte le note del paziente loggato
router.get('/paziente-agenda', async (req, res) => {
	if (!req.session.userId) {
		// Redirect alla pagina di errore con query string
		const params = new URLSearchParams({
			code: '401',
			title: 'Utente non loggato',
			message: 'Si è verificato un errore: non sei loggato.',
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
	try {
		const pazienteId = req.session.patientId;
		const notes = await AgendaRepository.findByPatientId(pazienteId);
		// Nota: i nomi dei campi sono { id, data, titolo, note, segnalazione }
		res.json(notes);
	} catch (err) {
		console.error('Errore fetching agenda:', err);
		// Redirect alla pagina di errore con query string
		const params = new URLSearchParams({
			code: '500',
			title: 'Errore dati agenda',
			message: "Si è verificato un errore: non sono riuscito a recuperare le informazioni dell'agenda.",
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
});

// Salva una nuova nota
router.post('/paziente-agenda', express.json(), async (req, res) => {
	if (!req.session.userId) {
		// Redirect alla pagina di errore con query string
		const params = new URLSearchParams({
			code: '401',
			title: 'Utente non loggato',
			message: 'Si è verificato un errore: non sei loggato.',
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
	try {
		const pazienteId = req.session.patientId;
		const { data, titolo, note, segnalazione } = req.body;
		const newNote = await AgendaRepository.create({
			paziente: pazienteId,
			data,
			titolo,
			note,
			segnalazione: segnalazione ? 1 : 0
		});
		res.json(newNote);
	} catch (err) {
		console.error('Errore nel salvataggio nota:', err);
		// Redirect alla pagina di errore con query string
		const params = new URLSearchParams({
			code: '500',
			title: 'Errore creazione nota',
			message: "Si è verificato un errore: non sono riuscito a salvare la nota.",
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
});

router.delete('/paziente-agenda/:id', async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}
	const pazienteId = req.session.patientId;
	const noteId = parseInt(req.params.id, 10);
	try {
		const changes = await AgendaRepository.deleteById(pazienteId, noteId);
		if (changes > 0) {
			return res.json({ success: true });
		} else {
			// Redirect alla pagina di errore con query string
			const params = new URLSearchParams({
				code: '500',
				title: 'Errore cancellazione nota',
				message: "Si è verificato un errore: non sono riuscito a trovare la nota.",
				returnUrl: '/login'
			});

			return res.redirect(`/error.html?${params.toString()}`);
		}
	} catch (err) {
		console.error('Errore eliminazione nota:', err);
		// Redirect alla pagina di errore con query string
		const params = new URLSearchParams({
			code: '400',
			title: 'Errore server',
			message: "Si è verificato un errore: riprovare più tardi.",
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
});

// PUT /api/paziente-agenda/:id → aggiorna una nota
router.put('/paziente-agenda/:id', express.json(), async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}
	const pazienteId = req.session.patientId;
	const noteId = parseInt(req.params.id, 10);
	const { data, titolo, note, segnalazione } = req.body;

	try {
		// costruisco un oggetto entry per il repository
		const updated = await AgendaRepository.update({
			id: noteId,
			paziente: pazienteId,
			data,
			titolo,
			note,
			segnalazione: segnalazione ? 1 : 0
		});
		return res.json(updated);
	} catch (err) {
		console.error('Errore aggiornamento nota:', err);
		// Redirect alla pagina di errore con query string
		const params = new URLSearchParams({
			code: '500',
			title: 'Errore modifica nota',
			message: "Si è verificato un errore: non sono riuscito a modificare la nota selezionata.",
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
});

module.exports = router;