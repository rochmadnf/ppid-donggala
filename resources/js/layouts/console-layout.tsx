import type { PropsWithChildren } from 'react';
import { ConsoleHeader } from './components/console/header';
import { Sidebar } from './components/console/sidebar';
import type { ConsoleLayoutProps } from './types';

export default function ConsoleLayout({ children }: PropsWithChildren<ConsoleLayoutProps>) {
    return (
        <div className="mx-auto grid h-dvh w-full max-w-7xl grid-cols-12 border-0 border-line-brand md:border-x">
            {/* Sidebar */}
            <Sidebar />
            {/* Content */}
            <div className="relative col-span-9 bg-white">
                <ConsoleHeader />
                <div className="">{children}</div>
            </div>
        </div>
    );
}
