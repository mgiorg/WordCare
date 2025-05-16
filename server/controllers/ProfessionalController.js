/**
 * WordCare - ProfessionalController.js
 * versione provvisoria da correggere e finire
 */

const UserRepository = require('../repositories/UserRepository');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');
const { db } = require('../database/Database');

module.exports = {
	DatiPersonali: (req, res) => {
		const userId = req.session.userId;
		const query = `
			SELECT u.nome, u.cognome, p.data_nascita, p.specializzazione, p.sede
			FROM user u
			JOIN professionista p ON u.id = p.id
			WHERE u.id = ?
		`;
		db.get(query, [userId], (err, row) => {
			if (err) return res.status(500).json({ error: 'Errore nel recupero dati profilo' });
			if (!row) return res.status(404).json({ error: 'Profilo non trovato' });
			res.json(row);
		});
		},


    SalvaDatiProfilo: (req, res) => {
		const userId = req.session.userId;
		const { nome, cognome, data_nascita, specializzazione, sede } = req.body;

		// Aggiorna tabella User
		const updateUser = `
			UPDATE user
			SET nome = ?, cognome = ?
			WHERE id = ?
		`;
		// Aggiorna tabella Professionista
		const updateProfessionista = `
			UPDATE professionista
			SET data_nascita = ?, specializzazione = ?, sede = ?
			WHERE id = ?
		`;
		db.run(updateUser, [nome, cognome, userId], function (err) {
			if (err) return res.status(500).json({ error: 'Errore aggiornamento utente' });
			db.run(updateProfessionista, [data_nascita, specializzazione, sede, userId], function (err2) {
			if (err2) return res.status(500).json({ error: 'Errore aggiornamento profilo professionista' });
			res.status(200).json({ success: true });
			});
		});
		},

	listPazienti: (req, res) => {
	  const professionalId = req.session.userId;
	  const query = `
		SELECT p.id, p.nome, p.cognome, p.eta, p.patologia
		FROM in_cura ic
		JOIN paziente p ON ic.paziente_id = p.id
		WHERE ic.professionista_id = ?
	  `;
	  db.all(query, [professionalId], (err, rows) => {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.json(rows);
	  });
	},

	aggiungiPaziente: (req, res) => {
		const { id, nome, cognome } = req.body;
		const query = `INSERT INTO paziente (id, nome, cognome) VALUES (?, ?, ?)`;

		db.run(query, [id, nome, cognome], function (err) {
			if (err) return res.status(500).json({ error: 'Errore durante inserimento paziente' });
			res.status(200).json({ success: true });
		});
	}, 

  
	dettaglioPaziente: (req, res) => {
	  // Invia direttamente la pagina HTML, il JS client farà una fetch se serve
	  res.sendFile(path.join(__dirname, '..', 'public', 'professional', 'paziente.html'));
	},
  
	listaAppuntamenti: (req, res) => {
	  const professionalId = req.session.userId;
	  const query = `
		SELECT a.*, p.nome AS paziente_nome, p.cognome AS paziente_cognome
		FROM appuntamento a
		JOIN paziente p ON a.paziente_id = p.id
		WHERE a.professionista_id = ?
	  `;
	  db.all(query, [professionalId], (err, rows) => {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.json(rows);
	  });
	},
  
	creaAppuntamento: (req, res) => {
	  const { paziente_id, data, ora, sede } = req.body;
	  const professionalId = req.session.userId;
	  const query = `
		INSERT INTO appuntamento (paziente_id, professionista_id, data, ora, sede)
		VALUES (?, ?, ?, ?, ?)
	  `;
	  db.run(query, [paziente_id, professionalId, data, ora, sede], function (err) {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.status(200).json({ success: true });
	  });
	},
  
	eliminaAppuntamento: (req, res) => {
	  const id = req.params.id;
	  db.run(`DELETE FROM appuntamento WHERE id = ?`, [id], function (err) {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.status(200).json({ success: true });
	  });
	},
  
	listaGiochi: (req, res) => {
	  db.all(`SELECT * FROM gioco`, [], (err, rows) => {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.json(rows);
	  });
	},
  
	assegnaGioco: (req, res) => {
	  const { gioco_id, paziente_id, scadenza, num_ripetizioni } = req.body;
	  const professionalId = req.session.userId;
	  const query = `
		INSERT INTO assegnazione (gioco_id, paziente_id, professionista_id, scadenza, num_ripetizioni, svolto)
		VALUES (?, ?, ?, ?, ?, 0)
	  `;
	  db.run(query, [gioco_id, paziente_id, professionalId, scadenza, num_ripetizioni], function (err) {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.status(200).json({ success: true });
	  });
	},
  
	listaPromemoria: (req, res) => {
	  const professionalId = req.session.userId;
	  const query = `
		SELECT pr.* 
		FROM promemoria pr
		JOIN post_it pi ON pi.promemoria_id = pr.id
		WHERE pi.professionista_id = ?
	  `;
	  db.all(query, [professionalId], (err, rows) => {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		res.json(rows);
	  });
	},
  
	creaPromemoria: (req, res) => {
	  const professionalId = req.session.userId;
	  const { data, ora_notifica, nota } = req.body;
  
	  const insertPromemoria = `
		INSERT INTO promemoria (data, ora_notifica, nota)
		VALUES (?, ?, ?)
	  `;
	  db.run(insertPromemoria, [data, ora_notifica, nota], function (err) {
		if (err) return res.status(500).json({ error: 'Errore DB' });
		const promemoriaId = this.lastID;
		const linkPostIt = `
		  INSERT INTO post_it (professionista_id, promemoria_id)
		  VALUES (?, ?)
		`;
		db.run(linkPostIt, [professionalId, promemoriaId], function (err2) {
		  if (err2) return res.status(500).json({ error: 'Errore DB' });
		  res.status(200).json({ success: true });
		});
	  });
	},
  };