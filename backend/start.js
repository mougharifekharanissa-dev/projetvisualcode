// start.js - Version corrigée
const app = require('./server/app');

console.log('🚀 Démarrage de l\'application Cabinet Psychiatrique...');

async function initializeApp() {
    try {
        // Essayer de charger PersistenceService
        try {
            const PersistenceService = require('./models/PersistenceService');
            await PersistenceService.chargerDonnees();
            console.log('✅ Données chargées avec succès');
        } catch (e) {
            console.log('ℹ️  PersistenceService non trouvé ou erreur de chargement');
        }
        
        // Essayer de charger Cabinet et vérifier instance
        let patientCount = 0;
        let consultationCount = 0;
        
        try {
            const Cabinet = require('./models/Cabinet');
            if (Cabinet.instance && Cabinet.instance.patients) {
                patientCount = Cabinet.instance.patients.length;
            }
            if (Cabinet.instance && Cabinet.instance.consultations) {
                consultationCount = Cabinet.instance.consultations.length;
            }
            console.log('✅ Backend Cabinet chargé');
        } catch (e) {
            console.log('⚠️  Cabinet non trouvé ou erreur de chargement');
        }
        
        // Configurer et démarrer le serveur
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🌐 Serveur démarré sur http://localhost:${PORT}`);
            console.log(`📊 Patients: ${patientCount}`);
            console.log(`📋 Consultations: ${consultationCount}`);
            console.log('\n👉 Accédez à: http://localhost:' + PORT);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage:', error);
        process.exit(1);
    }
}

initializeApp();