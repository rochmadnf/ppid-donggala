import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { ConsoleHeader } from './components/console/header';
import { Sidebar } from './components/console/sidebar';
import type { ConsoleLayoutProps } from './types';

export default function ConsoleLayout({ children }: PropsWithChildren<ConsoleLayoutProps>) {
    const { page } = usePage<PageDataProps>().props;
    return (
        <div className="mx-auto grid min-h-dvh w-full max-w-7xl grid-cols-12 border-0 border-line-brand md:border-x">
            {/* Sidebar */}
            <Sidebar />
            {/* Content */}
            <div className="relative col-span-12 bg-white md:col-span-9">
                <ConsoleHeader />
                <div className="flex w-full flex-col gap-8 px-4 py-6 md:px-6">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">{page.title}</h1>
                        <p className="w-full text-[1rem] text-balance text-muted-foreground">{page.description}</p>
                    </div>
                    <div className="w-full flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
