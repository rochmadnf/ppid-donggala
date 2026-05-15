import { ImageCropperDialog } from '@/components/image-cropper';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

export default function DashboardPage() {
    const { page } = usePage<PageDataProps>().props;
    const [openCrop, setOpenCrop] = useState(false);

    return (
        <>
            <MetaTag withAppName title={page.title} description={page.description} robots="00" />

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
