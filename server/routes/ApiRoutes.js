/**
 * WordCare - ApiRoutes.js
 */

const express = require('express');
const router = express.Router();
const AgendaRepository = require('../repositories/AgendaRepository');

router.get('/patient-info', (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}

	// Recupera il nome dalla sessione
	const nome = req.session.userName;
	const cognome = req.session.userSurname;
	return res.json({ nome, cognome });
});

/**
 * GET /api/error-info
 * → Riceve opzionalmente in query: code, returnUrl
 * → Puoi mappare code→titolo/messaggio o usare dei valori di default
 */
router.get('/error-info', (req, res) => {
	const { code, returnUrl } = req.query;

	// Mappa di esempio per titoli e messaggi
	const errorMap = {
		'404': {
			title: 'Pagina non trovata',
			message: 'La pagina richiesta non esiste.',
		},
		'500': {
			title: 'Errore interno',
			message: 'Si è verificato un errore imprevisto sul server.',
		},
	};

	const entry = errorMap[code] || {
		title: 'Oops! Qualcosa è andato storto',
		message: "Si è verificato un errore durante l'operazione.",
	};

	res.json({
		code: code || '500',
		title: entry.title,
		message: entry.message,
		// Usa il returnUrl passato in query, o di default rimanda al login
		returnUrl: returnUrl || '/login',
	});
});

// Ritorna tutte le note del paziente loggato
router.get('/paziente-agenda', async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}
	try {
		const pazienteId = req.session.userId;
		const notes = await AgendaRepository.findByPatientId(pazienteId);
		// Nota: i nomi dei campi sono { id, data, titolo, note, segnalazione }
		res.json(notes);
	} catch (err) {
		console.error('Errore fetching agenda:', err);
		res.status(500).json({ error: 'Errore server' });
	}
});

// Salva una nuova nota
router.post('/paziente-agenda', express.json(), async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}
	try {
		const pazienteId = req.session.userId;
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
		res.status(500).json({ error: 'Errore server' });
	}
});

router.delete('/paziente-agenda/:id', async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}
	const pazienteId = req.session.userId;
	const noteId = parseInt(req.params.id, 10);
	try {
		const changes = await AgendaRepository.deleteById(pazienteId, noteId);
		if (changes > 0) {
			return res.json({ success: true });
		} else {
			return res.status(404).json({ error: 'Nota non trovata' });
		}
	} catch (err) {
		console.error('Errore eliminazione nota:', err);
		return res.status(500).json({ error: 'Errore server' });
	}
});

// PUT /api/paziente-agenda/:id → aggiorna una nota
router.put('/paziente-agenda/:id', express.json(), async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Non loggato' });
	}
	const pazienteId = req.session.userId;
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
		return res.status(500).json({ error: 'Errore server' });
	}
});

module.exports = router;