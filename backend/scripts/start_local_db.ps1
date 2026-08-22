# Script to start the GlobeTrotter local PostgreSQL cluster
$ErrorActionPreference = "Stop"

$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"
$DATA_DIR = Join-Path $PSScriptRoot "..\pg_data"
$PORT = 5433

$isRunning = Test-NetConnection -ComputerName 127.0.0.1 -Port $PORT -InformationLevel Quiet
if ($isRunning) {
    Write-Host "PostgreSQL is already running on port $PORT." -ForegroundColor Green
    exit 0
}

if (-not (Test-Path $DATA_DIR)) {
    Write-Host "Data directory not found. Running initialization first..." -ForegroundColor Yellow
    & "$PSScriptRoot\init_local_db.ps1"
    exit 0
}

Write-Host "Starting PostgreSQL cluster from $DATA_DIR on port $PORT..." -ForegroundColor Yellow
Start-Process -FilePath "$PG_BIN\postgres.exe" -ArgumentList "-D `"$DATA_DIR`" -p $PORT" -WindowStyle Hidden
Start-Sleep -Seconds 3

$check = Test-NetConnection -ComputerName 127.0.0.1 -Port $PORT -InformationLevel Quiet
if ($check) {
    Write-Host "PostgreSQL server started successfully on port $PORT." -ForegroundColor Green
} else {
    Write-Host "Failed to verify PostgreSQL on port $PORT." -ForegroundColor Red
}
