import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function appAsset(path: string) {
    const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost';
    return `${appUrl}/${path.replace(/^\/+/, '')}?variant=${__ASSET_VERSION__}`;
}

export function getInitialName(name: string) {
    return name
        .match(/(^\S\S?|\b\S)?/g)
        ?.join('')
        .match(/(^\S|\S$)?/g)
        ?.join('')
        .toUpperCase();
}
