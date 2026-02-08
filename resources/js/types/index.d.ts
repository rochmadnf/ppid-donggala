import type { Config } from 'ziggy-js';

export interface SharedData {
    auth: {
        user: User;
    };
    app: {
        name: string;
        version: string;
    };
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    role: string;
    permissions: string[];
}

export type PageDataProps = {
    page: {
        id: string;
        title: string;
        description: string;
        breadcrumbs: {
            group_id: string;
            items: {
                id: string;
                label: string;
                url: string;
            }[];
        };
    };
};
