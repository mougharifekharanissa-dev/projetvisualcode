// models/PersistenceService.js
const fs = require('fs').promises;
const path = require('path');
const Cabinet = require('./Cabinet');

class PersistenceService {
    static async chargerDonnees() {
        try {
            console.log('📂 Chargement des données depuis les fichiers JSON...');
            
            // Charger les données si les fichiers existent
            const dataPath = path.join(__dirname, '..', 'data');
            
            try {
                const patientsData = await fs.readFile(path.join(dataPath, 'patients.json'), 'utf8');
                Cabinet.instance.patients = JSON.parse(patientsData);
                console.log(`✅ ${Cabinet.instance.patients.length} patients chargés`);
            } catch (e) {
                console.log('ℹ️  Aucun fichier patients.json trouvé');
            }
            
            try {
                const consultationsData = await fs.readFile(path.join(dataPath, 'consultations.json'), 'utf8');
                Cabinet.instance.consultations = JSON.parse(consultationsData);
                console.log(`✅ ${Cabinet.instance.consultations.length} consultations chargées`);
            } catch (e) {
                console.log('ℹ️  Aucun fichier consultations.json trouvé');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors du chargement des données:', error);
            return false;
        }
    }
}

module.exports = PersistenceService;