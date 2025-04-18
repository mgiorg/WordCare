/**
 * WordCare - UserLogin.js
 */

const Behavior = require('./enums/ProfileBehavior');

class UserProfile {
	constructor(
		profileGuid,
		behavior,          		// "PATIENT" o "PROFESSIONAL"
		bio = '',          		// breve descrizione personale o professionale
		avatarUrl = '',    		// URL della foto profilo
		city = '',         		// città di residenza
		country = '',      		// stato
		phone = '',        		// numero di telefono
		birthDate = '',    		// data di nascita (formato ISO string)
		lastVisit = '',    		// ultima visita in clinica (solo per pazienti)
		specialization = '', 	// specializzazione (solo per professionisti)
		clinicName = '',   		// nome della clinica o struttura (solo per professionisti)
		licenseNumber = '' 		// numero di licenza medica (solo per professionisti)
	) {
		this.profileGuid = profileGuid;
		this.behavior = behavior;
		this.bio = bio;
		this.avatarUrl = avatarUrl;
		this.city = city;
		this.country = country;
		this.phone = phone;
		this.birthDate = birthDate;
		this.lastVisit = lastVisit;
		this.specialization = specialization;
		this.clinicName = clinicName;
		this.licenseNumber = licenseNumber;
	}
}

module.exports = UserProfile;