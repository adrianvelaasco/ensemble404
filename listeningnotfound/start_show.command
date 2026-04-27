#!/bin/bash

# Absolute path to the project directory
PROJECT_DIR="/Users/adrianvelascocarneros/Desktop/Estudios/Otros/Calls/D-BU/Web Application/listeningnotfound"

# Move to the project directory
cd "$PROJECT_DIR" || { echo "Error: Could not find project directory at $PROJECT_DIR"; exit 1; }

echo "------------------------------------------------"
echo "STARTING SHOW CONFIGURATION"
echo "------------------------------------------------"

# Kill existing servers
lsof -i :8080 -t | xargs kill -9 2>/dev/null
lsof -i :8081 -t | xargs kill -9 2>/dev/null

# Start Bridge and Web Server
node osc-bridge.js &
npx -y http-server . -p 8080 &

# Wait for initialization
sleep 2

# Open LIVESET Project Files
echo "Opening LIVESET projects (QLab, Lightkey, Ableton, Previz)..."
open "/Users/adrianvelascocarneros/Desktop/Estudios/Otros/Calls/D-BU/LIVESET/Listening Not Found/Listening Not Found.qlab5"
open "/Users/adrianvelascocarneros/Desktop/Estudios/Otros/Calls/D-BU/LIVESET/Listening Not Found.lightkeyproj"
open "/Users/adrianvelascocarneros/Desktop/Estudios/Otros/Calls/D-BU/LIVESET/Listening Not Found Project/Listening Not Found.als"
open "/Users/adrianvelascocarneros/Desktop/Estudios/Otros/Calls/D-BU/LIVESET/Previz.c2s"

echo "------------------------------------------------"
echo "SHOW IS READY"
echo "------------------------------------------------"

# Keep terminal open for logs
wait
