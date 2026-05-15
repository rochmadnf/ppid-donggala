import '@css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'My App';
const appEnv = import.meta.env.VITE_APP_ENV || 'production';

createInertiaApp({
    title: (title) => (title ? title : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        if (appEnv === 'production') {
            hydrateRoot(el, <App {...props} />);
        } else {
            createRoot(el).render(
                <StrictMode>
                    <App {...props} />
                </StrictMode>,
            );
        }
    },
    progress: {
        color: '#1447E6',
    },
});
