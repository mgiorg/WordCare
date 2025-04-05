/**
 * WordCare - User.js
 */

class User {
  // User constructor to initialize properties: id, nome, cognome, email, username, and password
  constructor(id, nome, cognome, email, username, password) {
    this.id = id;
    this.nome = nome;
    this.cognome = cognome;
    this.email = email;
    this.username = username;
    this.password = password;
  }
}

module.exports = User;
