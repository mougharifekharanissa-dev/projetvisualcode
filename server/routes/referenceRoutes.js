// server/routes/referenceRoutes.js
const express = require('express');
const router = express.Router();
const Cabinet = require('../../models/Cabinet');

// GET wilayas
router.get('/wilayas', (req, res) => {
    try {
        res.json(Cabinet.instance.wilayas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET communes par wilaya
router.get('/wilayas/:wilayaCode/communes', (req, res) => {
    try {
        const communes = Cabinet.instance.obtenirCommunesParWilaya(req.params.wilayaCode);
        res.json(communes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET professions
router.get('/professions', (req, res) => {
    try {
        res.json(Cabinet.instance.professions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;