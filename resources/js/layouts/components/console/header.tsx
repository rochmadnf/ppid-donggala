import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function ConsoleHeader() {
    const { page } = usePage<PageDataProps>().props;
    return (
        <header className="sticky top-0 z-10 flex h-14 w-full items-center border-b border-slate-300/30 bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-medium tracking-wide">{page.title}</h1>
        </header>
    );
}
