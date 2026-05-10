import { DataTable } from '@/components/datatable';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { columns } from './components/columns';
import { OfficeFormSheet } from './components/form-sheet';
import type { OfficeDataProps, OfficeIndexProps } from './types';

export default function OfficeIndexPage() {
    const { page, resources } = usePage<PageDataProps & OfficeIndexProps>().props;

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    /**
     * null  → mode Add (sheet dibuka via tombol "Tambah")
     * value → mode Edit (sheet dibuka via tombol edit di baris)
     */
    const [selectedOffice, setSelectedOffice] = useState<OfficeDataProps | null>(null);

    const handleAdd = () => {
        setSelectedOffice(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (office: OfficeDataProps) => {
        setSelectedOffice(office);
        setIsSheetOpen(true);
    };

    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open);
        if (!open) setSelectedOffice(null);
    };

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={route('console.master-data.offices.index')} />
                <link rel="canonical" href={route('console.master-data.offices.index')} />
            </MetaTag>

            <DataTable<OfficeDataProps>
                data={resources.data}
                metadata={resources.meta}
                columns={columns({ metadata: resources.meta, onEdit: handleEdit })}
                routeName="console.master-data.offices.index"
                searchable
                toolbarRight={
                    <Button variant="brand" className="cursor-pointer" onClick={handleAdd}>
                        <PlusIcon />
                        OPD
                    </Button>
                }
            />

            <OfficeFormSheet open={isSheetOpen} onOpenChange={handleSheetOpenChange} selectedOffice={selectedOffice} />
        </>
    );
}

OfficeIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
