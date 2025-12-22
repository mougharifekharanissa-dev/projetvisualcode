# ============================================
# SAUVEGARDE CABINET PSYCHIATRIQUE - SIMPLE
# ============================================

Write-Host "DEBUT DE LA SAUVEGARDE..."

# Définir les chemins
$projet = "C:\projet-visualcode"
$backup = "C:\Backup-Cabinet-20251222"
$date = Get-Date -Format "yyyy-MM-dd_HHmm"
$dossierBackup = "$backup\Cabinet_$date"

# Créer le dossier de sauvegarde
Write-Host "Creation du dossier: $dossierBackup"
New-Item -ItemType Directory -Path $dossierBackup -Force | Out-Null

# Liste des fichiers/dossiers à copier
$fichiersImportants = @(
    "backend",
    "public", 
    "src",
    "package.json",
    "package-lock.json",
    ".gitignore",
    "README.md"
)

# Copier chaque fichier
Write-Host "Copie des fichiers..."
foreach ($fichier in $fichiersImportants) {
    $cheminSource = Join-Path $projet $fichier
    if (Test-Path $cheminSource) {
        Write-Host "  - $fichier"
        Copy-Item -Path $cheminSource -Destination $dossierBackup -Recurse -Force
    }
}

# Créer un fichier info simple
$info = "SAUVEGARDE CABINET PSYCHIATRIQUE`r`n"
$info += "Date: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')`r`n"
$info += "Projet: $projet`r`n"
$info += "Backup: $dossierBackup`r`n`r`n"
$info += "Pour restaurer:`r`n"
$info += "1. Copier le dossier $dossierBackup`r`n"
$info += "2. Ouvrir dans VS Code`r`n"
$info += "3. Dans le terminal: npm install`r`n"
$info += "4. Puis: npm start"

$info | Out-File -FilePath "$dossierBackup\INFO_SAUVEGARDE.txt"

# Message final
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SAUVEGARDE TERMINEE !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Dossier cree: $dossierBackup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour verifier: explorer ""$dossierBackup""" -ForegroundColor Cyan

# Pause pour voir le message
Write-Host "`nAppuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")