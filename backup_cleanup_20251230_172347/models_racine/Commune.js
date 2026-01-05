class Commune {
    constructor(id, nom, wilaya_id) {
        this.id = id;
        this.nom = nom;
        this.wilaya_id = wilaya_id;
    }

    getInfo() {
        return {
            id: this.id,
            nom: this.nom,
            wilaya_id: this.wilaya_id
        };
    }
}

module.exports = Commune;