@echo off
echo =======================================================
echo          HUM FLEET PLATFORMS - ONLINE TUNNEL SETUP       
echo =======================================================
echo.
echo Starting Backend Server and Tunnel...
start cmd /k "cd server && node index.js"
start cmd /k "npx localtunnel --port 5000 --subdomain hum-fleet-backend"

echo Starting Admin Panel and Tunnel...
start cmd /k "cd admin-cms && npm run dev"
start cmd /k "npx localtunnel --port 5173 --subdomain hum-fleet-admin"

echo Starting Passenger/Driver App and Tunnel...
start cmd /k "npm run dev"
start cmd /k "npx localtunnel --port 5174 --subdomain hum-fleet-app"

echo.
echo =======================================================
echo ALL SYSTEMS ONLINE! 
echo Keep these terminal windows open to keep the servers running.
echo.
echo Here are your PUBLIC URLs that you can open on ANY device:
echo.
echo 1. ADMIN PANEL:    https://hum-fleet-admin.loca.lt
echo 2. PASSENGER APP:  https://hum-fleet-app.loca.lt
echo 3. BACKEND API:    https://hum-fleet-backend.loca.lt
echo =======================================================
echo.
pause
