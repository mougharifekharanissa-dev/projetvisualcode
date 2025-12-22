// Types pour les données médicales
export interface Symptome {
  id: string;
  code: string;
  nom: string;
  categorie: string;
}

export interface Diagnostic {
  id: string;
  codeCIM: string;
  nom: string;
  description?: string;
}

export interface DSM5 {
  id: string;
  code: string;
  nom: string;
  criteres: string[];
}

export interface Medicament {
  id: string;
  code: string;
  nom: string;
  dosage: string;
  forme: string;
  classe: string;
}

export interface Maladie {
  id: string;
  codeCIM: string;
  nom: string;
  categorie: string;
}

// Type pour les données de consultation
export interface ConsultationMedicalData {
  symptomes: string[];
  diagnostics: string[];
  dsm5: string[];
  medicaments: string[];
  maladiesAssociees: string[];
  scoreGAF: number | null;
  notesEvaluation: string;
  paiementEffectue: boolean;
  montantPaiement: number | null;
}