/**
 * WordCare - ProfessionalController.js 
 */

const path = require('path');
const UserRepository = require('../repositories/UserRepository');
const ProfessionalRepository = require('../repositories/ProfessionalRepository');
const AppuntamentoRepository = require('../repositories/AppuntamentoRepository');
const Behavior = require('../models/enums/ProfileBehavior');

class ProfessionalController {
  async DatiPersonali(req, res) {
    try {
      const userId = req.session.userId;
      const dati = await ProfessionalRepository.getProfiloCompleto(userId);
      if (!dati) return res.status(404).json({ error: 'Profilo non trovato' });
      res.json(dati);
    } catch (err) {
      res.status(500).json({ error: 'Errore nel recupero dati profilo' });
    }
  }

  async SalvaDatiProfilo(req, res) {
    try {
      const userId = req.session.userId;
      const success = await ProfessionalRepository.salvaProfilo(userId, req.body);
      if (!success) return res.status(500).json({ error: 'Errore salvataggio profilo' });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Errore aggiornamento dati' });
    }
  }

  async listPazienti(req, res) {
    try {
      const professionalId = req.session.userId;
      const pazienti = await ProfessionalRepository.getPazientiInCura(professionalId);
      res.json(pazienti);
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async aggiungiPaziente(req, res) {
    try {
      await ProfessionalRepository.aggiungiPaziente(req.body);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Errore durante inserimento paziente' });
    }
  }

  dettaglioPaziente(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'professional', 'paziente.html'));
  }

  async listaAppuntamenti(req, res) {
    try {
      const professionalId = req.session.userId;
      const appuntamenti = await AppuntamentoRepository.getByProfessionistaId(professionalId);
      res.json(appuntamenti);
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async creaAppuntamento(req, res) {
    try {
      const professionalId = req.session.userId;
      await AppuntamentoRepository.crea({ ...req.body, professionalId });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async eliminaAppuntamento(req, res) {
    try {
      await AppuntamentoRepository.elimina(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async listaGiochi(req, res) {
    try {
      const giochi = await ProfessionalRepository.getListaGiochi();
      res.json(giochi);
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async assegnaGioco(req, res) {
    try {
      const professionalId = req.session.userId;
      await ProfessionalRepository.assegnaGioco({ ...req.body, professionalId });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async listaPromemoria(req, res) {
    try {
      const professionalId = req.session.userId;
      const promemoria = await ProfessionalRepository.getPromemoria(professionalId);
      res.json(promemoria);
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }

  async creaPromemoria(req, res) {
    try {
      const professionalId = req.session.userId;
      await ProfessionalRepository.creaPromemoria({ ...req.body, professionalId });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Errore DB' });
    }
  }
}

module.exports = new ProfessionalController();
