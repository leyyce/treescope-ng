# ==========================================
# STAGE 1: BASE (Common dependencies)
# ==========================================
FROM dunglas/frankenphp:php8.5 AS base

# 1. Install system dependencies and PHP extensions
RUN install-php-extensions \
    pcntl \
    pdo_pgsql \
    pgsql \
    redis \
    bcmath \
    intl \
    zip \
    opcache

# 2. Install Node.js & NPM (Required for Vite and JS build)
RUN apt-get update && apt-get install -y nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Set the default working directory
WORKDIR /app

# ==========================================
# STAGE 2: DEVELOPMENT (Local environment)
# ==========================================
FROM base AS dev

# In development, we stay as the root user to avoid volume permission conflicts
# between the host OS (Windows/Mac) and the Linux container.
# Code is NOT copied here; it is mounted via docker-compose volumes for live-reloading.

# Tell FrankenPHP to use the Octane in-memory worker
ENV FRANKENPHP_CONFIG="worker ./public/frankenphp-worker.php"


# ==========================================
# STAGE 3: PRODUCTION (Server environment)
# ==========================================
FROM base AS prod

# 1. Leverage Docker layer caching: Copy ONLY composer files first
COPY composer.json composer.lock ./

# 2. Install production dependencies (skipping dev tools like Faker/Pest)
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-autoloader --no-scripts

# 3. Copy the rest of the application code
# (If code changes, Docker rebuilds from here, skipping the slow composer install above)
COPY . .

# 4. Finish Composer optimization
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# 5. Build Frontend Assets (Vite/React)
RUN npm install && npm run build

# 6. Prepare Laravel directories and set basic permissions
RUN chmod -R 775 storage bootstrap/cache

# 7. Link storage for public access from the web
RUN php artisan storage:link

# 8. Generate the Octane Worker file
RUN php artisan octane:install --server=frankenphp -n

# 9. SECURITY: Remove Composer so it cannot be abused if the container is compromised
RUN rm /usr/bin/composer

# 10. SECURITY: Create a non-root user and grant specific network capabilities
ARG USER=treescope
RUN useradd ${USER} \
    # Allow the non-root user to bind to privileged ports (80/443) \
    && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp \
    # Transfer ownership of the application and webserver config to the non-root user \
    && chown -R ${USER}:${USER} /app /config/caddy /data/caddy

# 11. Switch context to the non-root user for all subsequent operations
USER ${USER}

# 12. Tell FrankenPHP to use the Octane in-memory worker
ENV FRANKENPHP_CONFIG="worker ./public/frankenphp-worker.php"
