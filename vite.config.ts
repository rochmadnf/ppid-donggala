import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        __ASSET_VERSION__: JSON.stringify(execSync('date +%s').toString().trim()),
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    alias: 'sans',
                    weights: [400, 500, 600, 700],
                    styles: ['normal', 'italic'],
                    subsets: ['latin'],
                    display: 'swap',
                    preload: [
                        { weight: 400 },
                        { weight: 700 },
                    ],
                    fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
                }),
                bunny('Inter', {
                    alias: 'inter',
                    weights: [300, 400, 700],
                    styles: ['normal', 'italic'],
                    subsets: ['latin'],
                    display: 'swap',
                    preload: [
                        { weight: 400 },
                    ],
                    fallbacks: ['sans-serif'],
                }),
            ],
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            '@': resolve(__dirname, 'resources/js'),
            '@css': resolve(__dirname, 'resources/css'),
        },
    },
    build: {
        sourcemap: process.env.VITE_SOURCE_MAP === 'true',
        chunkSizeWarningLimit: 2000,
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                manualChunks: (id): string | void => {
                    if (id.includes('@embedpdf/react-pdf-viewer')) return 'pdf-engine';

                    if (
                        id.includes('@radix-ui/react-dialog') ||
                        id.includes('@radix-ui/react-dropdown-menu') ||
                        id.includes('@radix-ui/react-slot') ||
                        id.includes('@radix-ui/react-label')
                    )
                        return 'radix-ui';

                    if (id.includes('@tiptap/core') || id.includes('@tiptap/react')) return 'tiptap-core';
                    if (id.includes('@tiptap/')) return 'tiptap-ext';

                    if (id.includes('@embedpdf/plugin-')) return 'embedpdf-plugins';

                    if (id.includes('lucide-react')) return 'icons';
                },
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@inertiajs/react', 'lucide-react', '@embedpdf/react-pdf-viewer'],
    },
    worker: {
        format: 'es',
    },
});
