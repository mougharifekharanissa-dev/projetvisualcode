const readline = require('readline');
const Cabinet = require('../models/Cabinet');

class Application {
    constructor() {
        this.cabinet = new Cabinet();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    
    afficherMenuPrincipal() {
        console.log('\n=== CABINET PSYCHIATRIQUE - SYSTÈME COMPLET ===');
        console.log('1. 👥 Gestion des patients');
        console.log('2. 📋 Gestion des consultations');
        console.log('3. 🚪 Quitter');
        console.log('=================================================');
    }

    afficherMenuPatients() {
        console.log('\n=== GESTION DES PATIENTS ===');
        console.log('1. 📋 Lister tous les patients');
        console.log('2. 👤 Ajouter un nouveau patient');
        console.log('3. 🔍 Rechercher un patient');
        console.log('4. ↩️ Retour au menu principal');
        console.log('=================================');
    }

    afficherMenuConsultations() {
        console.log('\n=== GESTION DES CONSULTATIONS ===');
        console.log('1. 📝 Ajouter une consultation');
        console.log('2. 📋 Lister toutes les consultations');
        console.log('3. 🔍 Rechercher consultations par patient');
        console.log('4. ↩️ Retour au menu principal');
        console.log('=====================================');
    }

    gererMenuPrincipal() {
        this.afficherMenuPrincipal();
        this.rl.question('\nVotre choix (1-3): ', (choix) => {
            switch(choix) {
                case '1':
                    this.gererPatients();
                    break;
                case '2':
                    this.gererConsultations();
                    break;
                case '3':
                    console.log('👋 Au revoir!');
                    this.rl.close();
                    return;
                default:
                    console.log('❌ Choix invalide!');
                    this.gererMenuPrincipal();
            }
        });
    }

    gererPatients() {
        this.afficherMenuPatients();
        this.rl.question('\nVotre choix (1-4): ', (choix) => {
            switch(choix) {
                case '1':
                    this.listerPatients();
                    break;
                case '2':
                    this.ajouterPatient();
                    return;
                case '3':
                    this.rechercherPatient();
                    return;
                case '4':
                    this.gererMenuPrincipal();
                    return;
                default:
                    console.log('❌ Choix invalide!');
            }
            
            setTimeout(() => {
                this.gererPatients();
            }, 1000);
        });
    }

    gererConsultations() {
        this.afficherMenuConsultations();
        this.rl.question('\nVotre choix (1-4): ', (choix) => {
            switch(choix) {
                case '1':
                    this.ajouterConsultation();
                    return;
                case '2':
                    this.listerConsultations();
                    break;
                case '3':
                    this.rechercherConsultationsParPatient();
                    return;
                case '4':
                    this.gererMenuPrincipal();
                    return;
                default:
                    console.log('❌ Choix invalide!');
            }
            
            setTimeout(() => {
                this.gererConsultations();
            }, 1000);
        });
    }

    listerPatients() {
        console.log('\n=== LISTE DES PATIENTS ===');
        const patients = this.cabinet.listerPatients();
        
        if (patients.length === 0) {
            console.log('Aucun patient enregistré.');
            return;
        }
        
        patients.forEach(patient => {
            console.log(`📁 ${patient.num_dossier} - ${patient.nom_complet} - ${patient.age} ans - ${patient.genre}`);
        });
    }
    
    ajouterPatient() {
        console.log('\n=== NOUVEAU PATIENT ===');
        
        this.rl.question('Nom: ', (nom) => {
            this.rl.question('Prénom: ', (prenom) => {
                this.rl.question('Date de naissance (YYYY-MM-DD): ', (date_naissance) => {
                    this.rl.question('Genre: ', (genre) => {
                        this.rl.question('Situation familiale: ', (situation) => {
                            this.rl.question('Numéro CNI: ', (cni) => {
                                const patientData = {
                                    nom: nom,
                                    prenom: prenom,
                                    date_naissance: date_naissance,
                                    genre: genre,
                                    situation_familiale: situation,
                                    num_cni: cni,
                                    wilaya_naissance_id: 1,
                                    commune_naissance_id: 1,
                                    profession_id: 1,
                                    wilaya_residence_id: 1,
                                    commune_residence_id: 1,
                                    date_delivrance: new Date().toISOString().split('T')[0]
                                };
                                
                                const patient = this.cabinet.ajouterPatient(patientData);
                                console.log(`✅ Patient ajouté: ${patient.num_dossier} - ${patient.prenom} ${patient.nom}`);
                                
                                setTimeout(() => {
                                    this.gererPatients();
                                }, 1000);
                            });
                        });
                    });
                });
            });
        });
    }
    
    rechercherPatient() {
        console.log('\n=== RECHERCHE PATIENT ===');
        this.rl.question('Nom ou prénom à rechercher: ', (recherche) => {
            const patients = this.cabinet.trouverPatientsParNom(recherche);
            
            if (patients.length === 0) {
                console.log('❌ Aucun patient trouvé.');
            } else {
                console.log(`\n🔍 ${patients.length} patient(s) trouvé(s):`);
                patients.forEach(patient => {
                    console.log(`📁 ${patient.num_dossier} - ${patient.prenom} ${patient.nom} - ${patient.age} ans`);
                });
            }
            
            setTimeout(() => {
                this.gererPatients();
            }, 1000);
        });
    }

    ajouterConsultation() {
        console.log('\n=== NOUVELLE CONSULTATION ===');
        
        const patients = this.cabinet.patients;
        if (patients.length === 0) {
            console.log('❌ Aucun patient enregistré. Ajoutez d\'abord un patient.');
            setTimeout(() => {
                this.gererConsultations();
            }, 1000);
            return;
        }
        
        console.log('\n📋 Liste des patients:');
        patients.forEach(patient => {
            console.log(`   ${patient.id}. ${patient.prenom} ${patient.nom} (Dossier: ${patient.num_dossier})`);
        });
        
        this.rl.question('\nID du patient: ', (patientIdStr) => {
            const patientId = parseInt(patientIdStr);
            const patient = this.cabinet.trouverPatientParId(patientId);
            
            if (!patient) {
                console.log('❌ Patient non trouvé!');
                setTimeout(() => {
                    this.gererConsultations();
                }, 1000);
                return;
            }
            
            this.rl.question('Motif de la consultation: ', (motif) => {
                this.rl.question('Observations: ', (observations) => {
                    const consultationData = {
                        patient_id: patientId,
                        motif: motif,
                        observations: observations
                    };
                    
                    const consultation = this.cabinet.ajouterConsultation(consultationData);
                    console.log(`✅ Consultation #${consultation.id} ajoutée pour ${patient.prenom} ${patient.nom}`);
                    
                    setTimeout(() => {
                        this.gererConsultations();
                    }, 1000);
                });
            });
        });
    }

    listerConsultations() {
        console.log('\n=== LISTE DES CONSULTATIONS ===');
        const consultations = this.cabinet.listerConsultations();
        
        if (consultations.length === 0) {
            console.log('📭 Aucune consultation enregistrée.');
            return;
        }
        
        consultations.forEach(consult => {
            const patient = this.cabinet.trouverPatientParId(consult.patient_id);
            const nomPatient = patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu';
            
            console.log(`\n📄 Consultation #${consult.id} - ${consult.date_consultation}`);
            console.log(`   👤 Patient: ${nomPatient}`);
            console.log(`   🎯 Motif: ${consult.motif}`);
            console.log(`   📝 Observations: ${consult.observations}`);
        });
    }

    rechercherConsultationsParPatient() {
        console.log('\n=== RECHERCHE CONSULTATIONS PAR PATIENT ===');
        
        this.rl.question('Numéro de dossier du patient: ', (numDossier) => {
            const patient = this.cabinet.trouverPatientParDossier(numDossier);
            
            if (!patient) {
                console.log('❌ Patient non trouvé!');
                setTimeout(() => {
                    this.gererConsultations();
                }, 1000);
                return;
            }
            
            const consultations = this.cabinet.trouverConsultationsParPatient(patient.id);
            
            console.log(`\n📋 Consultations de ${patient.prenom} ${patient.nom}:`);
            if (consultations.length === 0) {
                console.log('   📭 Aucune consultation trouvée.');
            } else {
                consultations.forEach(consult => {
                    console.log(`\n   📄 Consultation #${consult.id} - ${consult.date_consultation}`);
                    console.log(`      🎯 Motif: ${consult.motif}`);
                    console.log(`      📝 Observations: ${consult.observations}`);
                });
            }
            
            setTimeout(() => {
                this.gererConsultations();
            }, 1000);
        });
    }

    demarrer() {
        console.log('✨ Système de gestion - Cabinet Psychiatrique');
        
        // Initialiser les données de référence
        this.cabinet.initialiserDonneesTest();
        
        // Ajouter quelques patients de test
        const patient1 = this.cabinet.ajouterPatient({
            nom: 'Dupont',
            prenom: 'Marie',
            date_naissance: '1985-05-15',
            wilaya_naissance_id: 1,
            commune_naissance_id: 1,
            genre: 'Féminin',
            situation_familiale: 'Marié(e)',
            profession_id: 1,
            num_cni: '1234567890',
            date_delivrance: '2010-06-20',
            wilaya_residence_id: 1,
            commune_residence_id: 1
        });
        
        const patient2 = this.cabinet.ajouterPatient({
            nom: 'Martin',
            prenom: 'Pierre',
            date_naissance: '1990-08-22',
            wilaya_naissance_id: 2,
            commune_naissance_id: 2,
            genre: 'Masculin',
            situation_familiale: 'Célibataire',
            profession_id: 2,
            num_cni: '0987654321',
            date_delivrance: '2015-03-10',
            wilaya_residence_id: 2,
            commune_residence_id: 2
        });
        
        console.log('✅ Patients de test créés');
        
        this.gererMenuPrincipal();
    }
}

const app = new Application();
app.demarrer();