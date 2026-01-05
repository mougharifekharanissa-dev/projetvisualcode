class Profession {
    constructor(id, nom) {
        this.id = id;
        this.nom = nom;
    }

    getInfo() {
        return {
            id: this.id,
            nom: this.nom
        };
    }
}

module.exports = Profession;