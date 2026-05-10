# GuyGuy Development - Start Commands

## Backend Server (Terminal 1)
```powershell
# Terminal 1 - Backend Server
cd "c:\Users\HPA HEALTH CENTER\Desktop\GuyGuy\backend"
go run cmd/server/main.go
```

## Frontend Development Server (Terminal 2)
```powershell
# Terminal 2 - Frontend Server  
cd "c:\Users\HPA HEALTH CENTER\Desktop\GuyGuy\frontend"
npm run dev
```

## Both Servers (Single Command)
```powershell
# Start both backend and frontend in separate terminals
Start-Process powershell -NoNewWindow -ArgumentList '-NoExit' -Command "cd 'c:\Users\HPA HEALTH CENTER\Desktop\GuyGuy\backend'; go run cmd/server/main.go" -Verb RunAs
Start-Process powershell -NoNewWindow -ArgumentList '-NoExit' -Command "cd 'c:\Users\HPA HEALTH CENTER\Desktop\GuyGuy\frontend'; npm run dev" -Verb RunAs
```

## Quick Start Script
```powershell
# Save as start-guyguy.ps1 and run:
.\start-guyguy.ps1
```

## Notes
- Backend typically runs on port 8080
- Frontend typically runs on port 3000 or 5173
- Both servers can run simultaneously
- Use `-NoNewWindow` to run in background
- Adjust paths if your project structure is different
