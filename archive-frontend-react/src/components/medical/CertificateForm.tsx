import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import API_ENDPOINTS from '../../config/api';

interface Template {
  id: string;
  name: string;
  fields: TemplateField[];
}

interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  required: boolean;
}

interface CustomField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  value: string;
  required?: boolean;
}

interface Props {
  patientId: string;
  certificateId?: string;
  onClose: () => void;
}

const certificateSchema = z.object({
  templateId: z.string().min(1, 'Template requis'),
  customFields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      type: z.enum(['text', 'textarea', 'date']),
      value: z.string().refine(
        (val, ctx) => {
          const field = ctx.parent as CustomField;
          return !field.required || val.trim().length > 0;
        },
        { message: 'Champ obligatoire' }
      ),
      required: z.boolean().optional(),
    })
  ).min(1, 'Au moins un champ est requis'),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

const CertificateForm: React.FC<Props> = ({ patientId, certificateId, onClose }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localFields, setLocalFields] = useState<CustomField[]>([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldData, setNewFieldData] = useState({
    label: '',
    type: 'text' as const,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      templateId: '',
      customFields: [],
    },
  });

  const templateId = watch('templateId');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.certificateTemplates);
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const data = await response.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(`Erreur templates: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (newTemplateId: string) => {
    const template = templates.find(t => t.id === newTemplateId);
    if (template) {
      setLocalFields(
        template.fields.map(f => ({
          key: f.key,
          label: f.label,
          type: f.type,
          value: '',
          required: f.required,
        }))
      );
    }
  };

  const handleAddField = () => {
    if (!newFieldData.label.trim()) return;
    const key = `field_${Date.now()}`;
    setLocalFields([
      ...localFields,
      {
        key,
        label: newFieldData.label,
        type: newFieldData.type,
        value: '',
      },
    ]);
    setNewFieldData({ label: '', type: 'text' });
    setShowAddField(false);
  };

  const handleRemoveField = (key: string) => {
    setLocalFields(fields => fields.filter(f => f.key !== key));
  };

  const handleFieldValueChange = (key: string, value: string) => {
    setLocalFields(fields =>
      fields.map(f => (f.key === key ? { ...f, value } : f))
    );
  };

  const onSubmit = async (data: CertificateFormData) => {
    try {
      setError(null);
      const fieldsWithValues = localFields;

      const payload = {
        patientId,
        templateId: data.templateId,
        customFields: fieldsWithValues,
      };

      const url = certificateId
        ? `${API_ENDPOINTS.certificates}/${certificateId}`
        : API_ENDPOINTS.certificates;

      const response = await fetch(url, {
        method: certificateId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      alert('Certificat enregistré avec succès!');
      onClose();
    } catch (err: any) {
      setError(`Erreur: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {certificateId ? 'Éditer' : 'Créer'} un Certificat
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template *
          </label>
          <select
            {...register('templateId')}
            onChange={e => {
              handleTemplateChange(e.target.value);
            }}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Sélectionner un template</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.templateId && (
            <p className="mt-1 text-red-500 text-sm">{errors.templateId.message}</p>
          )}
        </div>

        {templateId && (
          <>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-800">Champs du certificat</h4>
                <button
                  type="button"
                  onClick={() => setShowAddField(!showAddField)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                >
                  + Ajouter champ
                </button>
              </div>

              {showAddField && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nom du champ"
                      value={newFieldData.label}
                      onChange={e =>
                        setNewFieldData({ ...newFieldData, label: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <select
                      value={newFieldData.type}
                      onChange={e =>
                        setNewFieldData({
                          ...newFieldData,
                          type: e.target.value as any,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="text">Texte court</option>
                      <option value="textarea">Zone texte</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddField(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {localFields.map((field) => (
                  <div
                    key={field.key}
                    className="border border-gray-200 rounded p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <label className="block font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.key.startsWith('field_') && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.key)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={field.value}
                        onChange={e =>
                          handleFieldValueChange(field.key, e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={e =>
                          handleFieldValueChange(field.key, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              {errors.customFields && (
                <p className="mt-2 text-red-500 text-sm">
                  {errors.customFields.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CertificateForm;
