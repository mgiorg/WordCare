/**
 * WordCare - Paziente.js
 */

class Paziente {
	constructor(id, user_id, nome, cognome, eta, data_nascita, patologia) {
		this.id = id;
		this.user_id = user_id;
		this.nome = nome;
		this.cognome = cognome;
		this.eta = eta;
		this.data_nascita = data_nascita;
		this.patologia = patologia;
	}
}

module.exports = Paziente;