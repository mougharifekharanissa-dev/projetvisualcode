import React, { useState } from 'react';
import CertificateForm from '../components/medical/CertificateForm';

interface CertificatePageProps {
  patientId: string;
  patientName?: string;
}

const CertificatePage: React.FC<CertificatePageProps> = ({ patientId, patientName }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setSuccessMessage('Certificat créé avec succès');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer un certificat médical</h1>
        {patientName && (
          <p className="text-gray-600 mt-1">Patient: {patientName}</p>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CertificateForm patientId={patientId} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CertificatePage;
