class Symptome {
    constructor(id, nom, description = '', categorie = 'général', severite = 1) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.categorie = categorie;
        this.severite = severite; // 1 à 5
        this.dateCreation = new Date();
        this.dateModification = new Date();
    }

    mettreAJour(nouveauxDetails) {
        Object.assign(this, nouveauxDetails);
        this.dateModification = new Date();
        return this;
    }

    getInfo() {
        return {
            id: this.id,
            nom: this.nom,
            description: this.description,
            categorie: this.categorie,
            severite: this.severite,
            dateCreation: this.dateCreation,
            dateModification: this.dateModification
        };
    }
}

module.exports = Symptome;