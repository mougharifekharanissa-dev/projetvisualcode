import React, { useState } from 'react';
import { diagnosticsList, dsm5List } from '../../data/medicalMockData';

interface DiagnosticsSelectorProps {
  selectedDiagnostics: string[];
  selectedDSM5: string[];
  onDiagnosticsChange: (diagnostics: string[]) => void;
  onDSM5Change: (dsm5: string[]) => void;
  errorDiagnostics?: string;
  errorDSM5?: string;
}

const DiagnosticsSelector: React.FC<DiagnosticsSelectorProps> = ({
  selectedDiagnostics,
  selectedDSM5,
  onDiagnosticsChange,
  onDSM5Change,
  errorDiagnostics,
  errorDSM5
}) => {
  const [searchDiagnostic, setSearchDiagnostic] = useState('');
  const [searchDSM5, setSearchDSM5] = useState('');

  // Filtrer diagnostics
  const filteredDiagnostics = diagnosticsList.filter(d =>
    d.nom.toLowerCase().includes(searchDiagnostic.toLowerCase()) ||
    d.codeCIM.toLowerCase().includes(searchDiagnostic.toLowerCase())
  );

  // Filtrer DSM5
  const filteredDSM5 = dsm5List.filter(d =>
    d.nom.toLowerCase().includes(searchDSM5.toLowerCase()) ||
    d.code.toLowerCase().includes(searchDSM5.toLowerCase())
  );

  const handleDiagnosticChange = (codeCIM: string, checked: boolean) => {
    if (checked) {
      onDiagnosticsChange([...selectedDiagnostics, codeCIM]);
    } else {
      onDiagnosticsChange(selectedDiagnostics.filter(d => d !== codeCIM));
    }
  };

  const handleDSM5Change = (code: string) => {
    // Pour DSM5, on ne peut sélectionner qu'un seul code généralement
    onDSM5Change([code]);
  };

  return (
    <div className="space-y-6">
      {/* Diagnostics CIM */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagnostics proposés (CIM-10) *
          {selectedDiagnostics.length > 0 && (
            <span className="ml-2 text-sm text-green-600">
              ({selectedDiagnostics.length} sélectionné(s))
            </span>
          )}
        </label>
        
        {errorDiagnostics && (
          <p className="text-red-500 text-sm mb-2">{errorDiagnostics}</p>
        )}
        
        <div className="mb-3">
          <input
            type="text"
            placeholder="Rechercher un diagnostic..."
            value={searchDiagnostic}
            onChange={(e) => setSearchDiagnostic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
          {filteredDiagnostics.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">Aucun diagnostic trouvé</p>
          ) : (
            filteredDiagnostics.map((diagnostic) => (
              <label
                key={diagnostic.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedDiagnostics.includes(diagnostic.codeCIM)}
                  onChange={(e) => handleDiagnosticChange(diagnostic.codeCIM, e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">{diagnostic.codeCIM}</span>
                  <span className="ml-2">{diagnostic.nom}</span>
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* DSM-5 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Classification DSM-5
          {selectedDSM5.length > 0 && (
            <span className="ml-2 text-sm text-green-600">
              (Code: {selectedDSM5[0]})
            </span>
          )}
        </label>
        
        {errorDSM5 && (
          <p className="text-red-500 text-sm mb-2">{errorDSM5}</p>
        )}
        
        <div className="mb-3">
          <input
            type="text"
            placeholder="Rechercher un code DSM-5..."
            value={searchDSM5}
            onChange={(e) => setSearchDSM5(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
          {filteredDSM5.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">Aucun code DSM-5 trouvé</p>
          ) : (
            <div className="space-y-2">
              {filteredDSM5.map((dsm) => (
                <div
                  key={dsm.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedDSM5.includes(dsm.code)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleDSM5Change(dsm.code)}
                >
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full border mr-3 ${
                      selectedDSM5.includes(dsm.code)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-800">
                        {dsm.code} - {dsm.nom}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Critères: </span>
                        {dsm.criteres.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsSelector;