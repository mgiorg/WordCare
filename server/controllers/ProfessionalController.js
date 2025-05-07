/**
 * WordCare - ProfessionalController.js
 * versione provvisoria da correggere e finire
 */

const UserRepository = require('../repositories/UserRepository');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');
const { db } = require('../database/Database');

module.exports = {
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