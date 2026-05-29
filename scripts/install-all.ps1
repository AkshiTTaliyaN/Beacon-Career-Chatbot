# -----------------------------------------------------------------
# Beacon Platform -- Reinstall All Dependencies
# Run when deps change: npm run install:all
# -----------------------------------------------------------------

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "Reinstalling all dependencies..." -ForegroundColor Cyan
Write-Host ""

# --- Python backends ------------------------------------------------
$backends = @("beacon-backend", "chatbot-backend", "aptitude-backend")

foreach ($svc in $backends) {
    $dir = Join-Path $root $svc
    $venvPath = Join-Path $dir "venv"
    $activateScript = Join-Path $venvPath "Scripts\Activate.ps1"

    if (-Not (Test-Path $activateScript)) {
        Write-Host "[$svc] No venv found -- run 'npm run setup' first." -ForegroundColor Red
        continue
    }

    Write-Host "[$svc] Installing pip dependencies..." -ForegroundColor Yellow
    & $activateScript
    pip install -r (Join-Path $dir "requirements.txt") --quiet
    deactivate
    Write-Host "[$svc] Done!" -ForegroundColor Green
}

Write-Host ""

# --- Node frontends -------------------------------------------------
$frontends = @("beacon-frontend", "chatbot-frontend", "aptitude-frontend")

foreach ($svc in $frontends) {
    $dir = Join-Path $root $svc
    Write-Host "[$svc] Installing npm dependencies..." -ForegroundColor Yellow
    Push-Location $dir
    npm install --silent
    Pop-Location
    Write-Host "[$svc] Done!" -ForegroundColor Green
}

# --- Root -----------------------------------------------------------
Write-Host ""
Write-Host "[root] Installing root dependencies..." -ForegroundColor Yellow
Push-Location $root
npm install --silent
Pop-Location
Write-Host "[root] Done!" -ForegroundColor Green

Write-Host ""
Write-Host "All dependencies reinstalled!" -ForegroundColor Green
