FROM dunglas/frankenphp:php8.5

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

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 2. Set working directory
WORKDIR /treescope-ng

# 3. Copy Composer files and install PHP dependencies
COPY composer.json composer.lock ./
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-autoloader --no-scripts

# 4. Copy the rest of the application code
COPY . .

# 5. Finish Composer optimization
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# 6. Build Frontend Assets (Vite/React)
RUN npm install && npm run build

# 7. Prepare Laravel directories
RUN chmod -R 775 storage bootstrap/cache

# 8. Define the Command (allows overrides in compose.yaml)
# CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=443", "--admin-port=2019", "--https"]

# 8. Publish the official Octane worker script (-n prevents interactive prompts)
RUN php artisan octane:install --server=frankenphp -n

# 9. Tell FrankenPHP to use the new Octane worker script instead of index.php
ENV FRANKENPHP_CONFIG="worker ./public/frankenphp-worker.php"
