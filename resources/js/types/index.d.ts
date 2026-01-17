import type { Config } from 'ziggy-js';

export interface SharedData {
    auth: Auth;
    app: {
        name: string;
    };
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type PageDataProps = {
    page: {
        title: string;
    };
};
