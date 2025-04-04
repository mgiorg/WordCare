////////////////////////////////////////////////////////////////////////////
// WordCare
// authController.js
//

const userRepository = require('../repositories/userRepository');

class AuthController {
  login(req, res) {
    const { username, password } = req.body;

    userRepository.findUserByUsernameAndPassword(username, password, (err, user) => {
      if (err) {
        console.error('Errore durante la query:', err.message);
        return res.status(500).send('Errore del server. Riprova più tardi.');
      }

      if (user) {
        // Login avvenuto con successo
        return res.redirect('/paziente');
      } else {
        // Nessun utente trovato con quelle credenziali
        return res
          .status(401)
          .send('Credenziali non valide. <a href="/login">Riprova</a>');
      }
    });
  }

  register(req, res) {
    const { nome, cognome, email, username, password } = req.body;

    userRepository.createUser(nome, cognome, email, username, password, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res
            .status(400)
            .send('Errore: Username o email già esistenti. <a href="/login">Riprova</a>');
        } else {
          console.error("Errore durante l'inserimento:", err.message);
          return res.status(500).send('Errore del server. Riprova più tardi.');
        }
      }

      // Registrazione ok
      return res.send('Registrazione completata con successo! <a href="/login">Accedi</a>');
    });
  }
}

module.exports = new AuthController();
