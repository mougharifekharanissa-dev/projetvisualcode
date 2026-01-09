// backend/server/models/Traitement.js
class Traitement {
    constructor(id, nom, forme) {
        this.id = id;
        this.nom = nom;
        this.type= type;
        this.categorie= this.categorie;
        this.forme = forme;
    }

    getInfo() {
        return {
            id: this.id,
            nom: this.nom,
            type:this.type,
            categorie:this.categorie,
            forme: this.forme
        };
    }
}

module.exports = Traitement;