import { ImageCropperDialog } from '@/components/image-cropper';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { columns } from './components/columns';
import { DataTable } from './components/datatable';
import type { OfficeDataProps, OfficeIndexProps } from './types';

export default function OfficeIndexPage() {
    const { page, resources } = usePage<PageDataProps & OfficeIndexProps>().props;
    const [openCrop, setOpenCrop] = useState(false);
    console.log(resources.data);

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={route('console.master-data.offices.index')} />
                <link rel="canonical" href={route('console.master-data.offices.index')} />
            </MetaTag>

            <DataTable<OfficeDataProps> data={resources.data} columns={columns} />

            <Button onClick={() => setOpenCrop(!openCrop)}>Button</Button>
            <ImageCropperDialog
                open={openCrop}
                onOpenChange={setOpenCrop}
                defaultPreset="avatar"
                onConfirm={(blob, preset) => {
                    const url = URL.createObjectURL(blob);
                    navigator.clipboard.writeText(url);
                    console.log('Cropped image URL:', url);
                }}
            />
        </>
    );
}

OfficeIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
