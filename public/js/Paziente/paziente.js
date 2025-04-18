// script.js - dinamiche dashboard paziente

document.addEventListener("DOMContentLoaded", () => {
	initAvatarDropdown();
	loadUserName();
});

function initAvatarDropdown() {
	const avatar = document.querySelector(".navbar-avatar");
	avatar.addEventListener("click", () => {
		const dropdown = document.querySelector(".avatar-dropdown");
		dropdown.classList.toggle("active");
	});
}

function loadUserName() {
	fetch('/api/user-info')
		.then(res => {
			console.log('Stato risposta:', res.status); // 👈 stampa il codice
			if (!res.ok) {
				throw new Error('Errore nella risposta del server');
			}
			return res.json();
		})
		.then(data => {
			console.log('Dati ricevuti:', data); // 👈 utile per debug
			const userNameDiv = document.querySelector('.avatar-dropdown .user-name');
			const titleDiv = document.querySelector('.patient-title');
			if (titleDiv) {
				titleDiv.textContent = `Dashboard di ${data.nome}`;
			}
			if (userNameDiv) {
				userNameDiv.textContent = `Ciao, ${data.nome}`;
			}
		})
		.catch(err => console.error('Errore nel recupero del nome utente:', err));
}

