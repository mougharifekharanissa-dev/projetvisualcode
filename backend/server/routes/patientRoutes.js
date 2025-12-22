const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Chemin vers les données
const dataDir = path.join(__dirname, '..', '..', 'data');

// GET tous les patients
router.get('/', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'patients.json');
        
        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        const patients = JSON.parse(data);
        res.json(patients);
    } catch (error) {
        console.error('Erreur GET patients:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET patient par ID
router.get('/:id', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'patients.json');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Patient non trouvé' });
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        const patients = JSON.parse(data);
        const patient = patients.find(p => p.id === req.params.id);
        
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ error: 'Patient non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST créer un patient
router.post('/', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'patients.json');
        let patients = [];
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            patients = JSON.parse(data);
        }
        
        const newPatient = {
            id: Date.now().toString(),
            ...req.body,
            dateInscription: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        patients.push(newPatient);
        
        fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf8');
        
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT modifier un patient
router.put('/:id', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'patients.json');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Patient non trouvé' });
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        let patients = JSON.parse(data);
        const index = patients.findIndex(p => p.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Patient non trouvé' });
        }
        
        patients[index] = {
            ...patients[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf8');
        
        res.json(patients[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE supprimer un patient
router.delete('/:id', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'patients.json');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Patient non trouvé' });
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        let patients = JSON.parse(data);
        const initialLength = patients.length;
        
        patients = patients.filter(p => p.id !== req.params.id);
        
        if (patients.length === initialLength) {
            return res.status(404).json({ error: 'Patient non trouvé' });
        }
        
        fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf8');
        
        res.json({ message: 'Patient supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recherche de patients
router.get('/recherche/:term', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'patients.json');
        
        if (!fs.existsSync(filePath)) {
            return res.json([]);
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        const patients = JSON.parse(data);
        const term = req.params.term.toLowerCase();
        
        const filtered = patients.filter(patient => {
            const searchString = `${patient.nom || ''} ${patient.prenom || ''} ${patient.cin || ''} ${patient.telephone || ''}`.toLowerCase();
            return searchString.includes(term);
        });
        
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;