import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Configuration API
import API_ENDPOINTS from '../config/api';

// Nouveaux composants médicaux
import SymptomesSelector from '../components/medical/SymptomesSelector';
import DiagnosticsSelector from '../components/medical/DiagnosticsSelector';
import EvaluationSection from '../components/medical/EvaluationSection';
import MedicamentsSelector from '../components/medical/MedicamentsSelector';
import MaladiesSelector from '../components/medical/MaladiesSelector';
import PaiementToggle from '../components/medical/PaiementToggle';

// Données mockées
import {
  symptomesList,
  diagnosticsList,
  dsm5List,
  medicamentsList,
  maladiesList
} from '../data/medicalMockData';

// Schéma de validation
const consultationSchema = z.object({
  // Champs existants
  patientId: z.string().min(1, "Le patient est requis"),
  dateConsultation: z.string().min(1, "La date est requise"),
  typeConsultation: z.string().min(1, "Le type de consultation est requis"),
  antecedent: z.string().optional(),
  motifConsultation: z.string().min(1, "Le motif de consultation est requis"),
  examenPhysique: z.string().optional(),
  recommandations: z.string().optional(),
  
  // NOUVEAUX CHAMPS MÉDICAUX
  symptomes: z.array(z.string()).default([]),
  diagnostics: z.array(z.string()).default([]),
  dsm5: z.array(z.string()).default([]),
  medicaments: z.array(z.string()).default([]),
  maladiesAssociees: z.array(z.string()).default([]),
  scoreGAF: z.number().min(1).max(100).nullable(),
  notesEvaluation: z.string().default(''),
  
  // Paiement modifié
  paiementEffectue: z.boolean().default(false),
  montantPaiement: z.number().min(0).nullable(),
  
  // Champs conditionnels pour paiement
}).superRefine((data, ctx) => {
  // Validation conditionnelle pour le montant si paiement effectué
  if (data.paiementEffectue && (data.montantPaiement === null || data.montantPaiement <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Le montant est requis lorsque le paiement est effectué",
      path: ["montantPaiement"],
    });
  }
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      symptomes: [],
      diagnostics: [],
      dsm5: [],
      medicaments: [],
      maladiesAssociees: [],
      paiementEffectue: false,
      montantPaiement: null,
      scoreGAF: null,
      notesEvaluation: '',
    },
  });

  // Surveiller les valeurs pour les champs conditionnels
  const paiementEffectue = watch('paiementEffectue');
  const symptomes = watch('symptomes') || [];
  const diagnostics = watch('diagnostics') || [];
  const dsm5 = watch('dsm5') || [];
  const medicaments = watch('medicaments') || [];
  const maladiesAssociees = watch('maladiesAssociees') || [];
  const scoreGAF = watch('scoreGAF');

  // Charger les patients (existant)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setApiError(null);
        const response = await fetch(API_ENDPOINTS.patients);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Vérifiez que data est un tableau
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setApiError('Format de données incorrect reçu du serveur');
          // Fallback sur données mockées
          setPatients([
            { id: '1', nom: 'Dupont', prenom: 'Jean' },
            { id: '2', nom: 'Martin', prenom: 'Sophie' },
          ]);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des patients:', error);
        setApiError(`Erreur de connexion: ${error.message}`);
        // Fallback sur données mockées
        setPatients([
          { id: '1', nom: 'Dupont', prenom: 'Jean' },
          { id: '2', nom: 'Martin', prenom: 'Sophie' },
        ]);
      }
    };
    
    fetchPatients();
  }, []);

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Données à sauvegarder:', data);

      const response = await fetch(API_ENDPOINTS.consultations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }
      
      alert('Consultation enregistrée avec succès!');
      navigate('/consultations');
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert(`Erreur lors de l'enregistrement: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Nouvelle Consultation
          </h1>
          <p className="mt-2 text-gray-600">
            Remplissez le formulaire de consultation psychiatrique
          </p>
          {apiError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">
                ⚠️ {apiError} (Données mockées utilisées)
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ==================== */}
          {/* SECTION 1: INFORMATIONS PATIENT */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
              1. Informations Patient
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient *
                </label>
                <select
                  {...register('patientId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.nom} {patient.prenom}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.patientId.message}
                  </p>
                )}
              </div>

              {/* Date de consultation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de consultation *
                </label>
                <input
                  type="date"
                  {...register('dateConsultation')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                {errors.dateConsultation && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.dateConsultation.message}
                  </p>
                )}
              </div>

              {/* Type de consultation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de consultation *
                </label>
                <select
                  {...register('typeConsultation')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="premiere">Première consultation</option>
                  <option value="controle">Consultation de contrôle</option>
                  <option value="urgence">Urgence</option>
                  <option value="suivi">Suivi régulier</option>
                </select>
                {errors.typeConsultation && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.typeConsultation.message}
                  </p>
                )}
              </div>

              {/* Antécédents */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antécédents médicaux
                </label>
                <textarea
                  {...register('antecedent')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Antécédents du patient..."
                />
              </div>
            </div>
          </div>

          {/* ==================== */}
          {/* SECTION 2: MOTIF ET SYMPTÔMES */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
              2. Motif et Symptômes
            </h2>
            
            {/* Motif de consultation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif de consultation *
              </label>
              <textarea
                {...register('motifConsultation')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Décrivez le motif de la consultation..."
              />
              {errors.motifConsultation && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.motifConsultation.message}
                </p>
              )}
            </div>

            {/* Symptômes observés */}
            <div>
              <Controller
                name="symptomes"
                control={control}
                render={({ field, fieldState }) => (
                  <SymptomesSelector
                    selectedSymptomes={(field.value || []) as string[]}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* ==================== */}
          {/* SECTION 3: EXAMEN ET DIAGNOSTIC */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
              3. Examen et Diagnostic
            </h2>
            
            {/* Examen physique */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examen physique
              </label>
              <textarea
                {...register('examenPhysique')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Résultats de l'examen physique..."
              />
            </div>

            {/* Diagnostics et DSM-5 */}
            <div>
              <Controller
                name="diagnostics"
                control={control}
                render={({ field, fieldState }) => (
                  <Controller
                    name="dsm5"
                    control={control}
                    render={({ field: dsm5Field, fieldState: dsm5FieldState }) => (
                      <DiagnosticsSelector
                        selectedDiagnostics={(field.value || []) as string[]}
                        selectedDSM5={(dsm5Field.value || []) as string[]}
                        onDiagnosticsChange={field.onChange}
                        onDSM5Change={dsm5Field.onChange}
                        errorDiagnostics={fieldState.error?.message}
                        errorDSM5={dsm5FieldState.error?.message}
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>

          {/* ==================== */}
          {/* SECTION 4: ÉVALUATION */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
              4. Évaluation
            </h2>
            
            <Controller
              name="scoreGAF"
              control={control}
              render={({ field, fieldState }) => (
                <Controller
                  name="notesEvaluation"
                  control={control}
                  render={({ field: notesField }) => (
                    <EvaluationSection
                      scoreGAF={field.value as number | null}
                      notesEvaluation={(notesField.value as string) || ''}
                      onScoreGAFChange={field.onChange}
                      onNotesChange={notesField.onChange}
                      errorScoreGAF={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* ==================== */}
          {/* SECTION 5: TRAITEMENT ET RECOMMANDATIONS */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
              5. Traitement et Recommandations
            </h2>
            
            {/* Traitements prescrits (Médicaments) */}
            <div className="mb-6">
              <Controller
                name="medicaments"
                control={control}
                render={({ field, fieldState }) => (
                  <MedicamentsSelector
                    selectedMedicaments={(field.value || []) as string[]}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            {/* Recommandations */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommandations
              </label>
              <textarea
                {...register('recommandations')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Recommandations pour le patient..."
              />
            </div>

            {/* Maladies associées */}
            <div>
              <Controller
                name="maladiesAssociees"
                control={control}
                render={({ field, fieldState }) => (
                  <MaladiesSelector
                    selectedMaladies={(field.value || []) as string[]}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* ==================== */}
          {/* SECTION 6: PAIEMENT */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
              6. Paiement
            </h2>
            
            <Controller
              name="paiementEffectue"
              control={control}
              render={({ field }) => (
                <Controller
                  name="montantPaiement"
                  control={control}
                  render={({ field: montantField, fieldState }) => (
                    <PaiementToggle
                      paiementEffectue={field.value as boolean}
                      montantPaiement={montantField.value as number | null}
                      onPaiementToggle={field.onChange}
                      onMontantChange={montantField.onChange}
                      errorMontant={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </div>

          {/* ==================== */}
          {/* BOUTONS DE SOUMISSION */}
          {/* ==================== */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/consultations')}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer la consultation'}
              </button>
            </div>
          </div>
        </form>

        {/* Résumé des données (debug) */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Résumé des données (à supprimer en production)
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div>
              <span className="font-medium">Symptômes sélectionnés:</span>{' '}
              {symptomes.length} - {symptomes.join(', ')}
            </div>
            <div>
              <span className="font-medium">Diagnostics:</span>{' '}
              {diagnostics.length} - {diagnostics.join(', ')}
            </div>
            <div>
              <span className="font-medium">DSM-5:</span>{' '}
              {dsm5.length} - {dsm5.join(', ')}
            </div>
            <div>
              <span className="font-medium">Médicaments:</span>{' '}
              {medicaments.length} - {medicaments.join(', ')}
            </div>
            <div>
              <span className="font-medium">Maladies associées:</span>{' '}
              {maladiesAssociees.length} - {maladiesAssociees.join(', ')}
            </div>
            <div>
              <span className="font-medium">Score GAF:</span> {scoreGAF || 'Non évalué'}
            </div>
            <div>
              <span className="font-medium">Paiement:</span>{' '}
              {paiementEffectue ? `Oui - ${watch('montantPaiement')} DA` : 'Non'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;