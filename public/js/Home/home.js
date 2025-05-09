// Attendi che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function () {
	// ===== INIZIALIZZAZIONE GSAP =====
	gsap.registerPlugin(ScrollTrigger);

	// ===== MENU MOBILE =====
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');

	menuToggle.addEventListener('click', function () {
		navLinks.classList.toggle('active');
		this.querySelector('i').classList.toggle('fa-bars');
		this.querySelector('i').classList.toggle('fa-times');
	});

	// ===== HEADER SCROLL =====
	const header = document.querySelector('header');
	window.addEventListener('scroll', function () {
		if (window.scrollY > 100) {
			header.style.background = 'rgba(255, 255, 255, 0.95)';
			header.style.boxShadow = 'var(--shadow-md)';
		} else {
			header.style.background = 'var(--white)';
			header.style.boxShadow = 'var(--shadow-sm)';
		}
	});

	// ===== BACK TO TOP BUTTON =====
	const backToTopBtn = document.querySelector('.back-to-top');
	window.addEventListener('scroll', function () {
		if (window.scrollY > 500) {
			backToTopBtn.classList.add('show');
		} else {
			backToTopBtn.classList.remove('show');
		}
	});

	backToTopBtn.addEventListener('click', function (e) {
		e.preventDefault();
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

// ===== TESTIMONIANZE SLIDER =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

// Inizializza la prima slide
showSlide(0);

// Pulsanti freccia
prevBtn.addEventListener('click', () => {
    let newIndex = currentSlide - 1;
    if (newIndex < 0) newIndex = testimonialCards.length - 1;
    showSlide(newIndex);
});

nextBtn.addEventListener('click', () => {
    let newIndex = currentSlide + 1;
    if (newIndex >= testimonialCards.length) newIndex = 0;
    showSlide(newIndex);
});

// Dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Scorrimento automatico
let slideInterval = setInterval(() => {
    let newIndex = (currentSlide + 1) % testimonialCards.length;
    showSlide(newIndex);
}, 5000);

// Pausa su hover
const testimonialSlider = document.querySelector('.testimonials-slider');
testimonialSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
testimonialSlider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => {
        let newIndex = (currentSlide + 1) % testimonialCards.length;
        showSlide(newIndex);
    }, 5000);
});

	// ===== COOKIE BANNER =====
	const cookieBanner = document.querySelector('.cookie-banner');
	const acceptCookies = document.querySelector('.accept-cookies');
	const declineCookies = document.querySelector('.decline-cookies');

	// Mostra il banner se l'utente non ha ancora accettato i cookie
	if (!localStorage.getItem('cookiesAccepted')) {
		setTimeout(function () {
			cookieBanner.classList.add('show');
		}, 1000);
	}

	// Evento per accettare i cookie
	acceptCookies.addEventListener('click', function () {
		localStorage.setItem('cookiesAccepted', 'true');
		cookieBanner.classList.remove('show');
	});

	// Evento per rifiutare i cookie
	declineCookies.addEventListener('click', function () {
		localStorage.setItem('cookiesAccepted', 'false');
		cookieBanner.classList.remove('show');
	});

	// ===== ANIMAZIONI =====
	// Animazione lettere fluttuanti nella hero section
	gsap.to('.letter-a', {
		y: -30,
		rotation: 10,
		duration: 4,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	gsap.to('.letter-b', {
		y: -20,
		rotation: -5,
		duration: 3.5,
		delay: 0.5,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	gsap.to('.letter-c', {
		y: -25,
		rotation: 8,
		duration: 4.5,
		delay: 1,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	// Animazione elementi fluttuanti nella sezione CTA
	gsap.to('.speech-bubble-1', {
		y: -20,
		rotation: -5,
		duration: 4,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	gsap.to('.speech-bubble-2', {
		y: -15,
		rotation: 3,
		duration: 3.5,
		delay: 0.7,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	gsap.to('.speech-bubble-3', {
		y: -25,
		rotation: -8,
		duration: 5,
		delay: 1.5,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	// Animazione speech bubble nel logo
	gsap.to('.speech-bubble', {
		y: -5,
		duration: 1.5,
		repeat: -1,
		yoyo: true,
		ease: 'sine.inOut'
	});

	// Animazione al caricamento degli elementi al scroll
	// Service Cards
	gsap.utils.toArray('.service-card').forEach((card, i) => {
		gsap.from(card, {
			opacity: 0,
			y: 50,
			delay: i * 0.2,
			duration: 1,
			scrollTrigger: {
				trigger: card,
				start: 'top 80%',
				once: true
			}
		});
	});

	// Features
	gsap.utils.toArray('.feature').forEach((feature, i) => {
		gsap.from(feature, {
			opacity: 0,
			y: 30,
			delay: i * 0.2,
			duration: 1,
			scrollTrigger: {
				trigger: feature,
				start: 'top 80%',
				once: true
			}
		});
	});

	// ===== SMOOTH SCROLL PER LINK INTERNI =====
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();

			// Chiudi il menu mobile se aperto
			if (navLinks.classList.contains('active')) {
				navLinks.classList.remove('active');
				menuToggle.querySelector('i').classList.toggle('fa-bars');
				menuToggle.querySelector('i').classList.toggle('fa-times');
			}

			// Scroll alla sezione target
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				window.scrollTo({
					top: target.offsetTop - 80, // Offset per lo header fisso
					behavior: 'smooth'
				});
			}
		});
	});

	// ===== ANIMAZIONE AL HOVER SUI SERVIZI =====
	// Aggiungiamo un effetto di hover con GSAP
	const serviceCards = document.querySelectorAll('.service-card');

	serviceCards.forEach(card => {
		card.addEventListener('mouseenter', function () {
			gsap.to(this.querySelector('.service-icon'), {
				rotation: 360,
				duration: 0.8,
				backgroundColor: 'var(--primary-color)',
				color: 'var(--white)'
			});

			gsap.to(this.querySelector('h3'), {
				color: 'var(--primary-color)',
				duration: 0.3
			});
		});

		card.addEventListener('mouseleave', function () {
			gsap.to(this.querySelector('.service-icon'), {
				rotation: 0,
				duration: 0.8,
				backgroundColor: 'rgba(74, 109, 229, 0.1)',
				color: 'var(--primary-color)'
			});

			gsap.to(this.querySelector('h3'), {
				color: 'var(--dark)',
				duration: 0.3
			});
		});
	});

	// ===== EFFETTO DI PARALLAX SUL HERO =====
	window.addEventListener('scroll', function () {
		const scrollY = window.scrollY;
		const heroSection = document.querySelector('.hero');
		const heroImage = document.querySelector('.hero-image');
		const heroContent = document.querySelector('.hero-content');

		if (heroSection && heroImage && heroContent) {
			const scrollY = window.scrollY;

			if (scrollY <= heroSection.offsetHeight) {
				const translateY = scrollY * 0.3;
				heroImage.style.transform = `translateY(${translateY}px)`;
				heroContent.style.transform = `translateY(${translateY * 0.5}px)`;
			}
		}
	});

	// ===== EFFETTO TYPING SUL TITOLO =====
	// Simuliamo un effetto di digitazione sul sottotitolo della hero
	const heroSubtitle = document.querySelector('.hero p');
	const originalText = heroSubtitle.textContent;
	heroSubtitle.textContent = '';

	setTimeout(() => {
		let i = 0;
		const typeEffect = setInterval(() => {
			if (i < originalText.length) {
				heroSubtitle.textContent += originalText.charAt(i);
				i++;
			} else {
				clearInterval(typeEffect);
			}
		}, 50);
	}, 1000); // Ritardo per far partire l'effetto dopo le altre animazioni
});