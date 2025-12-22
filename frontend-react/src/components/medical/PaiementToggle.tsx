import React, { useState } from 'react';

interface PaiementToggleProps {
  paiementEffectue: boolean;
  montantPaiement: number | null;
  onPaiementToggle: (effectue: boolean) => void;
  onMontantChange: (montant: number | null) => void;
  errorMontant?: string;
}

const PaiementToggle: React.FC<PaiementToggleProps> = ({
  paiementEffectue,
  montantPaiement,
  onPaiementToggle,
  onMontantChange,
  errorMontant
}) => {
  const [montantInput, setMontantInput] = useState(
    montantPaiement?.toString() || ''
  );

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMontantInput(value);
    
    if (value === '') {
      onMontantChange(null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onMontantChange(numValue);
      }
    }
  };

  const handlePaiementToggle = (effectue: boolean) => {
    onPaiementToggle(effectue);
    if (!effectue) {
      setMontantInput('');
      onMontantChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Paiement
        </label>
        
        {/* Toggle Oui/Non */}
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handlePaiementToggle(true)}
              className={`px-4 py-2 rounded-l-md border ${
                paiementEffectue
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={() => handlePaiementToggle(false)}
              className={`px-4 py-2 rounded-r-md border ${
                !paiementEffectue
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Non
            </button>
          </div>
          
          <div className={`text-sm font-medium ${
            paiementEffectue ? 'text-green-600' : 'text-red-600'
          }`}>
            {paiementEffectue ? 'Paiement effectué' : 'Paiement non effectué'}
          </div>
        </div>

        {/* Champ montant conditionnel */}
        {paiementEffectue && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant payé (DA) *
            </label>
            
            {errorMontant && (
              <p className="text-red-500 text-sm mb-2">{errorMontant}</p>
            )}
            
            <div className="relative max-w-xs">
              <input
                type="number"
                min="0"
                step="100"
                value={montantInput}
                onChange={handleMontantChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="0"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">DA</span>
              </div>
            </div>
            
            {/* Suggestions de montants */}
            <div className="mt-2 flex flex-wrap gap-2">
              {[1000, 2000, 3000, 5000, 10000].map((montant) => (
                <button
                  key={montant}
                  type="button"
                  onClick={() => {
                    setMontantInput(montant.toString());
                    onMontantChange(montant);
                  }}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    montantPaiement === montant
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {montant.toLocaleString()} DA
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaiementToggle;