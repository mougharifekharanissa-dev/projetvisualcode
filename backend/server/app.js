// server/app.js - Version corrigée
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

console.log('🔧 Configuration du serveur Express...');

const app = express();

// ========== MIDDLEWARE ==========
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ========== FICHIERS STATIQUES ==========
const publicPath = path.join(__dirname, 'public');
if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });
app.use(express.static(publicPath));

// ========== CHARGEMENT DES ROUTES ==========
console.log('🔄 Chargement des routes API...');

// Liste des routes à charger
const routesConfig = [
    { file: './routes/patientRoutes', endpoint: '/api/patients' },
    { file: './routes/consultationRoutes', endpoint: '/api/consultations' },
    { file: './routes/referenceRoutes', endpoint: '/api/references' },
    { file: './routes/symptomeRoutes', endpoint: '/api/symptomes' }
];

routesConfig.forEach(config => {
    try {
        const routeName = path.basename(config.file, '.js');
        console.log(`📁 Chargement ${routeName}...`);
        
        const router = require(config.file);
        app.use(config.endpoint, router);
        
        console.log(`✅ ${config.endpoint} montée`);
    } catch (error) {
        console.error(`❌ Erreur ${config.file}:`, error.message);
        
        // Route de secours pour éviter 404
        app.get(config.endpoint, (req, res) => {
            res.json({ 
                message: `Route ${path.basename(config.file, '.js')} en cours de configuration`,
                error: error.message,
                timestamp: new Date()
            });
        });
    }
});

// ========== ROUTES SYMPTÔMES DE SECOURS (À RETIRER APRÈS) ==========
console.log('🩺 Ajout routes symptômes de secours...');

// Route GET symptômes
app.get('/api/symptomes', (req, res) => {
    console.log('📋 GET /api/symptomes appelé');
    res.json([
        { id: 'symp_1', nom: 'Fièvre', description: 'Température élevée', gravite: 'modérée' },
        { id: 'symp_2', nom: 'Toux', description: 'Toux sèche', gravite: 'légère' }
    ]);
});

// Route POST symptômes
app.post('/api/symptomes', (req, res) => {
    console.log('➕ POST /api/symptomes appelé avec:', req.body);
    
    if (!req.body.nom) {
        return res.status(400).json({ message: 'Le nom est requis' });
    }
    
    const newSymptome = {
        id: 'symp_' + Date.now(),
        nom: req.body.nom,
        description: req.body.description || '',
        code: req.body.code || '',
        gravite: req.body.gravite || 'modérée',
        dateCreation: new Date()
    };
    
    res.status(201).json(newSymptome);
});

// ========== ROUTE DE SANTÉ ==========
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Serveur Cabinet Psychiatrique',
        timestamp: new Date().toISOString(),
        routes: {
            patients: '/api/patients',
            consultations: '/api/consultations', 
            references: '/api/references',
            symptomes: '/api/symptomes'  // <-- Maintenant incluse
        }
    });
});

// ========== ROUTE RACINE ==========
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Cabinet Psychiatrique</title></head>
        <body style="font-family: Arial; padding: 40px;">
            <h1>🏥 Cabinet Psychiatrique - API</h1>
            <h3>Routes disponibles:</h3>
            <ul>
                <li><a href="/api/health">/api/health</a> - Santé du serveur</li>
                <li><a href="/api/patients">/api/patients</a> - Patients</li>
                <li><a href="/api/consultations">/api/consultations</a> - Consultations</li>
                <li><a href="/api/symptomes">/api/symptomes</a> - <strong>Symptômes (TEST)</strong></li>
            </ul>
            <h3>Test POST symptôme:</h3>
            <button onclick="testPost()">Tester POST /api/symptomes</button>
            <script>
                async function testPost() {
                    const response = await fetch('/api/symptomes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nom: 'Test HTML',
                            description: 'Depuis la page HTML',
                            code: 'HTML001'
                        })
                    });
                    const data = await response.json();
                    alert('Créé: ' + data.id);
                }
            </script>
        </body>
        </html>
    `);
});

// ========== DÉMARRAGE ==========
const PORT = process.env.PORT || 3000;

// Ne pas exporter si c'est le fichier principal
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🎯 Serveur démarré sur http://localhost:${PORT}`);
        console.log('📡 Routes disponibles:');
        console.log('   GET  /api/health');
        console.log('   GET  /api/patients');
        console.log('   GET  /api/consultations');
        console.log('   GET  /api/symptomes');
        console.log('   POST /api/symptomes');
        console.log('\n👉 Testez: http://localhost:3000/api/symptomes');
    });
}

module.exports = app;