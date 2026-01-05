import React from 'react';
import { symptomesList } from '../../data/medicalMockData';

interface SymptomesSelectorProps {
  selectedSymptomes: string[];
  onChange: (symptomes: string[]) => void;
  error?: string;
}

const SymptomesSelector: React.FC<SymptomesSelectorProps> = ({
  selectedSymptomes,
  onChange,
  error
}) => {
  const handleCheckboxChange = (code: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedSymptomes, code]);
    } else {
      onChange(selectedSymptomes.filter(s => s !== code));
    }
  };

  // Grouper par catégorie
  const symptomesByCategorie = symptomesList.reduce((acc, symptome) => {
    if (!acc[symptome.categorie]) {
      acc[symptome.categorie] = [];
    }
    acc[symptome.categorie].push(symptome);
    return acc;
  }, {} as Record<string, typeof symptomesList>);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Symptômes observés *
          {selectedSymptomes.length > 0 && (
            <span className="ml-2 text-sm text-green-600">
              ({selectedSymptomes.length} sélectionné(s))
            </span>
          )}
        </label>
        
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4">
          {Object.entries(symptomesByCategorie).map(([categorie, symptomes]) => (
            <div key={categorie} className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                {categorie}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {symptomes.map((symptome) => (
                  <label
                    key={symptome.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptomes.includes(symptome.code)}
                      onChange={(e) => handleCheckboxChange(symptome.code, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">{symptome.nom}</span>
                      <span className="text-gray-500 text-xs ml-2">({symptome.code})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Tout désélectionner
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomesSelector;