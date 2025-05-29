/**
 * WordCare - AuthController (completo con redirect corretti)
 */

const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const PatientRepository = require('../repositories/PatientRepository');
const ProfessionalRepository = require('../repositories/ProfessionalRepository');
const Behavior = require('../models/enums/ProfileBehavior');

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await UserRepository.findUserByUsername(username);
      if (!user) {
        const params = new URLSearchParams({
          code: '401',
          title: 'Accesso negato',
          message: 'Le credenziali fornite non sono valide. Nessun utente trovato con questo username.',
          returnUrl: '/login'
        });
        return res.redirect(`/error.html?${params.toString()}`);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        const params = new URLSearchParams({
          code: '401',
          title: 'Accesso negato',
          message: 'La password non corrisponde a quella in nostro possesso.',
          returnUrl: '/login'
        });
        return res.redirect(`/error.html?${params.toString()}`);
      }

      req.session.userId = user.id;
      req.session.userRole = user.behavior;

      if (user.behavior === Behavior.Patient) {
        const patient = await PatientRepository.findByUserId(user.id);
        req.session.patientId = patient.id;
        req.session.userName = patient.nome;
        req.session.userSurname = patient.cognome;
        return res.redirect('/paziente');
      } else if (user.behavior === Behavior.Professional) {
        const professional = await ProfessionalRepository.findByUserId(user.id);
        if (!professional) {
          const params = new URLSearchParams({
            code: '404',
            title: 'Profilo non trovato',
            message: 'Profilo professionista non trovato.',
            returnUrl: '/login'
          });
          return res.redirect(`/error.html?${params.toString()}`);
        }
        req.session.professionalId = professional.id;
        req.session.userName = professional.nome;
        req.session.userSurname = professional.cognome;
        return res.redirect('/professionista/home');
      } else {
        const params = new URLSearchParams({
          code: '500',
          title: 'Accesso negato',
          message: 'Ruolo utente non riconosciuto.',
          returnUrl: '/login'
        });
        return res.redirect(`/error.html?${params.toString()}`);
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      const params = new URLSearchParams({
        code: '500',
        title: 'Errore login',
        message: 'Errore durante il login. Riprova più tardi.',
        returnUrl: '/login'
      });
      return res.redirect(`/error.html?${params.toString()}`);
    }
  }

  async register(req, res) {
    const { name, surname, email, username, password, userType } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const behavior = userType === 'professional' ? Behavior.Professional : Behavior.Patient;
      const newUser = { email, username, password: hashedPassword, behavior };

      const userId = await UserRepository.createUser(newUser);

      if (behavior === Behavior.Patient) {
        const patient = {
          user_id: userId,
          nome: name,
          cognome: surname,
          data_nascita: null,
          patologia: null,
        };
        const patientId = await PatientRepository.new(patient);
        req.session.userId = userId;
        req.session.userRole = behavior;
        req.session.patientId = patientId;
        req.session.userName = patient.nome;
        req.session.userSurname = patient.cognome;
        return res.redirect('/paziente');
      } else {
        const professionalId = await ProfessionalRepository.new(
          userId,
          name,
          surname,
          null,
          null,
          null
        );
        req.session.userId = userId;
        req.session.userRole = behavior;
        req.session.professionalId = professionalId;
        req.session.userName = name;
        req.session.userSurname = surname;
        return res.redirect('/professionista/home');
      }
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        const params = new URLSearchParams({
          code: '404',
          title: 'Errore',
          message: 'Email o username già esistente.',
          returnUrl: '/login'
        });
        return res.redirect(`/error.html?${params.toString()}`);
      }
      console.error('Errore durante la registrazione:', err);
      const params = new URLSearchParams({
        code: '400',
        title: 'Errore registrazione',
        message: 'Errore imprevisto durante la registrazione.',
        returnUrl: '/login'
      });
      return res.redirect(`/error.html?${params.toString()}`);
    }
  }

  async logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error('Errore durante il logout:', err);
        const params = new URLSearchParams({
          code: '500',
          title: 'Errore logout',
          message: 'Errore durante il logout. Riprova.',
          returnUrl: '/login'
        });
        return res.redirect(`/error.html?${params.toString()}`);
      }
      res.redirect('/login');
    });
  }
}

module.exports = new AuthController();
