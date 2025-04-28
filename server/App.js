// Inizializzazione Express e moduli
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDb } = require('./database/Database');

// Importazione delle route
const authRoutes = require('./routes/AuthRoutes');
const patientRoutes = require('./routes/PatientRoutes');
const professionalRoutes = require('./routes/ProfessionalRoutes');
const apiRoutes = require('./routes/ApiRoutes');

const app = express();
const PORT = 3000;
const MAX_AGE_SESSION = 1000 * 60 * 60; // 1 ora

// Inizializza il database
initDb();

// Middleware di parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware (deve venire PRIMA di qualsiasi route)
app.use(session({
	secret: 'wordcare_secret_session', // cambia con una chiave sicura in produzione
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: MAX_AGE_SESSION
	}
}));

// Registrazione delle route (dopo che la sessione è attiva)
app.use('/', authRoutes);
app.use('/paziente', patientRoutes);
app.use('/professionista', professionalRoutes);
app.use('/', apiRoutes);

// Avvio server
app.listen(PORT, () => {
	console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
