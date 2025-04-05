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
	return res.json({ nome });
});

module.exports = router;