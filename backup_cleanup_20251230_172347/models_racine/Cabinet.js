const Patient = require('./Patient');
const Consultation = require('./Consultation');
const Wilaya = require('./Wilaya');
const Commune = require('./Commune');
const Profession = require('./Profession');

class Cabinet {
    constructor() {
        this.patients = [];
        this.nextPatientId = 1;
        this.nextNumDossier = 1000;
        
        // Nouvelles propriétés
        this.consultations = [];
        this.nextConsultationId = 1;
        
        // Tables de référence
        this.wilayas = [];
        this.nextWilayaId = 1;
        
        this.communes = [];
        this.nextCommuneId = 1;
        
        this.professions = [];
        this.nextProfessionId = 1;
    }
    
    genererNumDossier() {
        return `PSY-${this.nextNumDossier++}`;
    }
    
    // === MÉTHODES PATIENTS ===
    ajouterPatient(data) {
        const num_dossier = data.num_dossier || this.genererNumDossier();
        
        const patient = new Patient(
            this.nextPatientId++,
            num_dossier,
            data.nom,
            data.prenom,
            data.date_naissance,
            data.wilaya_naissance_id,
            data.commune_naissance_id,
            data.genre,
            data.situation_familiale,
            data.profession_id,
            data.num_cni,
            data.date_delivrance,
            data.wilaya_residence_id,
            data.commune_residence_id,
            data.photo
        );
        
        this.patients.push(patient);
        return patient;
    }
    
    trouverPatientParId(id) {
        return this.patients.find(p => p.id === id);
    }
    
    trouverPatientParDossier(num_dossier) {
        return this.patients.find(p => p.num_dossier === num_dossier);
    }
    
    trouverPatientsParNom(nom) {
        return this.patients.filter(p => 
            p.nom.toLowerCase().includes(nom.toLowerCase()) ||
            p.prenom.toLowerCase().includes(nom.toLowerCase())
        );
    }
    
    listerPatients() {
        return this.patients.map(patient => patient.getInfoComplete());
    }
    
    // === MÉTHODES CONSULTATIONS ===
    ajouterConsultation(data) {
        const consultation = new Consultation(
            this.nextConsultationId++,
            data.patient_id,
            data.date_consultation,
            data.motif,
            data.observations,
            data.diagnostic_id,
            data.traitement_id
        );
        
        this.consultations.push(consultation);
        return consultation;
    }
    
    listerConsultations() {
        return this.consultations;
    }
    
    trouverConsultationsParPatient(patientId) {
        return this.consultations.filter(consult => consult.patient_id === patientId);
    }
    
    trouverConsultationParId(id) {
        return this.consultations.find(c => c.id === id);
    }
    
    // === MÉTHODES RÉFÉRENCES ===
    ajouterWilaya(data) {
        const wilaya = new Wilaya(
            this.nextWilayaId++,
            data.nom,
            data.code
        );
        this.wilayas.push(wilaya);
        return wilaya;
    }
    
    ajouterCommune(data) {
        const commune = new Commune(
            this.nextCommuneId++,
            data.nom,
            data.wilaya_id
        );
        this.communes.push(commune);
        return commune;
    }
    
    ajouterProfession(data) {
        const profession = new Profession(
            this.nextProfessionId++,
            data.nom
        );
        this.professions.push(profession);
        return profession;
    }
    
    // Méthodes de recherche
    trouverWilayaParId(id) {
        return this.wilayas.find(w => w.id === id);
    }
    
    trouverCommuneParId(id) {
        return this.communes.find(c => c.id === id);
    }
    
    trouverProfessionParId(id) {
        return this.professions.find(p => p.id === id);
    }
    
    listerCommunesParWilaya(wilayaId) {
        return this.communes.filter(c => c.wilaya_id === wilayaId);
    }
    
    listerWilayas() {
        return this.wilayas;
    }
    
    listerProfessions() {
        return this.professions;
    }
    
    // === DONNÉES DE TEST ===
    initialiserDonneesTest() {
        console.log("📦 Initialisation des données de test...");
        
        // Wilayas
        if (this.wilayas.length === 0) {
            this.ajouterWilaya({ nom: "Alger", code: "16" });
            this.ajouterWilaya({ nom: "Oran", code: "31" });
            this.ajouterWilaya({ nom: "Constantine", code: "25" });
            console.log("✅ Wilayas initialisées");
        }
        
        // Communes
        if (this.communes.length === 0) {
            this.ajouterCommune({ nom: "Alger Centre", wilaya_id: 1 });
            this.ajouterCommune({ nom: "Sidi M'Hamed", wilaya_id: 1 });
            this.ajouterCommune({ nom: "Oran Centre", wilaya_id: 2 });
            this.ajouterCommune({ nom: "Constantine Centre", wilaya_id: 3 });
            console.log("✅ Communes initialisées");
        }
        
        // Professions
        if (this.professions.length === 0) {
            this.ajouterProfession({ nom: "Étudiant" });
            this.ajouterProfession({ nom: "Fonctionnaire" });
            this.ajouterProfession({ nom: "Commerçant" });
            this.ajouterProfession({ nom: "Sans profession" });
            console.log("✅ Professions initialisées");
        }
        
        console.log("🎉 Données de test prêtes!");
    }
}

module.exports = Cabinet;