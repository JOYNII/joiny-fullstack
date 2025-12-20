# dev.ps1 - JOYNII Fullstack Developer Startup Script

Write-Host "🚀 Starting JOYNII Development Environment..." -ForegroundColor Cyan

# 1. Start Backend (Django) in a new window
Write-Host "Starting Django Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { 
    Write-Host '🐍 Django Backend' -ForegroundColor Yellow; 
    if (Test-Path 'venv') { .\venv\Scripts\activate } else { Write-Host '⚠️ No venv found, trying global python...' -ForegroundColor Red };
    python manage.py runserver 8000 
}"

# 2. Start Frontend (Client) in a new window
Write-Host "Starting Next.js Client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { 
    Write-Host '⚛️ Next.js Client' -ForegroundColor Cyan;
    cd client; 
    npm run dev:https 
}"

Write-Host "✅ All servers started in new windows!" -ForegroundColor Cyan
Write-Host "Backend: http://127.0.0.1:8000"
Write-Host "Frontend: https://localhost:3000"
