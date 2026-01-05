class Wilaya {
    constructor(id, nom, code) {
        this.id = id;
        this.nom = nom;
        this.code = code;
    }

    getInfo() {
        return {
            id: this.id,
            nom: this.nom,
            code: this.code
        };
    }
}

module.exports = Wilaya;