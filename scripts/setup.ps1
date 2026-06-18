# -----------------------------------------------------------------
# Manzil Platform -- First-Time Setup Script
# Run once after cloning: npm run setup
# -----------------------------------------------------------------

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot   # project root

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Manzil Platform -- First-Time Setup"    -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Python backends ------------------------------------------------
$backends = @("beacon-backend", "chatbot-backend", "aptitude-backend")

foreach ($svc in $backends) {
    $dir = Join-Path $root $svc
    Write-Host "[$svc] Setting up Python environment..." -ForegroundColor Yellow

    # Create venv if it doesn't exist
    $venvPath = Join-Path $dir "venv"
    if (-Not (Test-Path $venvPath)) {
        Write-Host "  Creating virtual environment..." -ForegroundColor Gray
        python -m venv $venvPath
    } else {
        Write-Host "  Virtual environment already exists, skipping creation." -ForegroundColor Gray
    }

    # Activate and install deps
    Write-Host "  Installing pip dependencies..." -ForegroundColor Gray
    $activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
    & $activateScript
    pip install -r (Join-Path $dir "requirements.txt") --quiet
    deactivate

    # Copy .env.example to .env if needed (only beacon-backend has one)
    $envExample = Join-Path $dir ".env.example"
    $envFile    = Join-Path $dir ".env"
    if ((Test-Path $envExample) -and -not (Test-Path $envFile)) {
        Write-Host '  Copying .env.example -> .env (edit with your credentials)' -ForegroundColor Magenta
        Copy-Item $envExample $envFile
    }

    Write-Host "[$svc] Done!" -ForegroundColor Green
    Write-Host ""
}

# --- Node frontends -------------------------------------------------
$frontends = @("beacon-frontend", "chatbot-frontend", "aptitude-frontend")

foreach ($svc in $frontends) {
    $dir = Join-Path $root $svc
    Write-Host "[$svc] Installing npm dependencies..." -ForegroundColor Yellow
    Push-Location $dir
    npm install --silent
    Pop-Location

    # Copy .env.example to .env if needed
    $envExample = Join-Path $dir ".env.example"
    $envFile    = Join-Path $dir ".env"
    if ((Test-Path $envExample) -and -not (Test-Path $envFile)) {
        Write-Host "  Copying .env.example -> .env" -ForegroundColor Magenta
        Copy-Item $envExample $envFile
    }

    Write-Host "[$svc] Done!" -ForegroundColor Green
    Write-Host ""
}

# --- Root concurrently ----------------------------------------------
Write-Host "[root] Installing concurrently..." -ForegroundColor Yellow
Push-Location $root
npm install --silent
Pop-Location
Write-Host "[root] Done!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup complete!"                        -ForegroundColor Green
Write-Host ""
Write-Host "  Make sure Docker containers for"        -ForegroundColor White
Write-Host "  PostgreSQL and Redis are running,"      -ForegroundColor White
Write-Host "  then start everything with:"            -ForegroundColor White
Write-Host ""
Write-Host "    npm run dev"                          -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
