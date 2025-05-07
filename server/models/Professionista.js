/**
 * WordCare - Professionista.js
 */

class Professionista {
	constructor(id, user_id, nome, cognome, data_nascita, specializzazione, sede) {
		this.id = id;
		this.user_id = user_id;
		this.nome = nome;
		this.cognome = cognome;
		this.data_nascita = data_nascita;
		this.specializzazione = specializzazione;
		this.sede = sede;
	}
}

module.exports = Professionista;