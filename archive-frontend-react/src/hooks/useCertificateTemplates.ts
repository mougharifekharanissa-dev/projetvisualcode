import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  required: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  fields: Field[];
}

export const useCertificateTemplates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.certificateTemplates);
        if (!response.ok) throw new Error('Erreur API');
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
};
