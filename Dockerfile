# ==========================================
# STAGE 1: BASE (Common dependencies)
# ==========================================
FROM dunglas/frankenphp:php8.5 AS base

# 1. Install system dependencies and PHP extensions
# (Kept unzip and zip here as Composer needs them)
RUN apt-get update && apt-get install -y unzip zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN install-php-extensions \
    pcntl \
    pdo_pgsql \
    pgsql \
    redis \
    bcmath \
    intl \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# 2. Set the default working directory
WORKDIR /app

# ==========================================
# STAGE 2: FRONTEND ASSETS (Node Build)
# ==========================================
# We use a temporary Node image purely to compile Vite/React assets
FROM node:20-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================================
# STAGE 3: DEVELOPMENT (Local environment)
# ==========================================
FROM base AS dev

# Install Node in dev because Vite hot-reloading needs it
RUN apt-get update && apt-get install -y nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Code is NOT copied here; it is mounted via docker-compose volumes
# Tell FrankenPHP to use the Octane in-memory worker
# ENV FRANKENPHP_CONFIG="worker ./public/frankenphp-worker.php"
ENTRYPOINT ["/app/docker/entrypoint.sh"]


# ==========================================
# STAGE 4: PRODUCTION (Server environment)
# ==========================================
FROM base AS prod

# 1. Leverage Docker layer caching for Composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-autoloader --no-scripts

# 2. Copy the rest of the application code
COPY . .

# 3. Copy the pre-built frontend assets from the Node stage
COPY --from=assets /app/public/build /app/public/build

# 4. Finish Composer optimization
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# 5. Prepare Laravel directories and set basic permissions
RUN mkdir -p storage/framework/views storage/framework/cache/data storage/framework/sessions storage/logs \
    && chmod -R 775 storage bootstrap/cache \
    && chmod +x docker/entrypoint.sh

# 6. Pre-compile Laravel code for maximum runtime speed
# (We intentionally skip config:cache here because runtime .env vars are missing during build)
RUN php artisan view:cache \
    && php artisan route:cache \
    && php artisan event:cache

# 7. Link storage for public access from the web
RUN php artisan storage:link

# 8. Generate the Octane Worker file
RUN php artisan octane:install --server=frankenphp -n

# 9. SECURITY: Remove Composer
RUN rm /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=0

# 10. SECURITY: Create a non-root user and fix volume permissions
ARG USER=treescope
RUN useradd ${USER} \
    && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp \
    # Ensure the non-root user owns the root of the data/config mounts to prevent Caddy permission errors \
    && chown -R ${USER}:${USER} /app /config /data

# 11. Switch context to the non-root user for all subsequent operations
USER ${USER}

# 12. Tell FrankenPHP to use the Octane in-memory worker
# ENV FRANKENPHP_CONFIG="worker ./public/frankenphp-worker.php"

# 13. Delegate runtime initialization to our custom script
ENTRYPOINT ["/app/docker/entrypoint.sh"]

# CMD ["php", "artisan", "octane:frankenphp", "--port=443", "--https", "--http-redirect"]
