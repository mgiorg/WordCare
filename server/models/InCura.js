/**
 * WordCare - InCura.js
 */

class InCura {
	constructor(paziente, professionista, data_inizio, data_fine, note) {
		this.paziente = paziente;
		this.professionista = professionista;
		this.data_inizio = data_inizio;
		this.data_fine = data_fine;
		this.note = note;
	}
}

module.exports = InCura;