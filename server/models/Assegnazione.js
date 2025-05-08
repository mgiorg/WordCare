/**
 * WordCare - Assegnazione.js
 */

class Assegnazione {
	constructor(id, paziente, professionista, gioco, scadenza, ripetizioni_assegnate, svolto, ripetizioni_svolte, punteggio) {
		this.id = id;
		this.paziente = paziente;
		this.professionista = professionista;
		this.gioco = gioco;
		this.scadenza = scadenza;
		this.ripetizioni_assegnate = ripetizioni_assegnate;
		this.svolto = svolto;
		this.ripetizioni_svolte = ripetizioni_svolte;
		this.punteggio = punteggio;
	}
}

module.exports = Assegnazione;