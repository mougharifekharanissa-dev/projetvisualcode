const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Chemins absolus
const DATA_DIR = path.join(__dirname, '..', '..', '..', 'data', 'references');
const WILAYAS_PATH = path.join(DATA_DIR, 'wilayas.json');
const COMMUNES_PATH = path.join(DATA_DIR, 'communes.json');
const Commune = require('../models/Commune');
const Diagnostic = require('../models/Diagnostic');  // NOUVEAU
const Traitement = require('../models/Traitement');  // NOUVEAU
// GET wilayas
router.get('/wilayas', (req, res) => {
    try {
        console.log('Chemin wilayas:', WILAYAS_PATH);
        console.log('Existe?', fs.existsSync(WILAYAS_PATH));
        
        if (!fs.existsSync(WILAYAS_PATH)) {
            console.log('Fichier wilayas.json non trouvé');
            return res.json([]);
        }
        
        const content = fs.readFileSync(WILAYAS_PATH, 'utf8');
        console.log('Contenu:', content.substring(0, 100));
        
        const wilayas = JSON.parse(content);
        res.json(wilayas);
        
    } catch (error) {
        console.error('Erreur chargement wilayas:', error);
        res.status(500).json({ error: 'Erreur chargement wilayas' });
    }
});

// GET communes
router.get('/communes/:wilayaId', (req, res) => {
    try {
        const wilayaId = req.params.wilayaId;
        console.log('Demande communes pour wilaya:', wilayaId);
        console.log('Chemin communes:', COMMUNES_PATH);
        
        if (!fs.existsSync(COMMUNES_PATH)) {
            console.log('Fichier communes.json non trouvé');
            return res.json([]);
        }
        
        const content = fs.readFileSync(COMMUNES_PATH, 'utf8');
        const communesData = JSON.parse(content);
        const communes = communesData[wilayaId] || [];
        
        console.log('Communes trouvées:', communes.length);
        res.json(communes);
        
    } catch (error) {
        console.error('Erreur chargement communes:', error);
        res.status(500).json({ error: 'Erreur chargement communes' });
    }
});
// ============================================
// AJOUTEZ CE CODE ICI - DÉBUT
// ============================================

// GET professions
router.get('/professions', (req, res) => {
    try {
        console.log('GET /api/references/professions');
        
        // Chemin vers professions.json
        const professionsPath = path.join(__dirname, '../../../data/references/professions.json');
        
        // Si le fichier n'existe pas, retourne des données par défaut
        if (!fs.existsSync(professionsPath)) {
            console.log('Fichier professions.json non trouvé, retourne données par défaut');
            
            const defaultProfessions = [
                { id: 1, nom: "Médecin" },
                { id: 2, nom: "Infirmier" },
                { id: 3, nom: "Enseignant" },
                { id: 4, nom: "Ingénieur" },
                { id: 5, nom: "Technicien" },
                { id: 6, nom: "Commerçant" },
                { id: 7, nom: "Artisan" },
                { id: 8, nom: "Fonctionnaire" },
                { id: 9, nom: "Étudiant" },
                { id: 10, nom: "Chômeur" },
                { id: 11, nom: "Retraité" },
                { id: 12, nom: "Agriculteur" },
                { id: 13, nom: "Avocat" },
                { id: 14, nom: "Cadre" },
                { id: 15, nom: "Ouvrier" },
                { id: 16, nom: "Autre" }
            ];
            
            return res.json(defaultProfessions);
        }
        
        // Lire le fichier
        const content = fs.readFileSync(professionsPath, 'utf8');
        const data = JSON.parse(content);
        
        // Adapter selon le format
        let professions = [];
        if (Array.isArray(data)) {
            professions = data;
        } else if (data.professions) {
            professions = data.professions;
        }
        
        console.log(`✅ Retourne ${professions.length} professions`);
        res.json(professions);
        
    } catch (error) {
        console.error('❌ Erreur chargement professions:', error);
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// ROUTES SUPPLÉMENTAIRES POUR L'UTILITAIRE
// ============================================

// GET profession spécifique
router.get('/professions/:id', (req, res) => {
    try {
        const professionId = parseInt(req.params.id);
        console.log(`GET profession ID: ${professionId}`);
        
        // Chemin vers professions.json
        const professionsPath = path.join(__dirname, '../../../data/references/professions.json');
        
        // Si le fichier n'existe pas, retourne une erreur
        if (!fs.existsSync(professionsPath)) {
            return res.status(404).json({ error: 'Professions non trouvées' });
        }
        
        const content = fs.readFileSync(professionsPath, 'utf8');
        const data = JSON.parse(content);
        
        // Trouver la profession
        let professions = [];
        if (Array.isArray(data)) {
            professions = data;
        } else if (data.professions) {
            professions = data.professions;
        }
        
        const profession = professions.find(p => p.id === professionId);
        
        if (!profession) {
            return res.status(404).json({ error: 'Profession non trouvée' });
        }
        
        console.log(`✅ Profession trouvée: ${profession.nom}`);
        res.json(profession);
        
    } catch (error) {
        console.error('❌ Erreur recherche profession:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Créer une profession
router.post('/professions', (req, res) => {
    try {
        console.log('POST /api/references/professions');
        const newProfession = req.body;
        
        if (!newProfession.nom || newProfession.nom.trim() === '') {
            return res.status(400).json({ error: 'Le nom de la profession est requis' });
        }
        
        // Chemin vers professions.json
        const professionsPath = path.join(__dirname, '../../../data/references/professions.json');
        
        // Charger les professions existantes
        let professions = [];
        if (fs.existsSync(professionsPath)) {
            const content = fs.readFileSync(professionsPath, 'utf8');
            const data = JSON.parse(content);
            
            if (Array.isArray(data)) {
                professions = data;
            } else if (data.professions) {
                professions = data.professions;
            }
        }
        
        // Générer un nouvel ID
        const maxId = professions.length > 0 
            ? Math.max(...professions.map(p => p.id || 0)) 
            : 0;
        
        // Créer l'objet profession
        const professionToAdd = {
            id: maxId + 1,
            nom: newProfession.nom.trim(),
            description: newProfession.description || '',
            categorie: newProfession.categorie || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Ajouter à la liste
        professions.push(professionToAdd);
        
        // Sauvegarder dans le fichier
        fs.writeFileSync(professionsPath, JSON.stringify(professions, null, 2), 'utf8');
        
        console.log(`✅ Profession ajoutée: ${professionToAdd.nom} (ID: ${professionToAdd.id})`);
        res.status(201).json(professionToAdd);
        
    } catch (error) {
        console.error('❌ Erreur création profession:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Mettre à jour une profession
router.put('/professions/:id', (req, res) => {
    try {
        const professionId = parseInt(req.params.id);
        console.log(`PUT /api/references/professions/${professionId}`);
        
        const updatedProfession = req.body;
        
        if (!updatedProfession.nom || updatedProfession.nom.trim() === '') {
            return res.status(400).json({ error: 'Le nom de la profession est requis' });
        }
        
        // Chemin vers professions.json
        const professionsPath = path.join(__dirname, '../../../data/references/professions.json');
        
        if (!fs.existsSync(professionsPath)) {
            return res.status(404).json({ error: 'Professions non trouvées' });
        }
        
        // Charger les professions
        const content = fs.readFileSync(professionsPath, 'utf8');
        let professions = JSON.parse(content);
        
        // Trouver l'index de la profession
        const professionIndex = professions.findIndex(p => p.id === professionId);
        
        if (professionIndex === -1) {
            return res.status(404).json({ error: 'Profession non trouvée' });
        }
        
        // Mettre à jour la profession
        professions[professionIndex] = {
            ...professions[professionIndex],
            nom: updatedProfession.nom.trim(),
            description: updatedProfession.description || '',
            categorie: updatedProfession.categorie || '',
            updated_at: new Date().toISOString()
        };
        
        // Sauvegarder
        fs.writeFileSync(professionsPath, JSON.stringify(professions, null, 2), 'utf8');
        
        console.log(`✅ Profession mise à jour: ${professions[professionIndex].nom}`);
        res.json(professions[professionIndex]);
        
    } catch (error) {
        console.error('❌ Erreur mise à jour profession:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Supprimer une profession
router.delete('/professions/:id', (req, res) => {
    try {
        const professionId = parseInt(req.params.id);
        console.log(`DELETE /api/references/professions/${professionId}`);
        
        // Chemin vers professions.json
        const professionsPath = path.join(__dirname, '../../../data/references/professions.json');
        
        if (!fs.existsSync(professionsPath)) {
            return res.status(404).json({ error: 'Professions non trouvées' });
        }
        
        // Charger les professions
        const content = fs.readFileSync(professionsPath, 'utf8');
        let professions = JSON.parse(content);
        
        // Filtrer pour supprimer
        const professionToDelete = professions.find(p => p.id === professionId);
        
        if (!professionToDelete) {
            return res.status(404).json({ error: 'Profession non trouvée' });
        }
        
        const newProfessions = professions.filter(p => p.id !== professionId);
        
        // Sauvegarder
        fs.writeFileSync(professionsPath, JSON.stringify(newProfessions, null, 2), 'utf8');
        
        console.log(`✅ Profession supprimée: ${professionToDelete.nom}`);
        res.json({ message: 'Profession supprimée avec succès', deleted: professionToDelete });
        
    } catch (error) {
        console.error('❌ Erreur suppression profession:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTES POUR DIAGNOSTICS (optionnel)
// ============================================

// GET diagnostics
router.get('/diagnostics', (req, res) => {
    try {
        console.log('GET /api/references/diagnostics');
        
        // Chemin vers diagnostics.json
        const diagnosticsPath = path.join(__dirname, '../../../data/references/diagnostics.json');
        
        // Si le fichier n'existe pas, retourne des données par défaut
        if (!fs.existsSync(diagnosticsPath)) {
            console.log('Fichier diagnostics.json non trouvé, retourne données par défaut');
            
            const defaultDiagnostics = [
                { id: 1, code: "F41.1", nom: "Trouble anxieux généralisé", categorie: "Troubles anxieux" },
                { id: 2, code: "F32", nom: "Épisode dépressif", categorie: "Troubles de l'humeur" },
                { id: 3, code: "F20", nom: "Schizophrénie", categorie: "Troubles psychotiques" },
                { id: 4, code: "F50", nom: "Troubles des conduites alimentaires", categorie: "Troubles alimentaires" },
                { id: 5, code: "F10", nom: "Troubles liés à l'alcool", categorie: "Troubles addictifs" },
                { id: 6, code: "F90", nom: "Trouble hyperkinétique", categorie: "Troubles du comportement" }
            ];
            
            return res.json(defaultDiagnostics);
        }
        
        router.post('/diagnostics', async (req, res) => {
    try {
        const { code, nom } = req.body;
        // Insérer dans la base de données
        const diagnostic = new Diagnostic(null, code, nom);
        const result = await PersistenceService.save(diagnostic);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/diagnostics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, nom } = req.body;
        const diagnostic = new Diagnostic(id, code, nom);
        const result = await PersistenceService.update(diagnostic);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/diagnostics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PersistenceService.delete(Diagnostic, id);
        res.json({ success: true, message: 'Diagnostic supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
        // Lire le fichier
        const content = fs.readFileSync(diagnosticsPath, 'utf8');
        const diagnostics = JSON.parse(content);
        
        console.log(`✅ Retourne ${diagnostics.length} diagnostics`);
        res.json(diagnostics);
        
    } catch (error) {
        console.error('❌ Erreur chargement diagnostics:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTES POUR TRAITEMENTS (optionnel)
// ============================================

// GET traitements
router.get('/traitements', (req, res) => {
    try {
        console.log('GET /api/references/traitements');
        
        // Chemin vers traitements.json
        const traitementsPath = path.join(__dirname, '../../../data/references/traitements.json');
        
        // Si le fichier n'existe pas, retourne des données par défaut
        if (!fs.existsSync(traitementsPath)) {
            console.log('Fichier traitements.json non trouvé, retourne données par défaut');
            
            const defaultTraitements = [
                { id: 1, nom: "Sertraline", type: "Médicamenteux", categorie: "ISRS" },
                { id: 2, nom: "Fluoxétine", type: "Médicamenteux", categorie: "ISRS" },
                { id: 3, nom: "TCC", type: "Psychothérapie", categorie: "Thérapie brève" },
                { id: 4, nom: "Psychanalyse", type: "Psychothérapie", categorie: "Thérapie longue" },
                { id: 5, nom: "Thérapie familiale", type: "Psychothérapie", categorie: "Thérapie systémique" }
            ];
            
            return res.json(defaultTraitements);
        }
        
        router.post('/traitements', async (req, res) => {
    try {
        const { nom, forme } = req.body;
        const traitement = new Traitement(null, nom, forme);
        const result = await PersistenceService.save(traitement);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/traitements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, forme } = req.body;
        const traitement = new Traitement(id, nom, forme);
        const result = await PersistenceService.update(traitement);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/traitements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PersistenceService.delete(Traitement, id);
        res.json({ success: true, message: 'Traitement supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
        // Lire le fichier
        const content = fs.readFileSync(traitementsPath, 'utf8');
        const traitements = JSON.parse(content);
        
        console.log(`✅ Retourne ${traitements.length} traitements`);
        res.json(traitements);
        
    } catch (error) {
        console.error('❌ Erreur chargement traitements:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTES SUPPLÉMENTAIRES POUR COMMUNES
// ============================================

// GET toutes les communes (pour l'utilitaire)
router.get('/all-communes', (req, res) => {
    try {
        console.log('GET /api/references/all-communes');
        
        if (!fs.existsSync(COMMUNES_PATH)) {
            return res.json([]);
        }
        
 router.post('/import-communes', async (req, res) => {
    try {
        const communesData = req.body; // Tableau de communes
        
        const results = [];
        for (const communeData of communesData) {
            const commune = new Commune(
                null,
                communeData.nom,
                communeData.wilaya_id,
                communeData.code,
                communeData.code_postal
            );
            const result = await PersistenceService.save(commune);
            results.push(result);
        }
        
        res.status(201).json({ 
            success: true, 
            message: `${results.length} communes importées`,
            data: results 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});       
        const content = fs.readFileSync(COMMUNES_PATH, 'utf8');
        const communesData = JSON.parse(content);
        
        // Transformer l'objet en tableau plat
        let allCommunes = [];
        
        Object.keys(communesData).forEach(wilayaCode => {
            const communes = communesData[wilayaCode];
            
            communes.forEach(commune => {
                allCommunes.push({
                    id: commune.code || commune.id,
                    code: commune.code || commune.Code_Commune,
                    nom: commune.nom || commune.Nom_Commune,
                    wilaya_code: wilayaCode,
                    code_postal: commune.code_postal || ''
                });
            });
        });
        
        console.log(`✅ Retourne ${allCommunes.length} communes`);
        res.json(allCommunes);
        
    } catch (error) {
        console.error('❌ Erreur chargement toutes les communes:', error);
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// ROUTES COMMUNES (CRUD COMPLET)
// ============================================

// POST - Créer une nouvelle commune
router.post('/communes', async (req, res) => {
    try {
        const { code, nom, wilaya_id, code_postal } = req.body;
        
        // Validation
        if (!code || !nom || !wilaya_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Code, nom et wilaya_id sont requis' 
            });
        }
        
        // Vérifier si la commune existe déjà
        const existingCommune = await PersistenceService.findOne(Commune, { code });
        if (existingCommune) {
            return res.status(400).json({ 
                success: false, 
                error: 'Une commune avec ce code existe déjà' 
            });
        }
        
        // Créer la commune
        const commune = new Commune(null, nom, wilaya_id, code, code_postal);
        const result = await PersistenceService.save(commune);
        
        res.status(201).json({ 
            success: true, 
            message: 'Commune créée avec succès',
            data: result 
        });
        
    } catch (error) {
        console.error('Erreur création commune:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// PUT - Mettre à jour une commune
router.put('/communes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, nom, wilaya_id, code_postal } = req.body;
        
        // Vérifier si la commune existe
        const existingCommune = await PersistenceService.findById(Commune, id);
        if (!existingCommune) {
            return res.status(404).json({ 
                success: false, 
                error: 'Commune non trouvée' 
            });
        }
        
        // Mettre à jour
        const commune = new Commune(id, nom, wilaya_id, code, code_postal);
        const result = await PersistenceService.update(commune);
        
        res.json({ 
            success: true, 
            message: 'Commune mise à jour avec succès',
            data: result 
        });
        
    } catch (error) {
        console.error('Erreur mise à jour commune:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// DELETE - Supprimer une commune
router.delete('/communes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vérifier si la commune existe
        const existingCommune = await PersistenceService.findById(Commune, id);
        if (!existingCommune) {
            return res.status(404).json({ 
                success: false, 
                error: 'Commune non trouvée' 
            });
        }
        
        // Supprimer
        await PersistenceService.delete(Commune, id);
        
        res.json({ 
            success: true, 
            message: 'Commune supprimée avec succès' 
        });
        
    } catch (error) {
        console.error('Erreur suppression commune:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET - Récupérer une commune spécifique
router.get('/communes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const commune = await PersistenceService.findById(Commune, id);
        if (!commune) {
            return res.status(404).json({ 
                success: false, 
                error: 'Commune non trouvée' 
            });
        }
        
        // Récupérer le nom de la wilaya
        const wilaya = await PersistenceService.findById(Wilaya, commune.wilaya_id);
        
        res.json({ 
            success: true, 
            data: {
                ...commune,
                wilaya_nom: wilaya ? wilaya.nom : null
            }
        });
        
    } catch (error) {
        console.error('Erreur récupération commune:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// POST - Importer des communes depuis JSON
router.post('/import-communes', async (req, res) => {
    try {
        const communesData = req.body;
        
        if (!Array.isArray(communesData) || communesData.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Données invalides ou tableau vide' 
            });
        }
        
        let importedCount = 0;
        let errors = [];
        
        // Option 1: Supprimer toutes les communes existantes d'abord
        // await PersistenceService.deleteAll(Commune); // À décommenter si nécessaire
        
        // Importer chaque commune
        for (const communeData of communesData) {
            try {
                // Vérifier les données requises
                if (!communeData.nom || !communeData.wilaya_id) {
                    errors.push(`Données manquantes: ${JSON.stringify(communeData)}`);
                    continue;
                }
                
                // Créer la commune
                const commune = new Commune(
                    null,
                    communeData.nom,
                    communeData.wilaya_id,
                    communeData.code || null,
                    communeData.code_postal || null
                );
                
                await PersistenceService.save(commune);
                importedCount++;
                
            } catch (error) {
                errors.push(`Erreur sur ${communeData.nom}: ${error.message}`);
            }
        }
        
        res.status(201).json({ 
            success: true, 
            message: `${importedCount} communes importées avec succès`,
            importedCount,
            errorCount: errors.length,
            errors: errors.length > 0 ? errors : undefined
        });
        
    } catch (error) {
        console.error('Erreur import communes:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
// POST - Importer les wilayas depuis JSON
router.post('/import-wilayas', (req, res) => {
    try {
        console.log('POST /api/references/import-wilayas');
        
        // Lire le fichier wilayas.json
        if (!fs.existsSync(WILAYAS_PATH)) {
            return res.status(404).json({ error: 'Fichier wilayas.json non trouvé' });
        }
        
        const content = fs.readFileSync(WILAYAS_PATH, 'utf8');
        const wilayas = JSON.parse(content);
        
        // Ici, normalement, vous inséreriez dans la base de données
        // Pour l'instant, on retourne juste les données
        
        console.log(`✅ ${wilayas.length} wilayas importées`);
        res.json({ 
            message: `${wilayas.length} wilayas importées avec succès`,
            count: wilayas.length
        });
        
    } catch (error) {
        console.error('❌ Erreur importation wilayas:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTE DE SANTÉ (pour tester)
// ============================================

router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Références API opérationnelles',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/references/wilayas',
            '/api/references/communes/:wilayaId',
            '/api/references/professions',
            '/api/references/diagnostics',
            '/api/references/traitements',
            '/api/references/all-communes'
        ]
    });
});



// GARDEZ cette ligne EXACTEMENT comme elle est
module.exports = router;