import type { Dispatch, SetStateAction } from 'react';

export interface DrawerProps {
    openDrawer: boolean;
    setOpenDrawer: Dispatch<SetStateAction<boolean>>;
}

export interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export interface ConsoleLayoutProps {}
