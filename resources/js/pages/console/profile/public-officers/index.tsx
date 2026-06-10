import { DataTable } from '@/components/datatable';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { columns } from './components/column';
import { PublicOfficerForm } from './components/form';
import type { PublicOfficerDataIndexProps, PublicOfficerIndexProps } from './types';

export default function PublicOfficerIndex() {
    const { page, resources } = usePage<PageDataProps & PublicOfficerIndexProps>().props;
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={'/console/profile/public-officers'} />
                <link rel="canonical" href={'/console/profile/public-officers'} />
            </MetaTag>

            <DataTable<PublicOfficerDataIndexProps>
                data={resources.data}
                metadata={resources.meta}
                columns={columns({ metadata: resources.meta })}
                routeName="/console/profile/public-officers"
                searchable
                toolbarRight={
                    <Button variant="brand" className="cursor-pointer" onClick={() => setOpenDialog(true)}>
                        <PlusIcon />
                    </Button>
                }
            />

            <PublicOfficerForm open={openDialog} onOpenChange={setOpenDialog} selectedRecord={null} />
        </>
    );
}

PublicOfficerIndex.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
