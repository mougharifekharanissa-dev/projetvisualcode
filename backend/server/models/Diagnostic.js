// backend/server/models/Diagnostic.js
class Diagnostic {
    constructor(id, code, nom) {
        this.id = id;
        this.code = code;
        this.nom = nom;
    }

    getInfo() {
        return {
            id: this.id,
            code: this.code,
            nom: this.nom
        };
    }
}

module.exports = Diagnostic;