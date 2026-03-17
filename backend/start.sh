#!/bin/sh
set -e

# Wait for DB if needed (add DATABASE_URL check later)
echo "Starting inventory API on 0.0.0.0:${PORT:-8080}"

exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1 --no-reload

