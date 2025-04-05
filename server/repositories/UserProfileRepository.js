/**
 * WordCare - UserProfileRepository.js
 */
const { db } = require('../database/Database');
const UserProfile = require('../models/UserProfile');

class UserProfileRepository {
	/**
	 * Crea un nuovo profilo vuoto nel database.
	 * @param {string} profileGuid - GUID del profilo.
	 * @param {string} behavior - Comportamento dell'utente.
	 * @returns {Promise<UserProfile>} L'oggetto UserProfile creato.
	 */
	async createEmptyProfile(profileGuid, behavior) {
		const profile = new UserProfile(
			profileGuid,
			behavior,
			null, // bio
			null, // avatarUrl
			null, // city
			null, // country
			null, // phone
			null, // birthDate
			null, // lastVisit
			null, // specialization
			null, // clinicName
			null  // licenseNumber
		);

		await this.createProfile(profile);
		return profile;
	}

	/**
	 * Crea un nuovo profilo utente nel database.
	 * @param {UserProfile} profile - Oggetto UserProfile da creare.
	 * @returns {Promise<string>} GUID del profilo creato.
   */
	async createProfile(profile) {
		const query = `
		INSERT INTO UserProfile (
			profileGuid, behavior, bio, avatarUrl,
			city, country, phone, birthDate,
			lastVisit, specialization, clinicName, licenseNumber
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		return new Promise((resolve, reject) => {
			db.run(query, [
				profile.profileGuid,
				profile.behavior,
				profile.bio,
				profile.avatarUrl,
				profile.city,
				profile.country,
				profile.phone,
				profile.birthDate,
				profile.lastVisit,
				profile.specialization,
				profile.clinicName,
				profile.licenseNumber
			], function (err) {
				if (err) return reject(err);
				resolve(profile.profileGuid);
			});
		});
	}

	/**
	 * Trova un profilo utente in base al GUID.
	 * @param {string} profileGuid - GUID del profilo.
	 * @returns {Promise<UserProfile|null>} L'oggetto UserProfile se trovato, altrimenti null.
	 */
	async getByGuid(profileGuid) {
		const query = `SELECT * FROM UserProfile WHERE profileGuid = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [profileGuid], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const profile = new UserProfile(
					row.profileGuid,
					row.behavior,
					row.bio,
					row.avatarUrl,
					row.city,
					row.country,
					row.phone,
					row.birthDate,
					row.lastVisit,
					row.specialization,
					row.clinicName,
					row.licenseNumber
				);
				resolve(profile);
			});
		});
	}

	/**
	 * Aggiornamento del profilo utente nel database
	 * @param {UserProfile} profile - Oggetto profilo da inserire
	 * @returns {Promise<UserProfile[]>} Array di oggetti UserProfile.
	 */
	async updateProfile(profile) {
		const query = `
		UPDATE UserProfile
		SET behavior = ?, bio = ?, avatarUrl = ?,
			city = ?, country = ?, phone = ?, birthDate = ?,
			lastVisit = ?, specialization = ?, clinicName = ?, licenseNumber = ?
		WHERE profileGuid = ?
		`;

		return new Promise((resolve, reject) => {
			db.run(query, [
				profile.bio,
				profile.avatarUrl,
				profile.city,
				profile.country,
				profile.phone,
				profile.birthDate,
				profile.lastVisit,
				profile.specialization,
				profile.clinicName,
				profile.licenseNumber,
				profile.profileGuid
			], function (err) {
				if (err) return reject(err);
				resolve(this.changes > 0);
			});
		});
	}

	/**
	 * Elimina un profilo utente nel database.
	 * @param {string} profileGuid - GUID del profilo da eliminare.
	 * @returns {Promise<boolean>} true se il profilo è stato eliminato, false altrimenti.
	 */
	async deleteProfile(profileGuid) {
		const query = `DELETE FROM UserProfile WHERE profileGuid = ?`;

		return new Promise((resolve, reject) => {
			db.run(query, [profileGuid], function (err) {
				if (err) return reject(err);
				resolve(this.changes > 0);
			});
		});
	}
}

module.exports = new UserProfileRepository();
