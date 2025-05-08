/**
 * WordCare - Appuntamento.js
 */

class Appuntamento {
	constructor(id, paziente, professionista, data, ora, sede) {
		this.id = id;
		this.paziente = paziente;
		this.professionista = professionista;
		this.data = data;
		this.ora = ora;
		this.sede = sede;
	}
}

module.exports = Appuntamento;