import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { ConsoleHeader } from './components/console/header';
import type { ConsoleLayoutProps } from './types';

export default function ConsoleLayout({ children }: PropsWithChildren<ConsoleLayoutProps>) {
    return (
        <div className="mx-auto grid h-dvh w-full max-w-7xl grid-cols-12 border-0 border-slate-300/30 md:border-x">
            {/* Sidebar */}
            <div className="col-span-3 hidden border-r md:block">
                <Link href="/console" className="block p-4 text-lg font-semibold">
                    Dashboard
                </Link>
                <Link href="/console/public-information" className="block p-4 text-lg font-semibold">
                    Informasi Publik
                </Link>
            </div>
            {/* Content */}
            <div className="relative col-span-9">
                <ConsoleHeader />
                <div className="">{children}</div>
            </div>
        </div>
    );
}
