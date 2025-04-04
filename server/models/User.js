////////////////////////////////////////////////////////////////////////////
// WordCare
// User.js
//

class User {
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
