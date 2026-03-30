class CertificateTemplate {
  constructor(id, name, fields = []) {
    this.id = id;
    this.name = name;
    this.fields = fields;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      fields: this.fields
    };
  }

  static getDefaultTemplate() {
    return new CertificateTemplate('default', 'Certificat Médical Standard', [
      { key: 'nom', label: 'Nom', type: 'text', required: true },
      { key: 'prenom', label: 'Prénom', type: 'text', required: true },
      { key: 'dateNaissance', label: 'Date de naissance', type: 'date', required: true },
      { key: 'profession', label: 'Profession', type: 'text', required: false },
      { key: 'dateConsultation', label: 'Date de consultation', type: 'date', required: true },
      { key: 'observation', label: 'Observation', type: 'textarea', required: true }
    ]);
  }

  static fromJSON(data) {
    return new CertificateTemplate(data.id, data.name, data.fields || []);
  }
}

module.exports = CertificateTemplate;
