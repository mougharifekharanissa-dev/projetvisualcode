import { useState, useEffect } from 'react';

export interface DSM5Diagnosis {
  code: string;
  label: string;
  category: string;
}

const DSM5_DATA: DSM5Diagnosis[] = [
  { code: 'F41.1', label: 'Trouble anxieux généralisé', category: 'Troubles anxieux' },
  { code: 'F40.00', label: 'Agoraphobie sans antécédent de trouble panique', category: 'Troubles anxieux' },
  { code: 'F40.01', label: 'Agoraphobie avec antécédent de trouble panique', category: 'Troubles anxieux' },
  { code: 'F40.10', label: 'Phobie sociale (trouble anxieux social)', category: 'Troubles anxieux' },
  { code: 'F40.210', label: 'Arachnophobie', category: 'Troubles anxieux' },
  { code: 'F40.220', label: 'Peur des hauteurs', category: 'Troubles anxieux' },
  { code: 'F40.230', label: 'Peur du vol', category: 'Troubles anxieux' },
  { code: 'F40.240', label: 'Peur des espaces fermés', category: 'Troubles anxieux' },
  { code: 'F40.290', label: 'Autres phobies spécifiques', category: 'Troubles anxieux' },
  { code: 'F41.0', label: 'Trouble panique', category: 'Troubles anxieux' },

  { code: 'F32.0', label: 'Episode dépressif léger', category: 'Troubles dépressifs' },
  { code: 'F32.1', label: 'Episode dépressif modéré', category: 'Troubles dépressifs' },
  { code: 'F32.2', label: 'Episode dépressif sévère sans symptômes psychotiques', category: 'Troubles dépressifs' },
  { code: 'F32.3', label: 'Episode dépressif sévère avec symptômes psychotiques', category: 'Troubles dépressifs' },
  { code: 'F33.0', label: 'Trouble dépressif récurrent, épisode actuel léger', category: 'Troubles dépressifs' },
  { code: 'F33.1', label: 'Trouble dépressif récurrent, épisode actuel modéré', category: 'Troubles dépressifs' },
  { code: 'F33.2', label: 'Trouble dépressif récurrent, épisode actuel sévère', category: 'Troubles dépressifs' },

  { code: 'F30.10', label: 'Trouble bipolaire I, épisode maniaque unique, léger', category: 'Troubles bipolaires' },
  { code: 'F30.11', label: 'Trouble bipolaire I, épisode maniaque unique, modéré', category: 'Troubles bipolaires' },
  { code: 'F30.12', label: 'Trouble bipolaire I, épisode maniaque unique, sévère', category: 'Troubles bipolaires' },
  { code: 'F31.0', label: 'Trouble bipolaire I, épisode actuel hypomaniaque', category: 'Troubles bipolaires' },
  { code: 'F31.10', label: 'Trouble bipolaire I, trouble dépressif actuel, épisode léger', category: 'Troubles bipolaires' },
  { code: 'F31.20', label: 'Trouble bipolaire I, trouble dépressif actuel, épisode modéré', category: 'Troubles bipolaires' },

  { code: 'F42.8', label: 'Trouble obsessionnel-compulsif', category: 'Troubles obsessionnels' },
  { code: 'F42.81', label: 'TOC avec peu de conscience de maladie', category: 'Troubles obsessionnels' },
  { code: 'F42.82', label: 'TOC avec bonne ou excellente conscience de maladie', category: 'Troubles obsessionnels' },

  { code: 'F43.10', label: 'Trouble d\'adaptation avec humeur dépressive', category: 'Troubles relationnels' },
  { code: 'F43.11', label: 'Trouble d\'adaptation avec troubles des émotions et de la conduite', category: 'Troubles relationnels' },
  { code: 'F43.12', label: 'Trouble d\'adaptation avec perturbation du comportement', category: 'Troubles relationnels' },
  { code: 'F43.20', label: 'Trouble de stress post-traumatique', category: 'Troubles liés au trauma' },
  { code: 'F43.10', label: 'Trouble de stress aigu', category: 'Troubles liés au trauma' },

  { code: 'F20.9', label: 'Schizophrénie, type non précisé', category: 'Troubles psychotiques' },
  { code: 'F20.81', label: 'Schizophrénie, type paranoïde', category: 'Troubles psychotiques' },
  { code: 'F23', label: 'Trouble psychotique bref', category: 'Troubles psychotiques' },
  { code: 'F22', label: 'Trouble délirant', category: 'Troubles psychotiques' },

  { code: 'F90.1', label: 'TDAH, type inattention prédominante', category: 'Troubles neurodéveloppementaux' },
  { code: 'F90.2', label: 'TDAH, type hyperactivité-impulsivité prédominante', category: 'Troubles neurodéveloppementaux' },
  { code: 'F90.8', label: 'TDAH, type combiné', category: 'Troubles neurodéveloppementaux' },
  { code: 'F81.0', label: 'Trouble d\'apprentissage spécifique, avec atteinte de la lecture', category: 'Troubles neurodéveloppementaux' },

  { code: 'F60.2', label: 'Trouble de la personnalité antisociale', category: 'Troubles de la personnalité' },
  { code: 'F60.3', label: 'Trouble de la personnalité limite', category: 'Troubles de la personnalité' },
  { code: 'F60.4', label: 'Trouble de la personnalité histrionique', category: 'Troubles de la personnalité' },
  { code: 'F60.5', label: 'Trouble de la personnalité narcissique', category: 'Troubles de la personnalité' },
  { code: 'F60.6', label: 'Trouble de la personnalité évitante', category: 'Troubles de la personnalité' },
  { code: 'F60.7', label: 'Trouble de la personnalité dépendante', category: 'Troubles de la personnalité' },
  { code: 'F60.8', label: 'Trouble de la personnalité obsessionnelle-compulsive', category: 'Troubles de la personnalité' },
];

export const useDSM5Diagnoses = () => {
  const [diagnoses, setDiagnoses] = useState<DSM5Diagnosis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiagnoses = async () => {
      setLoading(true);
      setError(null);

      try {
        setDiagnoses(DSM5_DATA);
      } catch (err) {
        setError('Erreur lors du chargement des diagnostics DSM-5');
      } finally {
        setLoading(false);
      }
    };

    loadDiagnoses();
  }, []);

  const getDiagnosesByCategory = () => {
    const grouped = diagnoses.reduce((acc, diag) => {
      if (!acc[diag.category]) {
        acc[diag.category] = [];
      }
      acc[diag.category].push(diag);
      return acc;
    }, {} as Record<string, DSM5Diagnosis[]>);

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));
  };

  const filterDiagnoses = (query: string) => {
    if (!query.trim()) return diagnoses;

    const lowerQuery = query.toLowerCase();
    return diagnoses.filter(
      diag =>
        diag.code.toLowerCase().includes(lowerQuery) ||
        diag.label.toLowerCase().includes(lowerQuery)
    );
  };

  const getDiagnosisByCode = (code: string) => {
    return diagnoses.find(d => d.code === code);
  };

  return {
    diagnoses,
    loading,
    error,
    getDiagnosesByCategory,
    filterDiagnoses,
    getDiagnosisByCode,
  };
};
