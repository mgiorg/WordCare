const express = require('express');
const path = require('path');

const router = express.Router();
const viewsPath = path.join(__dirname, '../../public/views');

router.get('/collegaImmagini', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Giochi/CollegaImmagineCH_C/game.html'));
});

router.get('/completaFrase', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Giochi/CompletaFrase/game.html'));
});

router.get('/conCheSillaba', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Giochi/ConCheSillaba/game.html'));
});

router.get('/giocoCarte', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Giochi/GiocoCarte_BP/game.html'));
});

router.get('/memory', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Giochi/Memory/game.html'));
});

router.get('/tachiscopioParole', (req, res) => {
    res.sendFile(path.join(viewsPath, 'Giochi/Tachiscoscopio_Parole/game.html'));
});

module.exports = router;
