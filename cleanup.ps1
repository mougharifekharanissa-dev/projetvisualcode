# Script de nettoyage
cd C:\projet-visualcode

Write-Host "NETTOYAGE DU DEPOT GITHUB" -ForegroundColor Yellow
Write-Host ""

# 1. Ajouter .gitignore
Write-Host "1. Ajout .gitignore"
git add .gitignore

# 2. Ajouter les nouveaux dossiers
Write-Host "2. Ajout nouveaux dossiers"
git add backend/
git add frontend-html/
git add frontend-react/
git add data/
git add backup.ps1
git add backup-quick.ps1

# 3. Mettre à jour package.json
Write-Host "3. Mise a jour package.json"
git add package.json

# 4. Supprimer anciens fichiers
Write-Host "4. Suppression anciens fichiers"
git add -u

# 5. Voir résumé
Write-Host ""
Write-Host "RESUME DES CHANGEMENTS :" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "CONFIRMER ? (O/N)" -ForegroundColor Red
$choix = Read-Host

if ($choix -eq "O") {
    git commit -m "Refonte complete - Nouvelle architecture"
    git push origin main
    Write-Host "TERMINE !" -ForegroundColor Green
} else {
    Write-Host "ANNULE" -ForegroundColor Red
}
