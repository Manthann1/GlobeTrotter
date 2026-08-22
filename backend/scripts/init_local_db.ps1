# Script to initialize a dedicated local PostgreSQL database cluster for GlobeTrotter
$ErrorActionPreference = "Stop"

$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"
$DATA_DIR = Join-Path $PSScriptRoot "..\pg_data"
$PORT = 5433
$DB_NAME = "globetrotter"
$DB_USER = "postgres"
$DB_PASS = "postgres"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  GlobeTrotter Local PostgreSQL Cluster Initializer" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path "$PG_BIN\initdb.exe")) {
    Write-Error "PostgreSQL binaries not found at $PG_BIN. Please check your PostgreSQL installation path."
    exit 1
}

# 1. Initialize cluster if directory doesn't exist
if (-not (Test-Path $DATA_DIR)) {
    Write-Host "[1/3] Initializing new PostgreSQL data cluster at: $DATA_DIR" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $DATA_DIR -Force | Out-Null
    
    # Initialize with trust auth for localhost
    & "$PG_BIN\initdb.exe" -D $DATA_DIR -U $DB_USER -A trust --encoding=UTF8
    if ($LASTEXITCODE -ne 0) {
        Write-Error "initdb failed"
        exit 1
    }
    Write-Host " Cluster initialized successfully." -ForegroundColor Green
} else {
    Write-Host "[1/3] Existing data directory found at $DATA_DIR" -ForegroundColor Green
}

# 2. Check if postgres is already running on port 5433
$isRunning = Test-NetConnection -ComputerName 127.0.0.1 -Port $PORT -InformationLevel Quiet
if (-not $isRunning) {
    Write-Host "[2/3] Starting background PostgreSQL server on port $PORT..." -ForegroundColor Yellow
    Start-Process -FilePath "$PG_BIN\postgres.exe" -ArgumentList "-D `"$DATA_DIR`" -p $PORT" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# 3. Create database if it doesn't exist
Write-Host "[3/3] Creating '$DB_NAME' database if needed..." -ForegroundColor Yellow
$env:PGPASSWORD = $DB_PASS
& "$PG_BIN\createdb.exe" -h 127.0.0.1 -p $PORT -U $DB_USER $DB_NAME 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host " Database '$DB_NAME' created." -ForegroundColor Green
} else {
    Write-Host " Database '$DB_NAME' already exists or ready." -ForegroundColor Green
}

Write-Host " Local PostgreSQL cluster is ready at: postgresql://postgres:postgres@localhost:$PORT/$DB_NAME?schema=public" -ForegroundColor Cyan
