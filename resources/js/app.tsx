import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'My App';

createInertiaApp({
    title: (title) => (title ? title : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        hydrateRoot(el, <App {...props} />);
    },
    progress: {
        color: '#EF4444',
    },
});
