# JOYNII Development Environment Start Script

Write-Host "Starting JOYNII Development Environment..." -ForegroundColor Cyan

# 1. Start Backend (Django)
Write-Host "Starting Django Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { 
    $host.UI.RawUI.WindowTitle = 'JOYNII Backend';
    Write-Host 'Django Backend Server' -ForegroundColor Yellow; 
    
    if (Test-Path 'venv') { 
        Write-Host 'Activating venv...' -ForegroundColor Green;
        .\venv\Scripts\activate 
    } else { 
        Write-Host 'No venv found, trying global python...' -ForegroundColor Red 
    };
    
    python manage.py runserver 8000 
}"

# 2. Start Frontend (Next.js)
Write-Host "Starting Next.js Client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { 
    $host.UI.RawUI.WindowTitle = 'JOYNII Frontend';
    Write-Host 'Next.js Client Server' -ForegroundColor Cyan;
    
    cd client; 
    npm run dev:https 
}"

Write-Host "All servers started!" -ForegroundColor Cyan
Write-Host "Backend : http://127.0.0.1:8000"
Write-Host "Frontend: https://localhost:3000"
