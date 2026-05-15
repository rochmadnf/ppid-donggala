import { ImageCropperDialog } from '@/components/image-cropper/image-cropper-single-preset';
import { MetaTag } from '@/components/metatag';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConsoleLayout from '@/layouts/console-layout';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { PageDataProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { ImagesIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { PublicInformationShowProps } from './types';

export default function PublicOfficerShow() {
    const { page, resources } = usePage<PageDataProps & PublicInformationShowProps>().props;
    const [openCrop, setOpenCrop] = useState<boolean>(false);

    const photoForm = useForm<{ photo: File | null }>({
        photo: null,
    });

    const officer = resources.data;

    const submitNewPhoto = (file: File) => {
        photoForm.transform((data) => ({ photo: file }));

        photoForm.post(route('console.profile.public-officers.photo.update', { poid: officer.id }), {
            forceFormData: true,
            preserveScroll: true,
            onError: () => toast.error('Gagal mengunggah foto. Silakan coba lagi.'),
            onSuccess: () => {
                toast.success('Foto berhasil diperbarui!');
                photoForm.reset();
                setOpenCrop(false);
            },
        });
    };

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={route('console.profile.public-officers.show', { poid: resources.data.id })} />
                <link rel="canonical" href={route('console.profile.public-officers.index')} />
            </MetaTag>

            {/* <pre>{JSON.stringify(resources.data, null, 2)}</pre> */}

            <div className="flex flex-col gap-y-4">
                {/* Personal Info */}
                <ShowCard title={false}>
                    <div className="relative flex w-full items-center gap-x-8">
                        <div
                            className={cn(
                                'absolute -top-2 right-0 size-3 animate-ping rounded-full',
                                officer.is_active ? 'bg-green-500' : 'bg-red-500',
                            )}
                        ></div>
                        <div className={cn('absolute -top-2 right-0 size-3 rounded-full', officer.is_active ? 'bg-green-500' : 'bg-red-500')}></div>

                        <div className="group/pop relative h-fit w-full max-w-85 rounded-md shadow-md shadow-gray-500/20 transition duration-300">
                            <AspectRatio ratio={4 / 5} className="rounded-md">
                                <img src={officer.photo} alt={officer.name} className="rounded-md object-cover" />
                            </AspectRatio>
                            <div className="pointer-events-none absolute top-0 left-0 flex size-full items-center justify-center rounded-md bg-gray-600/20 opacity-0 transition duration-300 group-hover/pop:pointer-events-auto group-hover/pop:opacity-100">
                                <Button
                                    variant={'outline'}
                                    className="cursor-pointer"
                                    onClick={() => setOpenCrop(true)}
                                    aria-label={`Ubah foto ${officer.name}`}
                                >
                                    <ImagesIcon /> Ubah Foto
                                </Button>
                            </div>
                        </div>

                        <ImageCropperDialog
                            open={openCrop}
                            onOpenChange={setOpenCrop}
                            defaultPreset="public_officer_photo"
                            outputType="image/webp"
                            outputQuality={0.9}
                            presets={[
                                {
                                    key: 'public_officer_photo',
                                    label: 'Foto Pejabat Publik',
                                    aspectRatio: 4 / 5,
                                    shape: 'rect',
                                    outputWidth: 800,
                                    outputHeight: 1000,
                                },
                            ]}
                            onConfirm={(blob) => {
                                const file = new File([blob], `${officer.id}.webp`, {
                                    type: blob.type || 'image/webp',
                                });

                                submitNewPhoto(file);
                            }}
                        />

                        <div className="flex flex-1 flex-col gap-y-4 [--wth:--spacing(50)]">
                            {[
                                {
                                    th: 'Nama',
                                    td: officer.name,
                                },
                                {
                                    th: 'Pendidikan Terakhir',
                                    td: officer.last_education,
                                },
                                {
                                    th: 'Tempat, Tanggal Lahir',
                                    td: `${officer.birth_place}, ${formatDate(officer.birth_date, 'LL')}`,
                                },
                                {
                                    th: 'Jenis Kelamin',
                                    td: officer.gender,
                                },
                                {
                                    th: 'Agama',
                                    td: officer.religion,
                                },
                                {
                                    th: 'Status',
                                    td: officer.marital_status,
                                },
                                {
                                    th: 'Periode',
                                    td:
                                        formatDate(officer.period_start, 'L') +
                                        ' - ' +
                                        (officer.period_end === 'Sekarang' ? 'Sekarang' : formatDate(officer.period_end, 'L')),
                                },
                            ].map(({ th, td }, idx) => (
                                <div key={th + td + idx} className="flex flex-row justify-between border-b border-line-brand px-2 py-3">
                                    <h6 className="w-(--wth) font-semibold">{th}</h6>
                                    <p className="flex-1 font-medium tracking-wide">{td}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ShowCard>

                {/* <ShowCard title="Riwayat Pendidikan" />

                <ShowCard title="Riwayat Jabatan" />

                <ShowCard title="Riwayat Organisasi" /> */}
            </div>
        </>
    );
}

function ShowCard({ title, children }: { title: string | false; children: ReactNode }) {
    return (
        <Card>
            {title !== false ? (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            ) : null}

            <CardContent>{children}</CardContent>
        </Card>
    );
}
PublicOfficerShow.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
