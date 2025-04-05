/**
 * WordCare - AuthController
 */

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/UserRepository');

/**
 * AuthController handles user authentication and registration.
 */
class AuthController {
  // English: Login function that authenticates a user by comparing input
  // credentials with stored data.
  /**
   * Effettua il login dell'utente.
   * @param {Object} req - Richiesta contenente username e password.
   * @param {Object} res - Risposta da inviare al client.
   */
  async login(req, res) {
    // English: Extract username and password from the request body.
    const { username, password } = req.body;

    try {
      // English: Fetch user data corresponding to the provided username.
      const user = await userRepository.findUserByUsernameAndPassword(username);

      if (!user) {
        // English: If user not found, return an unauthorized response.
        return res
          .status(401)
          .send('Credenziali non valide. <a href="/login">Riprova</a>');
      }

      // English: Compare the input password with the stored hashed password.
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        // English: If the password is incorrect, return an unauthorized response.
        return res
          .status(401)
          .send('Credenziali non valide. <a href="/login">Riprova</a>');
      }

      // English: On successful authentication, redirect the user.
      return res.redirect('/paziente');
    } catch (err) {
      // English: Log the error and return a server error response.
      console.error('Errore durante il login:', err.message);
      return res.status(500).send('Errore del server. Riprova più tardi.');
    }
  }

  // English: Register function that creates a new user with a hashed password.
  /**
   * Registra un nuovo utente.
   * @param {Object} req - Richiesta contenente nome, cognome, email, username e password.
   * @param {Object} res - Risposta da inviare al client.
   */
  async register(req, res) {
    // English: Extract user details from the request body.
    const { nome, cognome, email, username, password } = req.body;

    try {
      // English: Hash the username-provided password before storing it.
      const hashedPassword = await bcrypt.hash(password, 10);

      // English: Create a new user record using the hashed password.
      await userRepository.createUser(nome, cognome, email, username, hashedPassword);

      return res.send('Registrazione completata con successo! <a href="/login">Accedi</a>');
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        // English: Return a bad request if username or email already exists.
        return res
          .status(400)
          .send('Errore: Username o email già esistenti. <a href="/login">Riprova</a>');
      }

      // English: Log the error and return a server error response.
      console.error("Errore durante la registrazione:", err.message);
      return res.status(500).send('Errore del server. Riprova più tardi.');
    }
  }
}

module.exports = new AuthController();
