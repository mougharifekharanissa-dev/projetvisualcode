import { 
  Symptome, 
  Diagnostic, 
  DSM5, 
  Medicament, 
  Maladie 
} from './types/medical';

// Données mockées temporaires - À remplacer par API plus tard

export const symptomesList: Symptome[] = [
  { id: '1', code: 'ANX001', nom: 'Anxiété généralisée', categorie: 'Affectif' },
  { id: '2', code: 'DEP001', nom: 'Tristesse persistante', categorie: 'Affectif' },
  { id: '3', code: 'INS001', nom: 'Insomnie', categorie: 'Somnolence' },
  { id: '4', code: 'HYP001', nom: 'Hypersomnie', categorie: 'Somnolence' },
  { id: '5', code: 'IRR001', nom: 'Irritabilité', categorie: 'Affectif' },
  { id: '6', code: 'CON001', nom: 'Difficultés de concentration', categorie: 'Cognitif' },
  { id: '7', code: 'MEM001', nom: 'Problèmes de mémoire', categorie: 'Cognitif' },
  { id: '8', code: 'FAT001', nom: 'Fatigue chronique', categorie: 'Somatique' },
  { id: '9', code: 'CEPH001', nom: 'Céphalées', categorie: 'Somatique' },
  { id: '10', code: 'APP001', nom: 'Perte d\'appétit', categorie: 'Somatique' },
  { id: '11', code: 'HYPER001', nom: 'Hyperphagie', categorie: 'Somatique' },
  { id: '12', code: 'AGIT001', nom: 'Agitation psychomotrice', categorie: 'Comportemental' },
  { id: '13', code: 'RET001', nom: 'Ralentissement psychomoteur', categorie: 'Comportemental' },
  { id: '14', code: 'ISO001', nom: 'Isolement social', categorie: 'Social' },
  { id: '15', code: 'IDE001', nom: 'Idées noires', categorie: 'Cognitif' },
];

export const diagnosticsList: Diagnostic[] = [
  { id: '1', codeCIM: 'F32.0', nom: 'Épisode dépressif léger' },
  { id: '2', codeCIM: 'F32.1', nom: 'Épisode dépressif moyen' },
  { id: '3', codeCIM: 'F32.2', nom: 'Épisode dépressif sévère' },
  { id: '4', codeCIM: 'F41.0', nom: 'Trouble panique' },
  { id: '5', codeCIM: 'F41.1', nom: 'Trouble anxieux généralisé' },
  { id: '6', codeCIM: 'F43.2', nom: 'Trouble de l\'adaptation' },
  { id: '7', codeCIM: 'F20.0', nom: 'Schizophrénie paranoïde' },
  { id: '8', codeCIM: 'F31.0', nom: 'Trouble bipolaire actuellement hypomaniaque' },
  { id: '9', codeCIM: 'F31.1', nom: 'Trouble bipolaire actuellement maniaque' },
  { id: '10', codeCIM: 'F31.2', nom: 'Trouble bipolaire actuellement dépressif' },
];

export const dsm5List: DSM5[] = [
  { 
    id: '1', 
    code: '296.21', 
    nom: 'Trouble dépressif majeur, épisode unique, léger',
    criteres: ['A1-A5', 'B', 'C', 'D'] 
  },
  { 
    id: '2', 
    code: '296.22', 
    nom: 'Trouble dépressif majeur, épisode unique, moyen',
    criteres: ['A1-A5', 'B', 'C', 'D', 'E'] 
  },
  { 
    id: '3', 
    code: '296.23', 
    nom: 'Trouble dépressif majeur, épisode unique, sévère',
    criteres: ['A1-A5', 'B', 'C', 'D', 'E', 'F'] 
  },
  { 
    id: '4', 
    code: '300.02', 
    nom: 'Trouble anxieux généralisé',
    criteres: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] 
  },
  { 
    id: '5', 
    code: '300.01', 
    nom: 'Trouble panique',
    criteres: ['A', 'B', 'C', 'D'] 
  },
];

export const medicamentsList: Medicament[] = [
  { id: '1', code: 'PAR001', nom: 'Paroxétine', dosage: '20mg', forme: 'comprimé', classe: 'ISRS' },
  { id: '2', code: 'SER001', nom: 'Sertraline', dosage: '50mg', forme: 'comprimé', classe: 'ISRS' },
  { id: '3', code: 'FLU001', nom: 'Fluoxétine', dosage: '20mg', forme: 'capsule', classe: 'ISRS' },
  { id: '4', code: 'CIT001', nom: 'Citalopram', dosage: '20mg', forme: 'comprimé', classe: 'ISRS' },
  { id: '5', code: 'ESC001', nom: 'Escitalopram', dosage: '10mg', forme: 'comprimé', classe: 'ISRS' },
  { id: '6', code: 'VEN001', nom: 'Venlafaxine', dosage: '75mg', forme: 'comprimé', classe: 'IRSNa' },
  { id: '7', code: 'DUL001', nom: 'Duloxétine', dosage: '60mg', forme: 'capsule', classe: 'IRSNa' },
  { id: '8', code: 'ALP001', nom: 'Alprazolam', dosage: '0.25mg', forme: 'comprimé', classe: 'Benzodiazépine' },
  { id: '9', code: 'CLO001', nom: 'Clonazépam', dosage: '0.5mg', forme: 'comprimé', classe: 'Benzodiazépine' },
  { id: '10', code: 'LOR001', nom: 'Lorazépam', dosage: '1mg', forme: 'comprimé', classe: 'Benzodiazépine' },
  { id: '11', code: 'OLZ001', nom: 'Olanzapine', dosage: '5mg', forme: 'comprimé', classe: 'Neuroleptique atypique' },
  { id: '12', code: 'RIS001', nom: 'Risperidone', dosage: '2mg', forme: 'comprimé', classe: 'Neuroleptique atypique' },
  { id: '13', code: 'QUE001', nom: 'Quétiapine', dosage: '100mg', forme: 'comprimé', classe: 'Neuroleptique atypique' },
  { id: '14', code: 'ARI001', nom: 'Aripiprazole', dosage: '10mg', forme: 'comprimé', classe: 'Neuroleptique atypique' },
  { id: '15', code: 'LIT001', nom: 'Lithium', dosage: '300mg', forme: 'comprimé', classe: 'Thymorégulateur' },
  { id: '16', code: 'VAL001', nom: 'Valproate', dosage: '500mg', forme: 'comprimé', classe: 'Thymorégulateur' },
];

export const maladiesList: Maladie[] = [
  { id: '1', codeCIM: 'E11.9', nom: 'Diabète de type 2', categorie: 'Métabolique' },
  { id: '2', codeCIM: 'I10', nom: 'Hypertension essentielle', categorie: 'Cardiovasculaire' },
  { id: '3', codeCIM: 'E04.9', nom: 'Hypothyroïdie non spécifiée', categorie: 'Endocrinien' },
  { id: '4', codeCIM: 'E05.9', nom: 'Hyperthyroïdie', categorie: 'Endocrinien' },
  { id: '5', codeCIM: 'K21.9', nom: 'Reflux gastro-œsophagien', categorie: 'Digestif' },
  { id: '6', codeCIM: 'J45.9', nom: 'Asthme', categorie: 'Respiratoire' },
  { id: '7', codeCIM: 'M54.5', nom: 'Lombalgie', categorie: 'Musculosquelettique' },
  { id: '8', codeCIM: 'G43.9', nom: 'Migraine', categorie: 'Neurologique' },
  { id: '9', codeCIM: 'F10.2', nom: 'Troubles mentaux liés à l\'alcool', categorie: 'Addiction' },
  { id: '10', codeCIM: 'F17.2', nom: 'Troubles mentaux liés au tabac', categorie: 'Addiction' },
];