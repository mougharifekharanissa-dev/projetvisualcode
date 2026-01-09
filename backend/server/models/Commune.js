class Commune {
    constructor(id, nom, wilaya_id, code = null, code_postal = null) {
        this.id = id;
        this.nom = nom;
        this.wilaya_id = wilaya_id;
        this.code = code;           // NOUVEAU
        this.code_postal = code_postal; // NOUVEAU
    }

    getInfo() {
        return {
            id: this.id,
            code: this.code,           // NOUVEAU
            nom: this.nom,
            wilaya_id: this.wilaya_id,
            code_postal: this.code_postal // NOUVEAU
        };
    }
}

module.exports = Commune;