import React, { useState } from 'react';
import { maladiesList } from '../../data/medicalMockData';

interface MaladiesSelectorProps {
  selectedMaladies: string[];
  onChange: (maladies: string[]) => void;
  error?: string;
}

const MaladiesSelector: React.FC<MaladiesSelectorProps> = ({
  selectedMaladies,
  onChange,
  error
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('Toutes');

  // Extraire les catégories uniques
  const categories = Array.from(new Set(maladiesList.map(m => m.categorie)));

  // Filtrer les maladies
  const filteredMaladies = maladiesList.filter(maladie => {
    const matchesSearch = 
      maladie.nom.toLowerCase().includes(search.toLowerCase()) ||
      maladie.codeCIM.toLowerCase().includes(search.toLowerCase());
    const matchesCategorie = selectedCategorie === 'Toutes' || maladie.categorie === selectedCategorie;
    return matchesSearch && matchesCategorie;
  });

  const handleMaladieChange = (codeCIM: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedMaladies, codeCIM]);
    } else {
      onChange(selectedMaladies.filter(m => m !== codeCIM));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maladies associées
          {selectedMaladies.length > 0 && (
            <span className="ml-2 text-sm text-green-600">
              ({selectedMaladies.length} sélectionnée(s))
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
              placeholder="Rechercher une maladie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="Toutes">Toutes catégories</option>
              {categories.map(categorie => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des maladies */}
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-4">
          {filteredMaladies.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              Aucune maladie trouvée
            </p>
          ) : (
            <div className="space-y-2">
              {filteredMaladies.map((maladie) => (
                <label
                  key={maladie.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMaladies.includes(maladie.codeCIM)}
                    onChange={(e) => handleMaladieChange(maladie.codeCIM, e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {maladie.nom}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Code CIM:</span> {maladie.codeCIM}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Catégorie:</span> {maladie.categorie}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Maladies sélectionnées */}
        {selectedMaladies.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Maladies sélectionnées:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedMaladies.map((codeCIM) => {
                const maladie = maladiesList.find(m => m.codeCIM === codeCIM);
                return (
                  <div
                    key={codeCIM}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    <span className="font-medium mr-1">{codeCIM}</span>
                    <span>{maladie?.nom}</span>
                    <button
                      type="button"
                      onClick={() => handleMaladieChange(codeCIM, false)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaladiesSelector;