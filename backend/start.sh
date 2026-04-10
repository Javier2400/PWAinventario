#!/bin/sh
set -e

cd /app/backend

if [ ! -d "vendor" ]; then
  echo "Installing PHP dependencies..."
  composer install --no-dev --optimize-autoloader
fi

echo "Starting PHP inventory API on 0.0.0.0:${PORT:-8000}"

exec php -S 0.0.0.0:${PORT:-8000} index.php
