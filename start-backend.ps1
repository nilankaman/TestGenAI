# TestGen AI - Backend Startup Script
# Run from the project root: .\start-backend.ps1

Write-Host ""
Write-Host "  🧪 TestGen AI - Starting Backend" -ForegroundColor Cyan
Write-Host ""

$jv = java -version 2>&1 | Select-String "version"
Write-Host "  Java: $jv" -ForegroundColor Gray

if ($jv -notmatch '"17') {
    Write-Host ""
    Write-Host "  ⚠  WARNING: This project needs JDK 17." -ForegroundColor Yellow
    Write-Host "     Other versions break Lombok. Set JAVA_HOME to your JDK 17 path." -ForegroundColor Yellow
    Write-Host ""
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$root\backend"

Write-Host "  Backend starting at http://localhost:8081" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

mvn spring-boot:run -DskipTests
