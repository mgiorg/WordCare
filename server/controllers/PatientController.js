/**
 * WordCare - PatientController.js
 */

const UserLoginRepository = require('../repositories/UserLoginRepository');
const UserProfileRepository = require('../repositories/UserProfileRepository');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');

class PatientController {
	// Managing the flow of the patient dashboard
	// Route: /paziente
	async Patient(req, res) {
		try {
			// Find the UserLogin by userId
			const userId = req.session.userId;
			const user = await UserLoginRepository.findById(userId);
			if (!user) {
				return res.status(404).send('User not found');
			}

			// Retrieve the related UserProfile by GUID
			const profile = await UserProfileRepository.getByGuid(user.profileGuid);
			if (!profile) {
				return res.status(404).send('Profile not found');
			}

			// Render the patient view with user and profile data
			res.sendFile(path.join(__dirname, '../../public/views/Paziente/paziente.html'));

		} catch (err) {
			console.error('Error in patient dashboard:', err);
			res.status(500).send('Internal Server Error');
		}
	}
}

module.exports = new PatientController();
