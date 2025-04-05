/**
 * WordCare - UserLogin.js
 */

const { randomUUID } = require('crypto');

class UserLogin {
  constructor(id, name, surname, email, username, password, profileGuid = null) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.username = username;
    this.password = password;
    this.profileGuid = profileGuid || randomUUID(); // if not exists, generate a new GUID
  }
}

module.exports = UserLogin;