@echo off
REM Set the title for the console window
TITLE Local File Manager Server

echo Starting Node.js server...
REM Use "start" to run the server in a new non-blocking window
start "Node.js Server" node server.js

echo Opening web browser...
REM Wait a couple of seconds to give the server time to start
timeout /t 2 /nobreak > nul
start http://localhost:3000

echo Opening storage directory in File Explorer...
REM %cd% is a variable that represents the current directory
start "" "%cd%\storage"

echo Done. The server is running in a separate window.