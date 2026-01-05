import React, { useState } from 'react';
import { medicamentsList } from '../../data/medicalMockData';

interface MedicamentsSelectorProps {
  selectedMedicaments: string[];
  onChange: (medicaments: string[]) => void;
  error?: string;
}

const MedicamentsSelector: React.FC<MedicamentsSelectorProps> = ({
  selectedMedicaments,
  onChange,
  error
}) => {
  const [search, setSearch] = useState('');
  const [selectedClasse, setSelectedClasse] = useState<string>('Tous');

  // Extraire les classes uniques
  const classes = Array.from(new Set(medicamentsList.map(m => m.classe)));

  // Filtrer les médicaments
  const filteredMedicaments = medicamentsList.filter(med => {
    const matchesSearch = 
      med.nom.toLowerCase().includes(search.toLowerCase()) ||
      med.code.toLowerCase().includes(search.toLowerCase());
    const matchesClasse = selectedClasse === 'Tous' || med.classe === selectedClasse;
    return matchesSearch && matchesClasse;
  });

  const handleMedicamentChange = (code: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedMedicaments, code]);
    } else {
      onChange(selectedMedicaments.filter(m => m !== code));
    }
  };

  const getSelectedMedicamentsInfo = () => {
    return selectedMedicaments.map(code => {
      const med = medicamentsList.find(m => m.code === code);
      return med ? `${med.nom} ${med.dosage}` : code;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Traitements prescrits
          {selectedMedicaments.length > 0 && (
            <span className="ml-2 text-sm text-green-600">
              ({selectedMedicaments.length} médicament(s))
            </span>
          )}
        </label>
        
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        
        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un médicament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="Tous">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe} value={classe}>
                  {classe}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des médicaments */}
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4">
          {filteredMedicaments.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              Aucun médicament trouvé
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMedicaments.map((medicament) => (
                <label
                  key={medicament.id}
                  className={`flex items-start space-x-3 p-3 border rounded cursor-pointer transition-colors ${
                    selectedMedicaments.includes(medicament.code)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMedicaments.includes(medicament.code)}
                    onChange={(e) => handleMedicamentChange(medicament.code, e.target.checked)}
                    className="h-4 w-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {medicament.nom}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Dosage:</span> {medicament.dosage}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Forme:</span> {medicament.forme}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {medicament.classe}
                      </span>
                      <span className="ml-2 text-gray-400">
                        Code: {medicament.code}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Médicaments sélectionnés */}
        {selectedMedicaments.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">
              Médicaments sélectionnés:
            </h4>
            <div className="flex flex-wrap gap-2">
              {getSelectedMedicamentsInfo().map((info, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {info}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicamentsSelector;