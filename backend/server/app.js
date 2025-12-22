// server/app.js - Version utilisant le dossier routes/
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

console.log('🔧 Configuration du serveur Express...');

const app = express();

// ========== MIDDLEWARE ==========
app.use(
  helmet({
    contentSecurityPolicy: false,  // Désactive CSP pour le développement
  })
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== IGNORER FAVICON ==========
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ========== FICHIERS STATIQUES ==========
const publicPath = path.join(__dirname, 'public');
console.log('📁 Dossier statique:', publicPath);

// Créer le dossier public s'il n'existe pas
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}

app.use(express.static(publicPath));

// ========== CHARGEMENT DES ROUTES ==========
try {
    console.log('🔄 Chargement des routes API...');
    
    // Charger les routes depuis le dossier routes/
    const patientRoutes = require('./routes/patientRoutes');
    const consultationRoutes = require('./routes/consultationRoutes');
    const referenceRoutes = require('./routes/referenceRoutes');
    
    // Utiliser les routes
    app.use('/api/patients', patientRoutes);
    app.use('/api/consultations', consultationRoutes);
    app.use('/api/references', referenceRoutes);
    
    console.log('✅ Routes API chargées avec succès');
} catch (error) {
    console.error('❌ Erreur chargement routes:', error.message);
    console.log('⚠️  Utilisation des routes par défaut...');
    
    // Routes par défaut si les fichiers routes/ n'existent pas
    app.get('/api/patients', (req, res) => res.json([]));
    app.get('/api/consultations', (req, res) => res.json([]));
    app.get('/api/references/wilayas', (req, res) => res.json([]));
}

// ========== ROUTE DE SANTÉ ==========
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Serveur Cabinet Psychiatrique',
        timestamp: new Date().toISOString(),
        routes: {
            patients: '/api/patients',
            consultations: '/api/consultations',
            references: '/api/references'
        }
    });
});

// ========== ROUTES HTML ==========

// Page d'accueil
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cabinet Psychiatrique</title>
                <style>
                    body { font-family: Arial; padding: 40px; text-align: center; }
                    h1 { color: #667eea; }
                    .card { 
                        background: white; 
                        padding: 30px; 
                        border-radius: 10px; 
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                        display: inline-block;
                    }
                    .routes { 
                        text-align: left; 
                        margin: 20px 0; 
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
                <div class="card">
                    <h1>🏥 Cabinet Psychiatrique</h1>
                    <p>Interface web en cours de configuration</p>
                    
                    <div class="routes">
                        <h3>Routes API disponibles :</h3>
                        <ul>
                            <li><a href="/api/health" target="_blank">/api/health</a> - Vérification serveur</li>
                            <li><a href="/api/patients" target="_blank">/api/patients</a> - Liste des patients</li>
                            <li><a href="/api/consultations" target="_blank">/api/consultations</a> - Liste des consultations</li>
                            <li><a href="/api/references/wilayas" target="_blank">/api/references/wilayas</a> - Liste des wilayas</li>
                        </ul>
                    </div>
                    
                    <p>Créez <code>server/public/index.html</code> pour l'interface complète.</p>
                </div>
            </body>
            </html>
        `);
    }
});

// ========== GESTION ERREURS ==========
app.use((err, req, res, next) => {
    console.error('🔥 ERREUR SERVEUR:', err.message);
    res.status(500).json({ 
        error: 'Erreur serveur interne',
        message: err.message 
    });
});

console.log('✅ Configuration Express terminée');
module.exports = app;