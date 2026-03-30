class Certificate {
  constructor(id, patientId, templateId, customFields = [], createdAt = new Date()) {
    this.id = id;
    this.patientId = patientId;
    this.templateId = templateId;
    this.customFields = customFields;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      templateId: this.templateId,
      customFields: this.customFields,
      createdAt: this.createdAt
    };
  }

  static fromJSON(data) {
    return new Certificate(
      data.id,
      data.patientId,
      data.templateId,
      data.customFields || [],
      data.createdAt || new Date()
    );
  }
}

module.exports = Certificate;
