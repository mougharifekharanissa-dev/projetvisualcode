// Fichier: server/interface.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; // Port différent pour éviter les conflits

// Servir les fichiers HTML depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Routes API pour l'interface
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Interface Cabinet Psychiatrique',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/patients', (req, res) => {
    res.json([
        { id: 1, nom: 'Dupont', prenom: 'Jean' },
        { id: 2, nom: 'Martin', prenom: 'Claire' }
    ]);
});

app.get('/api/consultations', (req, res) => {
    res.json([
        { id: 1, patientId: 1, date: '2025-01-15', motif: 'Consultation' }
    ]);
});

app.get('/api/references/wilayas', (req, res) => {
    res.json([
        { code: 16, nom: 'Alger' },
        { code: 31, nom: 'Oran' }
    ]);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🏥 INTERFACE CABINET PSYCHIATRIQUE');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📂 Dossier: ${path.join(__dirname, 'public')}`);
    console.log('='.repeat(50));
    console.log('\n📡 Routes API disponibles:');
    console.log('   /api/health');
    console.log('   /api/patients');
    console.log('   /api/consultations');
    console.log('   /api/references/wilayas');
});