#!/bin/sh
set -e

if [ "$APP_ENV" = "production" ]; then
    echo "Caching configuration for production..."
    php artisan config:cache
    php artisan event:cache
    # route:cache and view:cache are already baked into the image at build time
else
    echo "Dev mode: skipping config cache (using live .env)..."
    # Clear any stale caches that might have leaked from a prod image
    php artisan config:clear
    php artisan cache:clear
fi

if [ "$CONTAINER_ROLE" = "app" ]; then
    # Always run migrations — safe on both envs
    echo "Running database migrations..."
    php artisan migrate --force

    echo "Starting FrankenPHP on ${APP_HOST_NAME}..."
    exec php artisan octane:frankenphp \
        --host="${APP_HOST_NAME}" \
        --port="${OCTANE_PORT:-443}" \
        --https \
        --http-redirect
fi

# Worker / Scheduler roles fall through to their compose `command:`
exec "$@"
