# backup-quick.ps1 - Sauvegarde rapide GitHub
cd C:\projet-visualcode

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SAUVEGARDE RAPIDE GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n Changements detectes :" -ForegroundColor Yellow
git status --short

Write-Host "`n Continuer ? (O/N)" -ForegroundColor Yellow
$reponse = Read-Host

if ($reponse -eq "O" -or $reponse -eq "o") {
    Write-Host "`n Sauvegarde en cours..." -ForegroundColor Gray
    git add --all
    git commit -m "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin main
    Write-Host "`n SAUVEGARDE REUSSIE !" -ForegroundColor Green
} else {
    Write-Host "`n Annule" -ForegroundColor Red
}

Write-Host "`nAppuyez sur Entree pour fermer..."
Read-Host
