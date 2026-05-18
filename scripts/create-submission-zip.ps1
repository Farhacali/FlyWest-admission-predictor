# Creates FlyWest-Admission-Predictor-Submit.zip for DojoWorks file upload
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$staging = Join-Path $projectRoot "submission-staging"
$zipPath = Join-Path $projectRoot "FlyWest-Admission-Predictor-Submit.zip"

$excludeDirs = @('node_modules', 'venv', 'dist', '.git', 'submission-staging', '__pycache__')
$excludeFiles = @('*.zip', '.env', '.env.local', '.env.production')

Write-Host "Preparing submission package..." -ForegroundColor Cyan

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

$items = @(
    'backend',
    'frontend',
    'ml-service',
    'scripts',
    'README.md',
    'DEPLOYMENT.md',
    'DOJOWORKS_SUBMISSION.md',
    'render.yaml',
    '.gitignore'
)

foreach ($item in $items) {
    $src = Join-Path $projectRoot $item
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $staging $item) -Recurse -Force
    }
}

# Strip heavy / generated folders from copy
Get-ChildItem $staging -Recurse -Directory | ForEach-Object {
    $name = $_.Name
    if ($excludeDirs -contains $name) {
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Remove .env files if copied
Get-ChildItem $staging -Recurse -File -Filter ".env*" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne '.env.example' -and $_.Name -ne '.env.production.example' } |
    Remove-Item -Force

Compress-Archive -Path "$staging\*" -DestinationPath $zipPath -Force
Remove-Item $staging -Recurse -Force

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "Done! Upload this file to DojoWorks:" -ForegroundColor Green
Write-Host "  $zipPath" -ForegroundColor Yellow
Write-Host "  Size: ${sizeMb} MB" -ForegroundColor Gray
Write-Host ""
Write-Host "Remember to add your live URL to README.md before zipping again if needed." -ForegroundColor Cyan
