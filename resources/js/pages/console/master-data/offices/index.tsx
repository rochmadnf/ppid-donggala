import { MetaTag } from '@/components/metatag';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function OfficeIndexPage() {
    const { page } = usePage<PageDataProps>().props;

    return (
        <>
            <MetaTag withAppName {...page}>
                <meta name="og:url" content={route('console.master-data.offices.index')} />
                <link rel="canonical" href={route('console.master-data.offices.index')} />
            </MetaTag>
        </>
    );
}

OfficeIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
