/**
 * Reindirizza alla pagina di errore con parametri in query string.
 * @param {string} code Codice errore (es. '404', '500')
 * @param {string} title Titolo dell'errore
 * @param {string} message Messaggio descrittivo
 * @param {string} returnUrl URL per il pulsante "Riprova"
 */
function goToErrorPage(code, title, message, returnUrl) {
    const params = new URLSearchParams({
        code,
        title,
        message,
        returnUrl
    });
    window.location.href = `/error.html?${params.toString()}`;
}

function convertiDataInFormatoItaliano(dataISO) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) return 'Data non valida';

    const [anno, mese, giorno] = dataISO.split('-');
    return `${giorno}-${mese}-${anno}`;
}