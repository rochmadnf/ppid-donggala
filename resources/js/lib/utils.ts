import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function appAsset(path: string) {
    const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost';
    return `${appUrl}/${path.replace(/^\/+/, '')}?ass_ver=${__ASSET_VERSION__}`;
}
