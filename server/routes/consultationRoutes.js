// server/routes/consultationRoutes.js
const express = require('express');
const router = express.Router();
const Cabinet = require('../../models/Cabinet');

// GET toutes les consultations
router.get('/', (req, res) => {
    try {
        const consultations = Cabinet.instance.consultations;
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET consultations d'un patient
router.get('/patient/:patientId', (req, res) => {
    try {
        const consultations = Cabinet.instance.obtenirConsultationsPatient(req.params.patientId);
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST créer une consultation
router.post('/', async (req, res) => {
    try {
        const nouvelleConsultation = Cabinet.instance.ajouterConsultation(req.body);
        await Cabinet.instance.sauvegarderConsultations();
        res.status(201).json(nouvelleConsultation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET statistiques
router.get('/statistiques/mensuelles', (req, res) => {
    try {
        const stats = Cabinet.instance.obtenirStatistiquesMensuelles();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;