/**
 * Modèle Patient pour le Cabinet Psychiatrique
 * Gère les données des patients
 */

class Patient {
    /**
     * Constructeur d'un patient
     * @param {number} id - Identifiant unique
     * @param {string} nom - Nom de famille
     * @param {string} prenom - Prénom
     * @param {string} dateNaissance - Date de naissance (YYYY-MM-DD)
     * @param {string} sexe - Sexe (M/F)
     * @param {string} adresse - Adresse complète
     * @param {string} telephone - Numéro de téléphone
     * @param {string} email - Adresse email
     * @param {string} profession_id - Profession
     * @param {string} situationFamiliale - Situation familiale
     * @param {string} numSecuriteSociale - Numéro de sécurité sociale
     * @param {string} mutuelle - Mutuelle complémentaire
     * @param {string} medecinTraitant - Médecin traitant
     * @param {string} antecedents - Antécédents médicaux
     * @param {string} notes - Notes supplémentaires
     * @param {string} datePremiereVisite - Date de première visite
     * @param {string} statut - Statut (actif, inactif, archivé)
     */
    constructor(
        id,
        nom,
        prenom,
        dateNaissance,
        sexe = 'M',
        adresse = '',
        telephone = '',
        email = '',
        profession = '',
        situationFamiliale = '',
        numSecuriteSociale = '',
        mutuelle = '',
        medecinTraitant = '',
        antecedents = '',
        notes = '',
        datePremiereVisite = null,
        statut = 'actif'
    ) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.adresse = adresse;
        this.telephone = telephone;
        this.email = email;
        this.profession = profession;
        this.situationFamiliale = situationFamiliale;
        this.numSecuriteSociale = numSecuriteSociale;
        this.mutuelle = mutuelle;
        this.medecinTraitant = medecinTraitant;
        this.antecedents = antecedents;
        this.notes = notes;
        this.datePremiereVisite = datePremiereVisite || new Date().toISOString().split('T')[0];
        this.statut = statut;
    }

    /**
     * Calcule l'âge du patient
     * @returns {number} Âge en années
     */
    getAge() {
        const today = new Date();
        const birthDate = new Date(this.dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Formate le nom complet
     * @returns {string} Nom complet formaté
     */
    getFullName() {
        return `${this.prenom} ${this.nom.toUpperCase()}`;
    }

    /**
     * Formate la date de naissance pour l'affichage
     * @returns {string} Date formatée
     */
    getFormattedBirthDate() {
        const dateObj = new Date(this.dateNaissance);
        return dateObj.toLocaleDateString('fr-FR');
    }

    /**
     * Formate le numéro de téléphone
     * @returns {string} Téléphone formaté
     */
    getFormattedPhone() {
        if (!this.telephone) return 'Non renseigné';
        const cleaned = this.telephone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        }
        return this.telephone;
    }

    /**
     * Vérifie si le patient est majeur
     * @returns {boolean}
     */
    isAdult() {
        return this.getAge() >= 18;
    }

    /**
     * Récupère le statut avec une classe CSS
     * @returns {object} {text: string, class: string}
     */
    getStatusInfo() {
        const statusMap = {
            'actif': { text: 'Actif', class: 'status-active', icon: 'fa-user-check' },
            'inactif': { text: 'Inactif', class: 'status-inactive', icon: 'fa-user-slash' },
            'archivé': { text: 'Archivé', class: 'status-archived', icon: 'fa-archive' },
            'nouveau': { text: 'Nouveau patient', class: 'status-new', icon: 'fa-user-plus' }
        };
        
        return statusMap[this.statut] || { text: this.statut, class: 'status-unknown', icon: 'fa-user' };
    }

    /**
     * Récupère l'icône du sexe
     * @returns {string} Classe FontAwesome
     */
    getGenderIcon() {
        return this.sexe === 'F' ? 'fa-female' : 'fa-male';
    }

    /**
     * Récupère le libellé du sexe
     * @returns {string}
     */
    getGenderLabel() {
        return this.sexe === 'F' ? 'Féminin' : 'Masculin';
    }

    /**
     * Convertit l'objet en format JSON pour le stockage
     * @returns {object} Données sérialisées
     */
    toJSON() {
        return {
            id: this.id,
            nom: this.nom,
            prenom: this.prenom,
            dateNaissance: this.dateNaissance,
            sexe: this.sexe,
            adresse: this.adresse,
            telephone: this.telephone,
            email: this.email,
            profession: this.profession,
            situationFamiliale: this.situationFamiliale,
            numSecuriteSociale: this.numSecuriteSociale,
            mutuelle: this.mutuelle,
            medecinTraitant: this.medecinTraitant,
            antecedents: this.antecedents,
            notes: this.notes,
            datePremiereVisite: this.datePremiereVisite,
            statut: this.statut,
            age: this.getAge(),
            fullName: this.getFullName()
        };
    }

    /**
     * Crée une instance Patient depuis un objet JSON
     * @param {object} data - Données JSON
     * @returns {Patient} Nouvelle instance
     */
    static fromJSON(data) {
        return new Patient(
            data.id,
            data.nom,
            data.prenom,
            data.dateNaissance,
            data.sexe || 'M',
            data.adresse || '',
            data.telephone || '',
            data.email || '',
            data.profession || '',
            data.situationFamiliale || '',
            data.numSecuriteSociale || '',
            data.mutuelle || '',
            data.medecinTraitant || '',
            data.antecedents || '',
            data.notes || '',
            data.datePremiereVisite || null,
            data.statut || 'actif'
        );
    }

    /**
     * Valide les données d'un patient
     * @param {object} data - Données à valider
     * @returns {object} {isValid: boolean, errors: Array}
     */
    static validate(data) {
        const errors = [];
        
        // Validation du nom
        if (!data.nom || data.nom.trim().length < 2) {
            errors.push('Le nom doit contenir au moins 2 caractères');
        }
        
        // Validation du prénom
        if (!data.prenom || data.prenom.trim().length < 2) {
            errors.push('Le prénom doit contenir au moins 2 caractères');
        }
        
        // Validation de la date de naissance
        if (!data.dateNaissance) {
            errors.push('La date de naissance est obligatoire');
        } else {
            const birthDate = new Date(data.dateNaissance);
            const today = new Date();
            if (birthDate > today) {
                errors.push('La date de naissance ne peut pas être dans le futur');
            }
            if (today.getFullYear() - birthDate.getFullYear() > 120) {
                errors.push('L\'âge du patient semble invraisemblable');
            }
        }
        
        // Validation de l'email si fourni
        if (data.email && data.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('L\'adresse email n\'est pas valide');
            }
        }
        
        // Validation du téléphone si fourni
        if (data.telephone && data.telephone.trim() !== '') {
            const phoneRegex = /^[0-9\s\+\-\(\)]{10,20}$/;
            const cleaned = data.telephone.replace(/\D/g, '');
            if (cleaned.length < 10) {
                errors.push('Le numéro de téléphone doit contenir au moins 10 chiffres');
            }
        }
        
        // Validation du numéro de sécurité sociale si fourni
        if (data.numSecuriteSociale && data.numSecuriteSociale.trim() !== '') {
            const ssRegex = /^[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{6}[0-9]{2}$/;
            const cleaned = data.numSecuriteSociale.replace(/\s/g, '');
            if (!ssRegex.test(cleaned)) {
                errors.push('Le numéro de sécurité sociale n\'est pas valide');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Génère des données de test
     * @param {number} count - Nombre de patients à générer
     * @returns {Array} Liste de patients
     */
    static generateTestData(count = 20) {
        const noms = [
            'Benali', 'Kadri', 'Bouziane', 'Chabane', 'Mansouri',
            'Laribi', 'Hamidou', 'Zerrouki', 'Bouguerra', 'Touati',
            'Saadi', 'Boucherit', 'Mokhtari', 'Haddad', 'Benslimane',
            'Chaoui', 'Derradji', 'Gacem', 'Khelifa', 'Nait'
        ];
        
        const prenomsMasculins = [
            'Karim', 'Mohamed', 'Ali', 'Omar', 'Hakim',
            'Yacine', 'Samir', 'Nabil', 'Farid', 'Rachid',
            'Kamel', 'Bilal', 'Salah', 'Adel', 'Tarek'
        ];
        
        const prenomsFeminins = [
            'Fatima', 'Samira', 'Nadia', 'Leila', 'Soraya',
            'Aicha', 'Yasmina', 'Salima', 'Zohra', 'Khadija',
            'Nawel', 'Djamila', 'Rym', 'Sabrina', 'Ines'
        ];
        
        const profession= [
            'Enseignant', 'Médecin', 'Ingénieur', 'Commerçant', 'Fonctionnaire',
            'Infirmier', 'Avocat', 'Architecte', 'Artisan', 'Agriculteur',
            'Étudiant', 'Retraité', 'Sans emploi', 'Cadre', 'Technicien'
        ];
        
        const situations = [
            'Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)', 'Concubinage'
        ];
        
        const mutuelles = [
            'MGEN', 'Harmonie Mutuelle', 'Mutuelles du Mans', 'AXA', 'Generali',
            'Groupama', 'MAIF', 'MATMUT', 'Swisslife', 'Allianz', 'Aucune'
        ];
        
        const wilayas = [
            '16', '31', '75', '13', '69', '33', '59', '44', '35', '06'
        ];
        
        const patients = [];
        const today = new Date();
        
        for (let i = 1; i <= count; i++) {
            const isFemale = i % 3 === 0;
            const sexe = isFemale ? 'F' : 'M';
            const nom = noms[Math.floor(Math.random() * noms.length)];
            const prenom = isFemale 
                ? prenomsFeminins[Math.floor(Math.random() * prenomsFeminins.length)]
                : prenomsMasculins[Math.floor(Math.random() * prenomsMasculins.length)];
            
            // Date de naissance aléatoire (entre 18 et 80 ans)
            const minAge = 18;
            const maxAge = 80;
            const age = minAge + Math.floor(Math.random() * (maxAge - minAge + 1));
            const birthYear = today.getFullYear() - age;
            const birthMonth = Math.floor(Math.random() * 12) + 1;
            const birthDay = Math.floor(Math.random() * 28) + 1;
            const dateNaissance = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
            
            // Date de première visite (dans les 2 dernières années)
            const visitDaysAgo = Math.floor(Math.random() * 730);
            const firstVisit = new Date(today);
            firstVisit.setDate(firstVisit.getDate() - visitDaysAgo);
            const datePremiereVisite = firstVisit.toISOString().split('T')[0];
            
            // Générer un numéro de téléphone
            const telephone = `0${Math.floor(Math.random() * 6) + 1}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
            
            // Générer un email
            const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}@example.com`;
            
            // Statut aléatoire (majorité active)
            const statutRand = Math.random();
            let statut = 'actif';
            if (statutRand > 0.9) statut = 'inactif';
            if (statutRand > 0.95) statut = 'archivé';
            if (visitDaysAgo < 30) statut = 'nouveau';
            
            patients.push(new Patient(
                i,
                nom,
                prenom,
                dateNaissance,
                sexe,
                `${Math.floor(Math.random() * 200) + 1} Rue des Lilas, ${wilayas[Math.floor(Math.random() * wilayas.length)]}`,
                telephone,
                email,
                professions[Math.floor(Math.random() * professions.length)],
                situations[Math.floor(Math.random() * situations.length)],
                `1${Math.floor(Math.random() * 100).toString().padStart(2, '0')}0${Math.floor(Math.random() * 12).toString().padStart(2, '0')}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
                mutuelles[Math.floor(Math.random() * mutuelles.length)],
                ['Dr. Martin', 'Dr. Bernard', 'Dr. Dubois', 'Dr. Leroy', 'Dr. Moreau'][Math.floor(Math.random() * 5)],
                `Antécédents: ${['Hypertension', 'Diabète', 'Asthme', 'Allergies', 'Aucun'][Math.floor(Math.random() * 5)]}`,
                `Patient ${i % 3 === 0 ? 'suivi régulièrement' : i % 3 === 1 ? 'à surveiller' : 'stable'}`,
                datePremiereVisite,
                statut
            ));
        }
        
        return patients;
    }
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Patient;
}

// Export pour le navigateur
if (typeof window !== 'undefined') {
    window.Patient = Patient;
}