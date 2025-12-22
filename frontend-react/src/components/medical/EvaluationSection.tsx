import React from 'react';

interface EvaluationSectionProps {
  scoreGAF: number | null;
  notesEvaluation: string;
  onScoreGAFChange: (score: number | null) => void;
  onNotesChange: (notes: string) => void;
  errorScoreGAF?: string;
}

const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  scoreGAF,
  notesEvaluation,
  onScoreGAFChange,
  onNotesChange,
  errorScoreGAF
}) => {
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onScoreGAFChange(null);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
        onScoreGAFChange(numValue);
      }
    }
  };

  const getGAFLevel = (score: number | null) => {
    if (score === null) return { text: 'Non évalué', color: 'text-gray-500' };
    if (score >= 91) return { text: 'Fonctionnement supérieur', color: 'text-green-600' };
    if (score >= 81) return { text: 'Fonctionnement bon', color: 'text-green-500' };
    if (score >= 71) return { text: 'Légères difficultés', color: 'text-yellow-500' };
    if (score >= 61) return { text: 'Difficultés modérées', color: 'text-orange-500' };
    if (score >= 51) return { text: 'Difficultés sérieuses', color: 'text-orange-600' };
    if (score >= 41) return { text: 'Altération sévère', color: 'text-red-500' };
    if (score >= 31) return { text: 'Altération importante', color: 'text-red-600' };
    if (score >= 21) return { text: 'Danger pour soi/autrui', color: 'text-red-700' };
    return { text: 'Danger imminent', color: 'text-red-800' };
  };

  const gafInfo = getGAFLevel(scoreGAF);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Score GAF (Global Assessment of Functioning) *
          {scoreGAF !== null && (
            <span className={`ml-2 font-medium ${gafInfo.color}`}>
              {scoreGAF}/100 - {gafInfo.text}
            </span>
          )}
        </label>
        
        {errorScoreGAF && (
          <p className="text-red-500 text-sm mb-2">{errorScoreGAF}</p>
        )}
        
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="100"
            value={scoreGAF || 50}
            onChange={handleScoreChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="w-24">
            <input
              type="number"
              min="1"
              max="100"
              value={scoreGAF || ''}
              onChange={handleScoreChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="1-100"
            />
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>100: Fonctionnement parfait</span>
            <span>1: Danger imminent</span>
          </div>
          <div className="mt-1 grid grid-cols-5 text-center">
            <span className="text-green-600">91-100</span>
            <span className="text-green-500">81-90</span>
            <span className="text-yellow-500">71-80</span>
            <span className="text-orange-500">61-70</span>
            <span className="text-red-500">≤60</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes d'évaluation
        </label>
        <textarea
          value={notesEvaluation}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Observations supplémentaires sur l'évaluation..."
        />
      </div>
    </div>
  );
};

export default EvaluationSection;