#!/bin/bash

echo "========================================"
echo "  Holy Bible - Starting All Services"
echo "========================================"
echo ""

echo "[1/2] Starting Backend Server..."
npm run dev &
BACKEND_PID=$!

sleep 3

echo "[2/2] Starting Frontend Server..."
cd frontend && npm run dev &
FRONTEND_PID=$!

sleep 2

echo ""
echo "========================================"
echo "  All Services Started Successfully!"
echo "========================================"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:4000"
echo "  API Docs:  http://localhost:4000/docs"
echo ""
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
