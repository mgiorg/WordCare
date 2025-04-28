/**
 * WordCare - ProfessionalController.js
 */

const UserRepository = require('../repositories/UserRepository');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');

class ProfessionalController {
	// Managing the flow of the professional dashboard
	// Route: /professionista
	async Professional(req, res) {
		try {
			const userId = req.session.userId;
			const user = await UserRepository.findUserById(userId);
			if (!user) {
				return res.status(404).send('User not found');
			}

			res.sendFile(path.join(__dirname, '../../public/views/Professionista/professionista.html'));
		} catch (err) {
			console.error('Error in professional dashboard:', err);
			res.status(500).send('Internal Server Error');
		}
	}
}