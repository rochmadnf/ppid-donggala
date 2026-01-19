import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function ConsoleHeader() {
    const { page } = usePage<PageDataProps>().props;
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b border-line-brand bg-white px-6">
            <h1 className="text-2xl font-semibold tracking-wider">{page.title}</h1>
        </header>
    );
}
