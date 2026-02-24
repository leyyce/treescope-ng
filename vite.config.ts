import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load env file based on the current mode
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        esbuild: {
            jsx: 'automatic',
        },
        resolve: {
            alias: {
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
        },
        server: {
            // Use VITE_HOST from .env or default to localhost
            host: env.VITE_HOST || 'localhost',
            // Use VITE_PORT from .env or default to 5173
            port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173,
            // Only enable strict port checking if VITE_PORT is defined
            strictPort: !!env.VITE_PORT,
            // Only add the hmr block if VITE_HMR_HOST is explicitly defined
            ...(env.VITE_HMR_HOST ? { hmr: { host: env.VITE_HMR_HOST } } : {}),
        },
    };
});
