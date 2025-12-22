# Sauvegarde quotidienne
cd C:\projet-visualcode

Write-Host "SAUVEGARDE RAPIDE..." -ForegroundColor Green
git add --all
git commit -m "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main
Write-Host "TERMINE !" -ForegroundColor Green
