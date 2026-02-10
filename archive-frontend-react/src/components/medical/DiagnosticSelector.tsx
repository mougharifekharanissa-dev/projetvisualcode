import React, { useMemo } from 'react';
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
  const { diagnoses, loading, filterDiagnoses, getDiagnosisByCode } = useDSM5Diagnoses();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredDiagnoses = useMemo(() => {
    return filterDiagnoses(searchQuery);
  }, [searchQuery, diagnoses]);

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, typeof diagnoses> = {};
    filteredDiagnoses.forEach(diag => {
      if (!grouped[diag.category]) {
        grouped[diag.category] = [];
      }
      grouped[diag.category].push(diag);
    });
    return grouped;
  }, [filteredDiagnoses]);

  const selectedDiag = selectedDiagnostic ? getDiagnosisByCode(selectedDiagnostic) : null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Diagnostic (DSM-5) *
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex justify-between items-center">
            <span className={selectedDiag ? 'text-gray-900' : 'text-gray-500'}>
              {selectedDiag ? `${selectedDiag.code} - ${selectedDiag.label}` : 'Sélectionner un diagnostic'}
            </span>
            <span className="text-gray-400">
              {isOpen ? '▼' : '▶'}
            </span>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {/* Barre de recherche */}
            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Rechercher par code ou label..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Liste des diagnostics */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Chargement...
                </div>
              ) : filteredDiagnoses.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Aucun diagnostic trouvé
                </div>
              ) : (
                Object.entries(groupedByCategory).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-3 py-2 bg-gray-100 text-sm font-semibold text-gray-700 sticky top-12">
                      {category}
                    </div>
                    {items.map((diag) => (
                      <button
                        key={diag.code}
                        type="button"
                        onClick={() => {
                          onChange(diag.code);
                          setIsOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex justify-between items-center ${
                          selectedDiagnostic === diag.code ? 'bg-blue-100' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{diag.code}</div>
                          <div className="text-gray-600">{diag.label}</div>
                        </div>
                        {selectedDiagnostic === diag.code && (
                          <span className="text-blue-600 font-semibold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-red-500 text-sm">
          {error}
        </p>
      )}

      {selectedDiag && (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Sélectionné:</span> {selectedDiag.code} - {selectedDiag.label}
        </p>
      )}
    </div>
  );
};

export default DiagnosticSelector;
