// Abilita modifica dei campi eccetto la prima riga
const officeInput = document.getElementById('office');
const degreesInput = document.getElementById('degrees');
const contactsTextarea = document.getElementById('contacts');

// Gestione upload foto profilo
const photoInput = document.getElementById('photo-input');
const profilePhoto = document.getElementById('profile-photo');
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      profilePhoto.src = event.target.result;
    }
    reader.readAsDataURL(file);
  }
});

// Gestione CV
const toggleCvBtn = document.getElementById('toggle-cv');
const cvInput = document.getElementById('cv-input');
toggleCvBtn.addEventListener('click', () => {
  if (cvInput.style.display === 'none') {
    cvInput.style.display = 'block';
  } else {
    cvInput.click();
  }
});
cvInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    toggleCvBtn.textContent = 'Visualizza CV';
    // opzionale: mostra anteprima o link per download
    const url = URL.createObjectURL(file);
    let link = document.getElementById('cv-link');
    if (!link) {
      link = document.createElement('a');
      link.id = 'cv-link';
      link.target = '_blank';
      toggleCvBtn.insertAdjacentElement('afterend', link);
    }
    link.href = url;
    link.textContent = file.name;
  }
});
