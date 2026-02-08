import { MetaTag } from '@/components/metatag';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function DashboardPage() {
    const { page } = usePage<PageDataProps>().props;

    return (
        <>
            <MetaTag withAppName title={page.title} description={page.description}>
                <meta name="robots" content="noindex,nofollow" />
            </MetaTag>

            <div className="relative">
                {Array.from({ length: 100 }, (_, i) => i + 1).map((item) => (
                    <p key={item} className="mb-4 h-12 w-full rounded bg-line-brand">
                        {item}
                    </p>
                ))}
            </div>
        </>
    );
}

DashboardPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
