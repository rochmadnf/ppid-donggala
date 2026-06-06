import { MetaTag } from '@/components/metatag';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

export default function DashboardPage() {
    const { page } = usePage<PageDataProps>().props;

    return (
        <>
            <MetaTag withAppName title={page.title} description={page.description} robots="00" />

            <div className="relative">On progress...</div>
        </>
    );
}

DashboardPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
