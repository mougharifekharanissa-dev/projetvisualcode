import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  sexe?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

const PatientPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setError('ID patient manquant');
      setLoading(false);
      return;
    }

    const fetchPatient = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.patients}/${patientId}`);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        const data = await response.json();
        setPatient(data);
      } catch (err: any) {
        setError(`Erreur: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-12">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur</h2>
            <p className="text-red-700 mb-4">{error || 'Patient non trouvé'}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Retour
        </button>

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.prenom} {patient.nom}
              </h1>
              <p className="text-gray-600 mt-1">ID: {patient.id}</p>
            </div>
            <button
              onClick={() => navigate(`/certificates/${patient.id}`)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Certificats Médicaux
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Date de Naissance
              </label>
              <p className="text-gray-900 mt-1">
                {patient.dateNaissance
                  ? new Date(patient.dateNaissance).toLocaleDateString('fr-FR')
                  : 'Non renseignée'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Sexe
              </label>
              <p className="text-gray-900 mt-1">
                {patient.sexe || 'Non renseigné'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Téléphone
              </label>
              <p className="text-gray-900 mt-1">
                {patient.telephone || 'Non renseigné'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-gray-900 mt-1">
                {patient.email || 'Non renseigné'}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Adresse
              </label>
              <p className="text-gray-900 mt-1">
                {patient.adresse || 'Non renseignée'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
