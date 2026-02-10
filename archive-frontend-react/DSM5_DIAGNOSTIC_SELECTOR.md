# Composant Diagnostic Selector DSM-5

## Description
Sélecteur dropdown pour les codes DSM-5 avec recherche et groupement par catégorie.

## Fichiers créés/modifiés

### 1. Hook: `src/hooks/useDSM5Diagnoses.ts`
Gère le chargement et la mise en cache des diagnostics DSM-5.

**Fonctionnalités:**
- Chargement des données DSM-5 (stockées localement)
- Mise en cache automatique
- Recherche par code ou label
- Groupement par catégorie
- Validation des codes existants

**Fonctions exportées:**
```typescript
const {
  diagnoses,              // Array de tous les diagnostics
  loading,                // Boolean: état du chargement
  error,                  // String | null: erreur si présente
  getDiagnosesByCategory, // Groupé par catégorie
  filterDiagnoses,        // Filtre par query
  getDiagnosisByCode      // Récupère un diagnostic par code
} = useDSM5Diagnoses();
```

### 2. Composant: `src/components/medical/DiagnosticSelector.tsx`
Composant UI pour sélectionner un diagnostic DSM-5.

**Props:**
```typescript
interface DiagnosticSelectorProps {
  selectedDiagnostic: string | null;  // Code sélectionné (ex: "F41.1")
  onChange: (code: string | null) => void;
  error?: string;                      // Message d'erreur de validation
}
```

**Fonctionnalités:**
- Dropdown avec recherche en temps réel
- Groupement par catégorie (sticky headers)
- Affichage: "F41.1 - Trouble anxieux généralisé"
- Indicateur visuel pour la sélection (checkmark)
- Gestion des états: loading, empty, error
- Fermeture du dropdown en cliquant sur une option
- Remise à zéro de la recherche après sélection

### 3. Schéma de validation: `src/pages/ConsultationPage.tsx`
Ajout du champ `diagnosticPrincipal` au schéma Zod.

```typescript
diagnosticPrincipal: z.string().min(1, "Un diagnostic DSM-5 est requis").nullable(),
```

**Validation:**
- Requis: Un diagnostic doit être sélectionné
- Type: String (code DSM-5)
- Exemple valide: "F41.1"

### 4. Intégration dans le formulaire
```typescript
<Controller
  name="diagnosticPrincipal"
  control={control}
  render={({ field, fieldState }) => (
    <DiagnosticSelector
      selectedDiagnostic={(field.value as string | null) || null}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  )}
/>
```

## Utilisation

### Ajouter à d'autres pages
```typescript
import DiagnosticSelector from '../components/medical/DiagnosticSelector';
import { useDSM5Diagnoses } from '../hooks/useDSM5Diagnoses';
import { Controller } from 'react-hook-form';

// Dans votre composant...
<Controller
  name="diagnostic"
  control={control}
  render={({ field, fieldState }) => (
    <DiagnosticSelector
      selectedDiagnostic={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  )}
/>
```

## Architecture

### Flux de données
1. **Hook `useDSM5Diagnoses`** charge les données DSM-5
2. **Composant `DiagnosticSelector`** affiche l'UI et gère les interactions
3. **React Hook Form** avec **Zod** valide et sauvegarde les données
4. **ConsultationPage** intègre tout ensemble

### Données DSM-5
Base de données locale avec 40+ diagnostics regroupés en 8 catégories:
- Troubles anxieux
- Troubles dépressifs
- Troubles bipolaires
- Troubles obsessionnels
- Troubles relationnels
- Troubles liés au trauma
- Troubles psychotiques
- Troubles neurodéveloppementaux
- Troubles de la personnalité

## Stockage en cache

Les données sont stockées en cache dans le hook:
- Première requête: Chargement depuis le tableau local
- Requêtes suivantes: Utilisation du cache (pas de nouvelle requête)
- Pas de rechargement à chaque fois que le composant est créé

## API

Le composant envoie juste le code DSM-5 à l'API:
```json
{
  "diagnosticPrincipal": "F41.1"
}
```

## Personnalisation

### Ajouter des diagnostics
Modifier `src/hooks/useDSM5Diagnoses.ts`:
```typescript
const DSM5_DATA: DSM5Diagnosis[] = [
  // ...
  { code: 'F99.9', label: 'Nouveau diagnostic', category: 'Ma catégorie' },
];
```

### Modifier l'apparence
Modifier les classes Tailwind dans `src/components/medical/DiagnosticSelector.tsx`:
- `.w-full` → largeur
- `.px-3 py-2` → padding
- `max-h-80` → hauteur max du dropdown
- `bg-blue-100` → couleur de sélection

### Changer les catégories
Ajouter une nouvelle catégorie dans `DSM5_DATA`:
```typescript
{ code: 'X00.0', label: 'Nouveau', category: 'Nouvelle catégorie' }
```

## Dépendances
- `react`: ^17.0.0
- `react-hook-form`: ^7.0.0
- `zod`: ^3.0.0
- `tailwindcss`: pour les styles

## Notes
- Les données DSM-5 sont une sélection représentative, pas exhaustive
- Pour une base complète, intégrer une API externe (FHIR, etc.)
- Le composant gère automatiquement les erreurs de validation
- La recherche est case-insensitive
