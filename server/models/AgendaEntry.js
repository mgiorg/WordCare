/**
 * Domain Model: AgendaEntry
 * Rappresenta un appunto/nota nella tabella Agenda.
 */
class AgendaEntry {
    /**
     * @param {Object} params
     * @param {number} params.id - ID univoco della nota
     * @param {number} params.paziente - ID del paziente proprietario
     * @param {string} params.data - Data in formato 'YYYY-MM-DD'
     * @param {string} params.titolo - Titolo della nota
     * @param {string} params.note - Contenuto della nota
     * @param {number|boolean} params.segnalazione - Flag (0|1 o boolean) di segnalazione al professionista
     */
    constructor({ id = null, paziente, data, titolo, note, segnalazione = 0 }) {
        this.id = id;
        this.paziente = paziente;
        this.data = data;
        this.titolo = titolo;
        this.note = note;
        // Normalizza segnalazione a boolean
        this.segnalazione = Boolean(Number(segnalazione));
    }

    /**
     * Restituisce l'oggetto pronto per il salvataggio in DB
     * @returns {Array} [paziente, data, titolo, note, segnalazione]
     */
    toDbParams() {
        return [
            this.paziente,
            this.data,
            this.titolo,
            this.note,
            this.segnalazione ? 1 : 0
        ];
    }

    /**
     * Costruisce una istanza di AgendaEntry da una riga DB (row)
     * @param {Object} row - Oggetto proveniente da sqlite (id, paziente, data, titolo, note, segnalazione)
     * @returns {AgendaEntry}
     */
    static fromRow(row) {
        return new AgendaEntry({
            id: row.id,
            paziente: row.paziente,
            data: row.data,
            titolo: row.titolo,
            note: row.note,
            segnalazione: row.segnalazione
        });
    }
}

module.exports = AgendaEntry;
