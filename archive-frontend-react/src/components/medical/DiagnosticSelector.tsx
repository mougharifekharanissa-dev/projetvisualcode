import React from 'react';
import { useDSM5Diagnoses } from '../../hooks/useDSM5Diagnoses';

interface DiagnosticSelectorProps {
  selectedDiagnostic: string | null;
  onChange: (code: string | null) => void;
  error?: string;
}

const DiagnosticSelector: React.FC<DiagnosticSelectorProps> = ({
  selectedDiagnostic,
  onChange,
  error,
}) => {
  const { diagnoses, loading } = useDSM5Diagnoses();
  const groupedByCategory = diagnoses.reduce((acc, diag) => {
    if (!acc[diag.category]) acc[diag.category] = [];
    acc[diag.category].push(diag);
    return acc;
  }, {} as Record<string, typeof diagnoses>);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Diagnostic (DSM-5) *
      </label>

      <select
        value={selectedDiagnostic || ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      >
        <option value="">Sélectionner un diagnostic...</option>
        {Object.entries(groupedByCategory).map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((diag) => (
              <option key={diag.code} value={diag.code}>
                {diag.code} - {diag.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default DiagnosticSelector;
