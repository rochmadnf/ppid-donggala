import { DataTable } from '@/components/datatable';
import { MetaTag } from '@/components/metatag';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { columns } from './components/columns';
import type { OfficeDataProps, OfficeIndexProps } from './types';

export default function OfficeIndexPage() {
    const { page, resources } = usePage<PageDataProps & OfficeIndexProps>().props;

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={route('console.master-data.offices.index')} />
                <link rel="canonical" href={route('console.master-data.offices.index')} />
            </MetaTag>

            <DataTable<OfficeDataProps>
                data={resources.data}
                metadata={resources.meta}
                columns={columns(resources.meta)}
                routeName="console.master-data.offices.index"
            />
        </>
    );
}

OfficeIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
