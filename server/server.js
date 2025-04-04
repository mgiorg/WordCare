////////////////////////////////////////////////////////////////////////////
// WordCare
// server.js
//

const express = require('express');
const path = require('path');
// Puoi usare express.urlencoded invece di body-parser
// (body-parser è incorporato in express da diverse versioni).
// Se vuoi proprio body-parser, va bene, ma ecco la versione moderna:
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

// Middleware per i dati provenienti da form HTML
app.use(express.urlencoded({ extended: true }));

// Middleware per servire file statici (CSS, JS, immagini, ecc.)
app.use(express.static(path.join(__dirname, '../public')));

// Associa le rotte
app.use('/', authRoutes);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
