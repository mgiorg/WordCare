/**
 * WordCare - App.js
 */

// Initialize Express app and database connection
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/AuthRoutes');
const { initDb } = require('./database/Database');

const app = express();
const PORT = 3000;

// Initialize the database (create tables if they do not exist)
initDb();

// Set up middleware to parse URL-encoded and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // per payload JSON
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', authRoutes);

// Start the server and listen on the defined port
app.listen(PORT, () => {
  // Log server status to the console
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

