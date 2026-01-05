// server/routes/symptomeRoutes.js
const express = require('express');
const router = express.Router();

console.log('✅ symptomeRoutes.js chargé');

// GET tous les symptômes
router.get('/', (req, res) => {
    try {
        const Cabinet = require('../models/Cabinet');
        const cabinet = Cabinet.getInstance();
        const symptomes = cabinet.listerSymptomes ? cabinet.listerSymptomes() : [];
        console.log(`📋 GET /api/symptomes - ${symptomes.length} symptôme(s)`);
        res.json(symptomes);
    } catch (error) {
        console.error('❌ Erreur GET symptômes:', error);
        res.json([]);
    }
});

// POST créer un symptôme
router.post('/', (req, res) => {
    try {
        console.log('➕ POST /api/symptomes:', req.body);
        
        if (!req.body.nom) {
            return res.status(400).json({ message: 'Le nom est requis' });
        }
        
        const Cabinet = require('../models/Cabinet');
        const cabinet = Cabinet.getInstance();
        
        const newSymptome = cabinet.ajouterSymptome({
            nom: req.body.nom,
            description: req.body.description || '',
            code: req.body.code || '',
            gravite: req.body.gravite || 'modérée'
        });
        
        console.log(`✅ Symptôme créé: ${newSymptome.id}`);
        res.status(201).json(newSymptome);
    } catch (error) {
        console.error('❌ Erreur POST symptômes:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route test
router.get('/test', (req, res) => {
    res.json({ message: 'Routes symptômes fonctionnent!' });
});

module.exports = router;