#!/bin/bash

# Find the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "========================================="
echo "Starting Online Library website..."
echo "========================================="

# Check if conda environment online_library exists
if ! conda info --envs | grep -q "online_library"; then
    echo "Conda environment 'online_library' not found."
    echo "Creating conda environment 'online_library' with python=3.10..."
    conda create -y -n online_library python=3.10
fi

# Run database checks & migrations
echo "Running database migrations..."
conda run -n online_library python backend/manage.py makemigrations
conda run -n online_library python backend/manage.py migrate

# Trap Ctrl+C (SIGINT) to kill background processes on exit
trap "kill 0" EXIT

# Start Django Backend Server in the background
echo "Starting Backend Server on http://127.0.0.1:8000..."
conda run -n online_library python backend/manage.py runserver &

# Wait a couple of seconds for the backend to start
sleep 2

# Start Frontend SimpleHTTP Server on port 5500
echo "Starting Frontend Server on http://127.0.0.1:5500..."
echo "---------------------------------------------------------"
echo "👉 Open http://127.0.0.1:5500/HTML/Home.html in your browser!"
echo "👉 Admin login username: admin"
echo "👉 Admin login password: admin12345"
echo "---------------------------------------------------------"
conda run -n online_library python -m http.server 5500
