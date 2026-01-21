import type { Config } from 'ziggy-js';

export interface SharedData {
    auth: {
        user: User;
    };
    app: {
        name: string;
    };
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
}

export type PageDataProps = {
    page: {
        id: string;
        title: string;
    };
};
