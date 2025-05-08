/**
 * WordCare - ApiRoutes.js
 */

const express = require('express');
const router = express.Router();

router.get('/api/user-info', (req, res) => {
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
router.get('/api/error-info', (req, res) => {
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

module.exports = router;