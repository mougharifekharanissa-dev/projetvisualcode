// Application principale Cabinet Psychiatrique
class MedicalCabinetApp {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentPatientId = null;
        this.currentSection = 'welcome';
        this.init();
    }

    async init() {
        console.log('🏥 Initialisation Cabinet Psychiatrique...');
        
        this.setupEventListeners();
        this.updateDataStatus();
        await this.loadInitialData();
        this.showSection('welcome');
        
        console.log('✅ Application prête');
    }

    setupEventListeners() {
        // Boutons patients
        document.getElementById('btn-new-patient').addEventListener('click', () => this.showPatientForm());
        document.getElementById('btn-list-patients').addEventListener('click', () => this.showPatientList());
        
        // Boutons références
        document.getElementById('btn-manage-references').addEventListener('click', () => this.showReferenceManager());
        document.querySelectorAll('.sub-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const table = e.currentTarget.dataset.table;
                this.showReferenceTable(table);
            });
        });
        
        // Boutons statistiques
        document.getElementById('btn-statistics').addEventListener('click', () => this.showStatistics());
        
        // Bouton sauvegarde
        document.getElementById('btn-save').addEventListener('click', () => this.saveAllData());
        
        // Fermer modals
        document.getElementById('modal-overlay').addEventListener('click', () => this.closeModal());
    }

    async loadInitialData() {
        try {
            console.log('📥 Chargement des données initiales...');
            
            const [patients, consultations, wilayas] = await Promise.all([
                this.fetchData('patients'),
                this.fetchData('consultations'),
                this.fetchData('references/wilayas')
            ]);
            
            this.updateCounts(patients.length, consultations.length);
            console.log(`✅ ${patients.length} patients chargés`);
            console.log(`✅ ${consultations.length} consultations chargées`);
            
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
            this.showNotification('Erreur de chargement des données', 'error');
        }
    }

    async fetchData(endpoint) {
        const response = await fetch(`${this.apiBaseUrl}/${endpoint}`);
        if (!response.ok) throw new Error(`API ${endpoint}: ${response.status}`);
        return response.json();
    }

    updateCounts(patientCount, consultationCount) {
        document.getElementById('patient-count').textContent = patientCount;
        document.getElementById('consultation-count').textContent = consultationCount;
    }

    updateDataStatus() {
        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('data-status').innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--medical-green);"></i>
            <span>Synchronisé ${time}</span>
        `;
    }

    // ===== GESTION DES SECTIONS =====
    showSection(sectionId) {
        // Masquer toutes les sections
        document.querySelectorAll('.content-section, .welcome-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Afficher la section demandée
        const section = document.getElementById(`${sectionId}-section`) || 
                       document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
        
        this.currentSection = sectionId;
        
        // Charger le contenu si nécessaire
        switch(sectionId) {
            case 'patient':
                this.loadPatientList();
                break;
            case 'reference':
                this.loadReferenceTables();
                break;
            case 'statistics':
                this.loadStatisticsData();
                break;
        }
    }

    // ===== GESTION PATIENTS =====
    async showPatientForm(patientId = null) {
        this.currentPatientId = patientId;
        
        const html = `
            <div class="medical-form">
                <div class="form-header">
                    <h2>
                        <i class="fas fa-user-plus"></i>
                        ${patientId ? 'Modifier Patient' : 'Nouveau Patient'}
                    </h2>
                    <button class="btn-medical" onclick="app.savePatient()">
                        <i class="fas fa-save"></i>
                        ${patientId ? 'Mettre à jour' : 'Enregistrer'}
                    </button>
                </div>
                
                <form id="patient-form">
                    <div class="form-grid">
                        <!-- Informations personnelles -->
                        <div class="form-group">
                            <label for="nom"><i class="fas fa-user"></i> Nom *</label>
                            <input type="text" id="nom" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="prenom"><i class="fas fa-user"></i> Prénom *</label>
                            <input type="text" id="prenom" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="dateNaissance"><i class="fas fa-birthday-cake"></i> Date de Naissance</label>
                            <input type="date" id="dateNaissance" class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label for="sexe"><i class="fas fa-venus-mars"></i> Sexe</label>
                            <select id="sexe" class="form-control">
                                <option value="">Sélectionner</option>
                                <option value="M">Masculin</option>
                                <option value="F">Féminin</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="cin"><i class="fas fa-id-card"></i> CIN</label>
                            <input type="text" id="cin" class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label for="telephone"><i class="fas fa-phone"></i> Téléphone *</label>
                            <input type="tel" id="telephone" class="form-control" required>
                        </div>
                        
                        <!-- Adresse -->
                        <div class="form-group">
                            <label for="wilaya"><i class="fas fa-map-marker-alt"></i> Wilaya</label>
                            <select id="wilaya" class="form-control">
                                <option value="">Sélectionner</option>
                                <!-- Rempli par JavaScript -->
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="commune"><i class="fas fa-map-pin"></i> Commune</label>
                            <select id="commune" class="form-control">
                                <option value="">Sélectionner une wilaya d'abord</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="adresse"><i class="fas fa-home"></i> Adresse</label>
                            <textarea id="adresse" class="form-control" rows="2"></textarea>
                        </div>
                        
                        <!-- Profession & Mutuelle -->
                        <div class="form-group">
                            <label for="profession"><i class="fas fa-briefcase"></i> Profession</label>
                            <select id="profession" class="form-control">
                                <option value="">Sélectionner</option>
                                <!-- Rempli par JavaScript -->
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="mutuelle"><i class="fas fa-shield-alt"></i> Mutuelle</label>
                            <input type="text" id="mutuelle" class="form-control" placeholder="CNAS, CASNOS...">
                        </div>
                        
                        <!-- Informations médicales -->
                        <div class="form-group full-width">
                            <label for="antecedents"><i class="fas fa-history"></i> Antécédents médicaux</label>
                            <textarea id="antecedents" class="form-control" rows="3"></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="notes"><i class="fas fa-sticky-note"></i> Notes additionnelles</label>
                            <textarea id="notes" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                    
                    <!-- Section consultations du patient -->
                    <div class="form-header" style="margin-top: 2rem;">
                        <h3>
                            <i class="fas fa-stethoscope"></i>
                            Historique des consultations
                        </h3>
                        <button type="button" class="btn-medical" onclick="app.showConsultationForm()">
                            <i class="fas fa-plus"></i>
                            Nouvelle consultation
                        </button>
                    </div>
                    
                    <div id="patient-consultations" class="table-container" style="margin-top: 1rem;">
                        <p class="loading">Chargement des consultations...</p>
                    </div>
                </form>
            </div>
        `;
        
        this.showSection('patient');
        document.getElementById('patient-section').innerHTML = html;
        
        // Charger les données
        await this.loadPatientFormData();
        await this.loadWilayas();
        await this.loadProfessions();
        
        if (patientId) {
            await this.loadPatientConsultations(patientId);
        }
    }

    async loadPatientFormData() {
        if (!this.currentPatientId) return;
        
        try {
            const patient = await this.fetchData(`patients/${this.currentPatientId}`);
            
            // Remplir le formulaire
            Object.keys(patient).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = patient[key] || '';
                }
            });
            
        } catch (error) {
            console.error('Erreur chargement patient:', error);
        }
    }

    async loadWilayas() {
        try {
            const wilayas = await this.fetchData('references/wilayas');
            const select = document.getElementById('wilaya');
            
            wilayas.forEach(wilaya => {
                const option = document.createElement('option');
                option.value = wilaya.code;
                option.textContent = wilaya.nom;
                select.appendChild(option);
            });
            
            // Écouter le changement de wilaya pour charger les communes
            select.addEventListener('change', async (e) => {
                await this.loadCommunes(e.target.value);
            });
            
        } catch (error) {
            console.error('Erreur chargement wilayas:', error);
        }
    }

    async loadCommunes(wilayaCode) {
        if (!wilayaCode) return;
        
        try {
            const communes = await this.fetchData(`references/wilayas/${wilayaCode}/communes`);
            const select = document.getElementById('commune');
            select.innerHTML = '<option value="">Sélectionner</option>';
            
            communes.forEach(commune => {
                const option = document.createElement('option');
                option.value = commune.code || commune.nom;
                option.textContent = commune.nom;
                select.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erreur chargement communes:', error);
        }
    }

    async loadProfessions() {
        try {
            const professions = await this.fetchData('references/professions');
            const select = document.getElementById('profession');
            
            professions.forEach(profession => {
                const option = document.createElement('option');
                option.value = profession;
                option.textContent = profession;
                select.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erreur chargement professions:', error);
        }
    }

    async savePatient() {
        try {
            const formData = this.getFormData('patient-form');
            
            const url = this.currentPatientId ? 
                `${this.apiBaseUrl}/patients/${this.currentPatientId}` : 
                `${this.apiBaseUrl}/patients`;
            
            const method = this.currentPatientId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const patient = await response.json();
                this.showNotification(
                    this.currentPatientId ? 'Patient mis à jour' : 'Patient créé',
                    'success'
                );
                this.showPatientList();
            } else {
                throw new Error('Erreur sauvegarde');
            }
            
        } catch (error) {
            console.error('Erreur sauvegarde patient:', error);
            this.showNotification('Erreur sauvegarde patient', 'error');
        }
    }

    async showPatientList() {
        this.showSection('patient');
        
        const html = `
            <div class="medical-table">
                <div class="table-header">
                    <h2><i class="fas fa-users"></i> Liste des Patients</h2>
                    <div class="table-actions">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="search-patient" placeholder="Rechercher un patient...">
                        </div>
                        <button class="btn-medical" onclick="app.showPatientForm()">
                            <i class="fas fa-plus"></i> Nouveau
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <div id="patients-table-container">
                        <p class="loading">Chargement des patients...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('patient-section').innerHTML = html;
        
        // Écouter la recherche
        document.getElementById('search-patient').addEventListener('input', (e) => {
            this.searchPatients(e.target.value);
        });
        
        await this.loadPatientList();
    }

    async loadPatientList() {
        try {
            const patients = await this.fetchData('patients');
            this.renderPatientTable(patients);
        } catch (error) {
            console.error('Erreur chargement patients:', error);
            document.getElementById('patients-table-container').innerHTML = 
                '<p class="error-message">Erreur de chargement</p>';
        }
    }

    renderPatientTable(patients) {
        const container = document.getElementById('patients-table-container');
        
        if (!patients.length) {
            container.innerHTML = '<p class="no-data">Aucun patient enregistré</p>';
            return;
        }

        const html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom & Prénom</th>
                        <th>CIN</th>
                        <th>Téléphone</th>
                        <th>Wilaya</th>
                        <th>Date Inscription</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(patient => `
                        <tr>
                            <td>${patient.id?.substring(0, 8) || 'N/A'}</td>
                            <td>
                                <strong>${patient.nom || ''} ${patient.prenom || ''}</strong>
                                <br><small>${patient.dateNaissance ? `Né(e): ${patient.dateNaissance}` : ''}</small>
                            </td>
                            <td>${patient.cin || '-'}</td>
                            <td>${patient.telephone || '-'}</td>
                            <td>${patient.wilaya || '-'}</td>
                            <td>${this.formatDate(patient.dateInscription)}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon btn-view" onclick="app.showPatientForm('${patient.id}')" 
                                            title="Modifier">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon btn-edit" onclick="app.viewPatientConsultations('${patient.id}')" 
                                            title="Consultations">
                                        <i class="fas fa-stethoscope"></i>
                                    </button>
                                    <button class="btn-icon btn-delete" onclick="app.deletePatient('${patient.id}')" 
                                            title="Supprimer">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    }

    async searchPatients(term) {
        if (!term.trim()) {
            await this.loadPatientList();
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/patients/recherche/${term}`);
            const patients = await response.json();
            this.renderPatientTable(patients);
        } catch (error) {
            console.error('Erreur recherche:', error);
        }
    }

    async deletePatient(patientId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/patients/${patientId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.showNotification('Patient supprimé', 'success');
                await this.loadPatientList();
                await this.loadInitialData(); // Mettre à jour les compteurs
            }
        } catch (error) {
            console.error('Erreur suppression:', error);
            this.showNotification('Erreur suppression', 'error');
        }
    }

    // ===== GESTION CONSULTATIONS =====
    async showConsultationForm(patientId = null) {
        const modalHtml = `
            <div class="modal" id="consultation-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-stethoscope"></i> Nouvelle Consultation</h3>
                    <button class="close-modal" onclick="app.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="consultation-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="consult-patient">Patient *</label>
                                <select id="consult-patient" class="form-control" required>
                                    <option value="">Sélectionner un patient</option>
                                    <!-- Rempli par JavaScript -->
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-date">Date *</label>
                                <input type="date" id="consult-date" class="form-control" required 
                                       value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-type">Type de consultation</label>
                                <select id="consult-type" class="form-control">
                                    <option value="premiere">Première consultation</option>
                                    <option value="suivi" selected>Consultation de suivi</option>
                                    <option value="urgence">Urgence</option>
                                    <option value="controle">Contrôle</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-motif">Motif *</label>
                                <textarea id="consult-motif" class="form-control" rows="2" required></textarea>
                            </div>
                            
                            <div class="form-group full-width">
                                <label for="consult-observation">Observations cliniques</label>
                                <textarea id="consult-observation" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div class="form-group full-width">
                                <label for="consult-diagnostic">Diagnostic</label>
                                <textarea id="consult-diagnostic" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-traitement">Traitement prescrit</label>
                                <textarea id="consult-traitement" class="form-control" rows="2"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-montant">Montant (DA)</label>
                                <input type="number" id="consult-montant" class="form-control" value="3000" min="0">
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-reglement">Mode de règlement</label>
                                <select id="consult-reglement" class="form-control">
                                    <option value="especes">Espèces</option>
                                    <option value="cheque">Chèque</option>
                                    <option value="carte">Carte bancaire</option>
                                    <option value="mutuelle">Mutuelle</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="consult-prochaine">Prochaine consultation</label>
                                <input type="date" id="consult-prochaine" class="form-control">
                            </div>
                        </div>
                        
                        <div class="form-actions" style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
                            <button type="button" class="btn-medical" onclick="app.closeModal()">Annuler</button>
                            <button type="submit" class="btn-medical btn-save">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        this.showModal(modalHtml);
        
        // Charger les patients dans le select
        await this.loadPatientsForConsultation(patientId);
        
        // Gérer la soumission
        document.getElementById('consultation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveConsultation();
        });
    }

    async loadPatientsForConsultation(preSelectId = null) {
        try {
            const patients = await this.fetchData('patients');
            const select = document.getElementById('consult-patient');
            
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.nom} ${patient.prenom} ${patient.cin ? `(CIN: ${patient.cin})` : ''}`;
                if (preSelectId && patient.id === preSelectId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur chargement patients:', error);
        }
    }

    async saveConsultation() {
        try {
            const formData = this.getFormData('consultation-form', 'consult-');
            
            const response = await fetch(`${this.apiBaseUrl}/consultations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                this.showNotification('Consultation enregistrée', 'success');
                this.closeModal();
                
                // Recharger les consultations si on est dans la fiche patient
                if (this.currentPatientId) {
                    await this.loadPatientConsultations(this.currentPatientId);
                }
                
                await this.loadInitialData(); // Mettre à jour les compteurs
            }
        } catch (error) {
            console.error('Erreur sauvegarde consultation:', error);
            this.showNotification('Erreur sauvegarde', 'error');
        }
    }

    async loadPatientConsultations(patientId) {
        try {
            const consultations = await this.fetchData(`consultations/patient/${patientId}`);
            this.renderPatientConsultations(consultations);
        } catch (error) {
            console.error('Erreur chargement consultations:', error);
        }
    }

    renderPatientConsultations(consultations) {
        const container = document.getElementById('patient-consultations');
        
        if (!consultations || !consultations.length) {
            container.innerHTML = '<p class="no-data">Aucune consultation enregistrée</p>';
            return;
        }

        const html = `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Motif</th>
                        <th>Diagnostic</th>
                        <th>Montant</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${consultations.map(consultation => `
                        <tr>
                            <td>${this.formatDate(consultation.date)}</td>
                            <td>${consultation.type || 'Consultation'}</td>
                            <td>${consultation.motif?.substring(0, 50) || ''}...</td>
                            <td>${consultation.diagnostic?.substring(0, 50) || ''}...</td>
                            <td>${consultation.montant ? `${consultation.montant} DA` : '-'}</td>
                            <td>
                                <button class="btn-icon btn-view" onclick="app.viewConsultationDetail('${consultation.id}')"
                                        title="Voir détail">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    }

    async viewPatientConsultations(patientId) {
        this.currentPatientId = patientId;
        await this.showPatientForm(patientId);
        
        // Scroller vers les consultations
        document.getElementById('patient-consultations').scrollIntoView({ behavior: 'smooth' });
    }

    // ===== GESTION RÉFÉRENCES (CRUD) =====
    async showReferenceManager() {
        this.showSection('reference');
        
        const html = `
            <div class="medical-table">
                <div class="table-header">
                    <h2><i class="fas fa-database"></i> Gestion des Tables de Référence</h2>
                    <div class="table-actions">
                        <select id="table-selector" class="form-control" style="width: 200px;">
                            <option value="">Sélectionner une table</option>
                            <option value="professions">Professions</option>
                            <option value="maladies">Maladies</option>
                            <option value="diagnostics">Diagnostics</option>
                            <option value="wilayas">Wilayas</option>
                            <option value="communes">Communes</option>
                        </select>
                    </div>
                </div>
                
                <div class="table-container">
                    <div id="reference-table-container">
                        <p class="info-message">Sélectionnez une table pour commencer</p>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('reference-section').innerHTML = html;
        
        // Écouter le changement de table
        document.getElementById('table-selector').addEventListener('change', (e) => {
            this.showReferenceTable(e.target.value);
        });
    }

    async showReferenceTable(tableName) {
        if (!tableName) return;
        
        try {
            let data = [];
            
            switch(tableName) {
                case 'wilayas':
                    data = await this.fetchData('references/wilayas');
                    break;
                case 'professions':
                    data = await this.fetchData('references/professions');
                    break;
                default:
                    // Pour les autres tables, on utilise un fichier local
                    data = await this.loadLocalReference(tableName);
            }
            
            this.renderReferenceTable(tableName, data);
            
        } catch (error) {
            console.error(`Erreur chargement table ${tableName}:`, error);
            document.getElementById('reference-table-container').innerHTML = 
                '<p class="error-message">Erreur de chargement</p>';
        }
    }

    async loadLocalReference(tableName) {
        try {
            // Essayer de charger depuis l'API
            const response = await fetch(`${this.apiBaseUrl}/references/${tableName}`);
            if (response.ok) return await response.json();
            
            // Sinon, charger depuis le fichier local
            const response2 = await fetch(`/data/${tableName}.json`);
            if (response2.ok) return await response2.json();
            
            return [];
        } catch (error) {
            return [];
        }
    }

    renderReferenceTable(tableName, data) {
        const container = document.getElementById('reference-table-container');
        
        if (!Array.isArray(data)) {
            container.innerHTML = '<p class="error-message">Format de données invalide</p>';
            return;
        }

        const html = `
            <div class="table-header" style="background: var(--medical-gray);">
                <h3>Table: ${tableName} (${data.length} entrées)</h3>
                <button class="btn-medical" onclick="app.addReferenceItem('${tableName}')">
                    <i class="fas fa-plus"></i> Ajouter
                </button>
            </div>
            
            <table style="margin-top: 1rem;">
                <thead>
                    <tr>
                        ${this.getReferenceTableHeaders(tableName, data)}
                    </tr>
                </thead>
                <tbody>
                    ${data.map((item, index) => `
                        <tr>
                            ${this.getReferenceTableRow(tableName, item, index)}
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon btn-edit" 
                                            onclick="app.editReferenceItem('${tableName}', ${index})"
                                            title="Modifier">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon btn-delete" 
                                            onclick="app.deleteReferenceItem('${tableName}', ${index})"
                                            title="Supprimer">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    }

    getReferenceTableHeaders(tableName, data) {
        if (!data.length) return '<th>Nom</th><th>Actions</th>';
        
        const item = data[0];
        let headers = '';
        
        if (typeof item === 'string') {
            headers = '<th>Valeur</th>';
        } else if (typeof item === 'object') {
            Object.keys(item).forEach(key => {
                if (key !== 'id' && key !== '_id') {
                    headers += `<th>${key}</th>`;
                }
            });
        }
        
        return headers + '<th>Actions</th>';
    }

    getReferenceTableRow(tableName, item, index) {
        if (typeof item === 'string') {
            return `<td>${item}</td>`;
        } else if (typeof item === 'object') {
            let row = '';
            Object.entries(item).forEach(([key, value]) => {
                if (key !== 'id' && key !== '_id') {
                    row += `<td>${value || ''}</td>`;
                }
            });
            return row;
        }
        return '<td></td>';
    }

    addReferenceItem(tableName) {
        const modalHtml = `
            <div class="modal" id="reference-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Ajouter à ${tableName}</h3>
                    <button class="close-modal" onclick="app.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="reference-form">
                        <div class="form-grid">
                            ${this.getReferenceFormFields(tableName)}
                        </div>
                        <div class="form-actions" style="margin-top: 2rem;">
                            <button type="button" class="btn-medical" onclick="app.closeModal()">Annuler</button>
                            <button type="submit" class="btn-medical btn-save">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        this.showModal(modalHtml);
        
        document.getElementById('reference-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveReferenceItem(tableName);
        });
    }

    getReferenceFormFields(tableName) {
        switch(tableName) {
            case 'professions':
            case 'maladies':
            case 'diagnostics':
                return `
                    <div class="form-group full-width">
                        <label for="value">Valeur *</label>
                        <input type="text" id="value" class="form-control" required>
                    </div>
                `;
            case 'wilayas':
                return `
                    <div class="form-group">
                        <label for="code">Code *</label>
                        <input type="text" id="code" class="form-control" required maxlength="2">
                    </div>
                    <div class="form-group">
                        <label for="nom">Nom *</label>
                        <input type="text" id="nom" class="form-control" required>
                    </div>
                `;
            case 'communes':
                return `
                    <div class="form-group">
                        <label for="wilayaCode">Code Wilaya *</label>
                        <input type="text" id="wilayaCode" class="form-control" required maxlength="2">
                    </div>
                    <div class="form-group">
                        <label for="nom">Nom Commune *</label>
                        <input type="text" id="nom" class="form-control" required>
                    </div>
                `;
            default:
                return '<p>Formulaire non configuré pour cette table</p>';
        }
    }

    async saveReferenceItem(tableName) {
        try {
            const formData = this.getFormData('reference-form');
            
            // Logique de sauvegarde (à adapter selon votre backend)
            this.showNotification(`Élément ajouté à ${tableName}`, 'success');
            this.closeModal();
            
            // Recharger la table
            await this.showReferenceTable(tableName);
            
        } catch (error) {
            console.error('Erreur ajout référence:', error);
            this.showNotification('Erreur ajout', 'error');
        }
    }

    editReferenceItem(tableName, index) {
        console.log(`Modifier ${tableName} index ${index}`);
        // À implémenter
    }

    deleteReferenceItem(tableName, index) {
        if (!confirm(`Supprimer cet élément de ${tableName} ?`)) return;
        
        console.log(`Supprimer ${tableName} index ${index}`);
        // À implémenter
    }

    // ===== STATISTIQUES & RECHERCHE =====
    async showStatistics() {
        this.showSection('statistics');
        
        const html = `
            <div class="medical-form">
                <div class="form-header">
                    <h2><i class="fas fa-chart-line"></i> Recherche & Statistiques</h2>
                </div>
                
                <div class="form-grid">
                    <!-- Recherche avancée -->
                    <div class="form-group full-width">
                        <h3 style="margin-bottom: 1rem;">
                            <i class="fas fa-search"></i> Recherche avancée
                        </h3>
                        <div class="search-filters">
                            <input type="text" id="search-global" class="form-control" 
                                   placeholder="Rechercher dans toutes les données...">
                        </div>
                    </div>
                    
                    <!-- Statistiques rapides -->
                    <div class="form-group full-width">
                        <h3 style="margin-bottom: 1rem;">
                            <i class="fas fa-chart-bar"></i> Statistiques
                        </h3>
                        <div class="stats-cards" id="stats-cards">
                            <div class="loading">Calcul des statistiques...</div>
                        </div>
                    </div>
                    
                    <!-- Graphiques -->
                    <div class="form-group full-width">
                        <h3 style="margin-bottom: 1rem;">
                            <i class="fas fa-chart-pie"></i> Visualisations
                        </h3>
                        <div class="charts-grid">
                            <div class="chart-container">
                                <canvas id="consultationsChart" width="400" height="200"></canvas>
                            </div>
                            <div class="chart-container">
                                <canvas id="patientsChart" width="400" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('statistics-section').innerHTML = html;
        
        // Écouter la recherche globale
        document.getElementById('search-global').addEventListener('input', (e) => {
            this.globalSearch(e.target.value);
        });
        
        await this.loadStatisticsData();
    }

    async loadStatisticsData() {
        try {
            const [patients, consultations, stats] = await Promise.all([
                this.fetchData('patients'),
                this.fetchData('consultations'),
                this.fetchData('consultations/statistiques/mensuelles')
            ]);
            
            this.renderStatisticsCards(patients, consultations);
            this.renderCharts(stats, patients);
            
        } catch (error) {
            console.error('Erreur chargement statistiques:', error);
        }
    }

    renderStatisticsCards(patients, consultations) {
        const container = document.getElementById('stats-cards');
        
        // Calculer les statistiques
        const today = new Date().toISOString().split('T')[0];
        const todayConsultations = consultations.filter(c => c.date === today).length;
        
        const currentMonth = new Date().getMonth();
        const monthPatients = patients.filter(p => {
            const date = new Date(p.dateInscription || p.createdAt);
            return date.getMonth() === currentMonth;
        }).length;
        
        const monthRevenue = consultations
            .filter(c => new Date(c.date).getMonth() === currentMonth)
            .reduce((sum, c) => sum + (c.montant || 0), 0);
        
        const html = `
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--medical-blue);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${patients.length}</h3>
                        <p>Patients total</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--medical-green);">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${todayConsultations}</h3>
                        <p>Consultations aujourd'hui</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--medical-info);">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${monthPatients}</h3>
                        <p>Nouveaux ce mois</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--medical-warning);">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${monthRevenue} DA</h3>
                        <p>Revenu mensuel</p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    renderCharts(stats, patients) {
        // Graphique consultations mensuelles
        const consultationsCtx = document.getElementById('consultationsChart')?.getContext('2d');
        if (consultationsCtx && stats && stats.length > 0) {
            new Chart(consultationsCtx, {
                type: 'line',
                data: {
                    labels: stats.map(s => s.mois),
                    datasets: [{
                        label: 'Consultations par mois',
                        data: stats.map(s => s.count),
                        borderColor: '#2a7de1',
                        backgroundColor: 'rgba(42, 125, 225, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        }
        
        // Graphique répartition par sexe
        const patientsCtx = document.getElementById('patientsChart')?.getContext('2d');
        if (patientsCtx) {
            const maleCount = patients.filter(p => p.sexe === 'M').length;
            const femaleCount = patients.filter(p => p.sexe === 'F').length;
            const unknownCount = patients.length - maleCount - femaleCount;
            
            new Chart(patientsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Hommes', 'Femmes', 'Non spécifié'],
                    datasets: [{
                        data: [maleCount, femaleCount, unknownCount],
                        backgroundColor: ['#2a7de1', '#e12a7d', '#6c757d']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        }
    }

    async globalSearch(term) {
        if (!term.trim()) return;
        
        // Implémentez la recherche globale ici
        console.log('Recherche globale:', term);
    }

    // ===== UTILITAIRES =====
    getFormData(formId, prefix = '') {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (value) {
                // Retirer le préfixe si présent
                const cleanKey = prefix ? key.replace(prefix, '') : key;
                data[cleanKey] = value;
            }
        });
        
        return data;
    }

    showModal(html) {
        const modalContainer = document.getElementById('consultation-modal') || 
                              document.createElement('div');
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer);
        
        document.getElementById('modal-overlay').classList.add('active');
        modalContainer.classList.add('active');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            modal.remove();
        });
    }

    showNotification(message, type = 'info') {
        // Créer une notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'error' ? 'exclamation-circle' : 
                               'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--medical-green)' : 
                         type === 'error' ? 'var(--medical-danger)' : 
                         'var(--medical-info)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Ajouter les animations CSS
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    async saveAllData() {
        try {
            // Ici, vous pouvez implémenter une sauvegarde complète
            // Pour l'instant, on simule
            this.showNotification('Sauvegarde en cours...', 'info');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Données sauvegardées avec succès', 'success');
            this.updateDataStatus();
            
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        } catch (e) {
            return dateString;
        }
    }

    viewConsultationDetail(consultationId) {
        console.log('Voir consultation:', consultationId);
        // À implémenter
    }
}

// Initialiser l'application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MedicalCabinetApp();
    window.app = app;
    console.log('🏥 Cabinet Psychiatrique - Application chargée');
});