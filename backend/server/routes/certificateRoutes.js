const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const CertificateTemplate = require('../models/CertificateTemplate');
const Cabinet = require('../models/Cabinet');

// GET /api/certificates/templates
router.get('/templates', (req, res) => {
  try {
    const templates = Cabinet.instance.certificateTemplates || [CertificateTemplate.getDefaultTemplate()];
    res.json(templates.map(t => t.toJSON ? t.toJSON() : t));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/certificates/templates/:id
router.get('/templates/:id', (req, res) => {
  try {
    const templates = Cabinet.instance.certificateTemplates || [CertificateTemplate.getDefaultTemplate()];
    const template = templates.find(t => (t.id || t) === req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template non trouvé' });
    }
    res.json(template.toJSON ? template.toJSON() : template);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/certificates
router.post('/', (req, res) => {
  try {
    const { patientId, templateId, customFields } = req.body;

    if (!patientId || !templateId) {
      return res.status(400).json({ message: 'patientId et templateId obligatoires' });
    }

    if (!Array.isArray(customFields) || customFields.length === 0) {
      return res.status(400).json({ message: 'customFields doit être non vide' });
    }

    if (!Cabinet.instance.certificates) {
      Cabinet.instance.certificates = [];
    }

    const certificate = new Certificate(
      `cert_${Date.now()}`,
      patientId,
      templateId,
      customFields,
      new Date()
    );

    Cabinet.instance.certificates.push(certificate);
    res.status(201).json(certificate.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PUT /api/certificates/:id
router.put('/:id', (req, res) => {
  try {
    const { customFields } = req.body;

    if (!Cabinet.instance.certificates) {
      Cabinet.instance.certificates = [];
    }

    const certIndex = Cabinet.instance.certificates.findIndex(c => c.id === req.params.id);
    if (certIndex === -1) {
      return res.status(404).json({ message: 'Certificat non trouvé' });
    }

    Cabinet.instance.certificates[certIndex].customFields = customFields;
    res.json(Cabinet.instance.certificates[certIndex].toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/certificates/:patientId
router.get('/:patientId', (req, res) => {
  try {
    const certs = Cabinet.instance.certificates?.filter(c => c.patientId === req.params.patientId) || [];
    res.json(certs.map(c => c.toJSON ? c.toJSON() : c));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
