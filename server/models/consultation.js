// server/models/Consultation.js
class Consultation {
    static getAll(callback) {
        // Données temporaires
        const consultations = [
            { id: 1, patientId: 1, date: "2024-01-15", type: "Première consultation", notes: "Anxiété généralisée" },
            { id: 2, patientId: 2, date: "2024-01-16", type: "Consultation de suivi", notes: "Amélioration notée" }
        ];
        callback(null, consultations);
    }
}

module.exports = Consultation;