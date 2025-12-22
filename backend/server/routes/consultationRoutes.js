const express = require('express');
const router = express.Router();

// Données en mémoire (simples, pour tests)
let consultations = [];
let nextId = 1;

// GET toutes les consultations
router.get('/', (req, res) => {
    console.log('✅ GET /api/consultations');
    res.json(consultations);
});

// POST nouvelle consultation
router.post('/', (req, res) => {
    console.log('✅ POST /api/consultations', req.body);
    
    const nouvelleConsultation = {
        id: nextId++,
        patientId: req.body.patientId || 0,
        date: req.body.date || new Date().toISOString(),
        type: req.body.type || 'consultation',
        notes: req.body.notes || '',
        montant: req.body.montant || 0,
        paiement: req.body.paiement || 'impaye'
    };
    
    consultations.push(nouvelleConsultation);
    res.status(201).json(nouvelleConsultation);
});

// GET consultations d'un patient
router.get('/patient/:patientId', (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const patientConsultations = consultations.filter(c => c.patientId === patientId);
    res.json(patientConsultations);
});

// GET statistiques
router.get('/statistiques/mensuelles', (req, res) => {
    const total = consultations.length;
    const totalMontant = consultations.reduce((sum, c) => sum + (c.montant || 0), 0);
    
    const stats = {
        total: total,
        moyenne: total > 0 ? totalMontant / total : 0,
        parMois: {}
    };
    
    res.json(stats);
});

module.exports = router;