@echo off
echo (Skipping local backend - connected to live cloud server)

echo Starting HUM Fleet Admin Panel...
start cmd /k "cd admin-cms && npm run dev"

echo Waiting for servers to start...
timeout /t 3 /nobreak > nul

echo Opening Admin Panel in your browser...
start http://localhost:5173
