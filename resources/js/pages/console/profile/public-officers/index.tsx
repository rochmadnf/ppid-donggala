import { DataTable } from '@/components/datatable';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { columns } from './components/column';
import type { PublicInformationDataIndexProps, PublicInformationIndexProps } from './types';

export default function PublicOfficerIndex() {
    const { page, resources } = usePage<PageDataProps & PublicInformationIndexProps>().props;
    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={route('console.profile.public-officers.index')} />
                <link rel="canonical" href={route('console.profile.public-officers.index')} />
            </MetaTag>

            <DataTable<PublicInformationDataIndexProps>
                data={resources.data}
                metadata={resources.meta}
                columns={columns({ metadata: resources.meta })}
                routeName="console.profile.public-officers.index"
                searchable
                toolbarRight={
                    <Button asChild variant="brand" className="cursor-pointer">
                        <Link href="#">
                            <PlusIcon />
                        </Link>
                    </Button>
                }
            />
        </>
    );
}

PublicOfficerIndex.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
