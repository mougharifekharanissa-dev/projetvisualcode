/**
 * Modèle Consultation pour le Cabinet Psychiatrique
 * Gère les données des consultations médicales
 */

class Consultation {
    /**
     * Constructeur d'une consultation
     * @param {number} id - Identifiant unique
     * @param {number} patientId - ID du patient
     * @param {string} date - Date de consultation (YYYY-MM-DD)
     * @param {string} type - Type de consultation
     * @param {string} motif - Motif de la consultation
     * @param {string} notes - Notes médicales
     * @param {string} prescription - Prescription médicale
     * @param {string} duree - Durée (en minutes)
     * @param {string} statut - Statut (planifiée, réalisée, annulée)
     */
    constructor(id, patientId, date, type, motif, notes, prescription, duree, statut) {
        this.id = id;
        this.patientId = patientId;
        this.date = date;
        this.type = type || 'Consultation standard';
        this.motif = motif || '';
        this.notes = notes || '';
        this.prescription = prescription || '';
        this.duree = duree || '30';
        this.statut = statut || 'planifiée';
    }

    /**
     * Formate la date pour l'affichage
     * @returns {string} Date formatée
     */
    getFormattedDate() {
        const dateObj = new Date(this.date);
        return dateObj.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Formate l'heure pour l'affichage
     * @returns {string} Heure formatée
     */
    getFormattedTime() {
        // Si la date contient une heure, on la formate
        if (this.date.includes('T')) {
            const dateObj = new Date(this.date);
            return dateObj.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return '09:00'; // Heure par défaut
    }

    /**
     * Récupère le statut avec une classe CSS
     * @returns {object} {text: string, class: string}
     */
    getStatusInfo() {
        const statusMap = {
            'planifiée': { text: 'Planifiée', class: 'status-planned' },
            'réalisée': { text: 'Réalisée', class: 'status-completed' },
            'annulée': { text: 'Annulée', class: 'status-cancelled' },
            'en_attente': { text: 'En attente', class: 'status-pending' }
        };
        
        return statusMap[this.statut] || { text: this.statut, class: 'status-unknown' };
    }

    /**
     * Vérifie si la consultation est urgente
     * @returns {boolean}
     */
    isUrgent() {
        const urgentKeywords = ['urgence', 'urgent', 'crise', 'aigu', 'prioritaire'];
        const text = (this.motif + ' ' + this.notes).toLowerCase();
        return urgentKeywords.some(keyword => text.includes(keyword));
    }

    /**
     * Convertit l'objet en format JSON pour le stockage
     * @returns {object} Données sérialisées
     */
    toJSON() {
        return {
            id: this.id,
            patientId: this.patientId,
            date: this.date,
            type: this.type,
            motif: this.motif,
            notes: this.notes,
            prescription: this.prescription,
            duree: this.duree,
            statut: this.statut
        };
    }

    /**
     * Crée une instance Consultation depuis un objet JSON
     * @param {object} data - Données JSON
     * @returns {Consultation} Nouvelle instance
     */
    static fromJSON(data) {
        return new Consultation(
            data.id,
            data.patientId,
            data.date,
            data.type,
            data.motif,
            data.notes,
            data.prescription,
            data.duree,
            data.statut
        );
    }

    /**
     * Génère des données de test
     * @param {number} count - Nombre de consultations à générer
     * @param {Array} patientIds - Liste des IDs patients disponibles
     * @returns {Array} Liste de consultations
     */
    static generateTestData(count = 10, patientIds = [1, 2, 3, 4, 5]) {
        const types = [
            'Première consultation',
            'Consultation de suivi',
            'Consultation d\'urgence',
            'Téléconsultation',
            'Consultation familiale'
        ];
        
        const motifs = [
            'Anxiété généralisée',
            'Dépression',
            'Trouble bipolaire',
            'Trouble du sommeil',
            'Stress post-traumatique',
            'Trouble obsessionnel compulsif',
            'Trouble de l\'attention',
            'Burn-out professionnel'
        ];
        
        const statuts = ['planifiée', 'réalisée', 'annulée', 'en_attente'];
        
        const consultations = [];
        const today = new Date();
        
        for (let i = 1; i <= count; i++) {
            // Date aléatoire dans les 30 derniers jours
            const daysOffset = Math.floor(Math.random() * 30) - 15;
            const date = new Date(today);
            date.setDate(date.getDate() + daysOffset);
            
            consultations.push(new Consultation(
                i,
                patientIds[Math.floor(Math.random() * patientIds.length)],
                date.toISOString().split('T')[0],
                types[Math.floor(Math.random() * types.length)],
                motifs[Math.floor(Math.random() * motifs.length)],
                `Notes médicales pour la consultation ${i}. Le patient présente des améliorations notables.`,
                i % 3 === 0 ? 'Sertraline 50mg - 1 comprimé par jour\nTrazodone 100mg - au coucher' : '',
                ['30', '45', '60'][Math.floor(Math.random() * 3)],
                statuts[Math.floor(Math.random() * statuts.length)]
            ));
        }
        
        return consultations;
    }
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Consultation;
}

// Export pour le navigateur
if (typeof window !== 'undefined') {
    window.Consultation = Consultation;
}