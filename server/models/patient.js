@""
/**
 * Modèle Patient pour le Cabinet Psychiatrique
 * Version complète avec tous les champs
 */

class Patient {
    constructor(data = {}) {
        this.id = data.id || null;
        this.num_dossier = data.num_dossier || this.generateDossierNumber();
        this.nom = data.nom || '';
        this.prenom = data.prenom || '';
        this.date_naissance = data.date_naissance || '';
        this.age = this.calculateAge();
        this.wilaya_naissance_id = data.wilaya_naissance_id || null;
        this.commune_naissance_id = data.commune_naissance_id || null;
        this.genre = data.genre || 'M';
        this.situation_familiale = data.situation_familiale || 'Célibataire';
        
        this.profession_id = data.profession_id || null;
        this.num_cni = data.num_cni || '';
        this.date_delivrance = data.date_delivrance || '';
        this.wilaya_residence_id = data.wilaya_residence_id || null;
        this.commune_residence_id = data.commune_residence_id || null;
        this.photo = data.photo || '';
        
        // Champs additionnels utiles
        this.telephone = data.telephone || '';
        this.email = data.email || '';
        this.adresse = data.adresse || '';
        this.medecin_traitant = data.medecin_traitant || '';
        this.antecedents = data.antecedents || '';
        this.notes = data.notes || '';
        this.statut = data.statut || 'actif';
        this.date_creation = data.date_creation || new Date().toISOString();
    }
    
    /**
     * Génère un numéro de dossier automatique
     * Format: PAT-YYYYMM-XXXX
     */
    generateDossierNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `PAT-${year}${month}-${random}`;
    }
    
    /**
     * Calcule l'âge à partir de la date de naissance
     */
    calculateAge() {
        if (!this.date_naissance) return null;
        
        const birthDate = new Date(this.date_naissance);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    /**
     * Valide les données du patient
     */
    validate() {
        const errors = [];
        
        // Validation des champs obligatoires
        if (!this.nom || this.nom.trim().length < 2) {
            errors.push('Le nom est obligatoire (min 2 caractères)');
        }
        
        if (!this.prenom || this.prenom.trim().length < 2) {
            errors.push('Le prénom est obligatoire (min 2 caractères)');
        }
        
        if (!this.date_naissance) {
            errors.push('La date de naissance est obligatoire');
        } else {
            const birthDate = new Date(this.date_naissance);
            if (birthDate > new Date()) {
                errors.push('La date de naissance ne peut pas être dans le futur');
            }
        }
        
        // Validation du numéro CNI si fourni
        if (this.num_cni && !/^\d{10}$/.test(this.num_cni.replace(/\s/g, ''))) {
            errors.push('Le numéro CNI doit contenir 10 chiffres');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Formatte les données pour l'affichage
     */
    toJSON() {
        return {
            id: this.id,
            num_dossier: this.num_dossier,
            nom: this.nom,
            prenom: this.prenom,
            full_name: `${this.prenom} ${this.nom.toUpperCase()}`,
            date_naissance: this.date_naissance,
            age: this.calculateAge(),
            wilaya_naissance_id: this.wilaya_naissance_id,
            commune_naissance_id: this.commune_naissance_id,
            genre: this.genre,
            genre_label: this.getGenreLabel(),
            situation_familiale: this.situation_familiale,
            
            profession_id: this.profession_id,
            num_cni: this.num_cni,
            date_delivrance: this.date_delivrance,
            wilaya_residence_id: this.wilaya_residence_id,
            commune_residence_id: this.commune_residence_id,
            photo: this.photo,
            
            telephone: this.telephone,
            email: this.email,
            adresse: this.adresse,
            medecin_traitant: this.medecin_traitant,
            antecedents: this.antecedents,
            notes: this.notes,
            statut: this.statut,
            date_creation: this.date_creation
        };
    }
    
    /**
     * Retourne le libellé du genre
     */
    getGenreLabel() {
        const genres = {
            'M': 'Masculin',
            'F': 'Féminin',
            'A': 'Autre'
        };
        return genres[this.genre] || this.genre;
    }
    
    /**
     * Génère des données de test
     */
    static generateTestData(count = 10) {
        const patients = [];
        const situations = ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)', 'Concubinage'];
        const wilayas = ['16', '31', '75', '13', '69'];
        
        for (let i = 1; i <= count; i++) {
            const patient = new Patient({
                id: i,
                nom: ['Benali', 'Kadri', 'Bouziane', 'Mansouri', 'Laribi'][Math.floor(Math.random() * 5)],
                prenom: ['Karim', 'Samira', 'Mohamed', 'Fatima', 'Ali'][Math.floor(Math.random() * 5)],
                date_naissance: this.randomBirthDate(),
                genre: Math.random() > 0.5 ? 'M' : 'F',
                situation_familiale: situations[Math.floor(Math.random() * situations.length)],
                num_cni: this.generateRandomCNI(),
                wilaya_naissance_id: wilayas[Math.floor(Math.random() * wilayas.length)],
                wilaya_residence_id: wilayas[Math.floor(Math.random() * wilayas.length)],
                telephone: `05${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
                email: `patient${i}@example.com`,
                adresse: `${Math.floor(Math.random() * 200) + 1} Rue des Oliviers`,
                statut: ['actif', 'inactif', 'archivé'][Math.floor(Math.random() * 3)]
            });
            
            patients.push(patient.toJSON());
        }
        
        return patients;
    }
    
    static randomBirthDate() {
        const start = new Date(1950, 0, 1);
        const end = new Date(2005, 0, 1);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    }
    
    static generateRandomCNI() {
        return Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
    }
}

module.exports = Patient;
"@ | Out-File -FilePath server/models/patient.js -Encoding UTF8"