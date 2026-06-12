import { DeleteButton } from '@/components/delete-button';
import { FormInput } from '@/components/form/input';
import { FormSelect } from '@/components/form/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { withMethod } from '@/lib/inertia';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import {
    DatabaseZapIcon,
    GitCommitVerticalIcon,
    LoaderCircleIcon,
    PencilLineIcon,
    PlusCircleIcon,
    PlusIcon,
    SquarePenIcon,
    XIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type SubmitEventHandler } from 'react';
import { toast } from 'react-hot-toast';
import type { curriculumVitaeProps } from '../types';
import { ShowCard } from './show-card';

type tabProps = { id: number; label: string; table: string[] };
const tabs: tabProps[] = [
    { id: 1, label: 'Pendidikan', table: ['Jenjang', 'Nama Sekolah/Universitas', 'Tahun'] },
    { id: 2, label: 'Jabatan', table: ['Jabatan', 'Instansi', 'Periode'] },
    { id: 3, label: 'Organisasi', table: ['Jabatan', 'Nama Organisasi', 'Periode'] },
];

export function CurriculumVitaeCard({ data, officerId }: { data: curriculumVitaeProps[]; officerId: string }) {
    const [activeTab, setActiveTab] = useState<tabProps>(tabs[0]);
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    const [selectedCv, setSelectedCv] = useState<curriculumVitaeProps | null>(null);

    const transformData = useMemo(() => {
        return data.filter((item) => item.category === activeTab.id).sort((a, b) => b.period.s - a.period.s);
    }, [data, activeTab.id]);

    const handleTabClick = (selectedTab: tabProps) => () => {
        setActiveTab(selectedTab);
    };

    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open);
        if (!open) setSelectedCv(null);
    };

    return (
        <ShowCard>
            <h2 className="mb-3 flex items-center px-1.5 text-lg font-semibold">
                <GitCommitVerticalIcon className="mr-2" />
                Riwayat
            </h2>
            <div className="mb-8 flex flex-row items-center justify-between">
                <div className="flex w-fit flex-row items-center gap-x-2 rounded-full border border-line-brand px-2.5 py-2">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.label + idx}
                            className={cn(
                                'cursor-pointer rounded-full px-2.5 py-1 text-sm hover:bg-blue-300/30 hover:text-blue-600',
                                'transition duration-300',
                                tab.id === activeTab.id ? 'bg-blue-300/30 text-blue-600' : '',
                            )}
                            onClick={handleTabClick(tab)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <Button variant="brand" className="cursor-pointer" onClick={() => setIsSheetOpen(true)}>
                    <PlusIcon />
                    Riwayat
                </Button>
            </div>

            <section role="contentinfo" className="rounded-md border border-line-brand">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-9 text-center">#</TableHead>
                            <TableHead>{activeTab.table[0]}</TableHead>
                            <TableHead>{activeTab.table[1]}</TableHead>
                            <TableHead className="text-center">{activeTab.table[2]}</TableHead>
                            <TableHead className="w-24 text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transformData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-4 text-center">
                                    <div className="flex w-full flex-col items-center justify-center gap-y-1.5">
                                        <div className="rounded-full bg-gray-100 p-4">
                                            <DatabaseZapIcon className="size-8 text-blue-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">Data belum tersedia.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transformData.map((item, index) => (
                                <TableRow className="text-[14.8px]" key={item.id + item.title}>
                                    <TableCell className="w-9 py-4 text-center">{index + 1}.</TableCell>
                                    <TableCell className="py-4">{item.title}</TableCell>
                                    <TableCell className="py-4">{item.institution}</TableCell>
                                    <TableCell className="py-4 text-center">{item.period.display}</TableCell>
                                    <TableCell className="py-4 text-center">
                                        <div
                                            className="flex w-full items-center justify-around gap-x-1.5"
                                            role="group"
                                            aria-label={`Aksi untuk ${item.title}`}
                                        >
                                            {/* Tombol Edit */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 cursor-pointer group-hover/tr:text-orange-400 hover:bg-yellow-300 hover:text-yellow-950"
                                                        aria-label={`Edit ${item.title}`}
                                                        onClick={() => {
                                                            setSelectedCv(item);
                                                            setIsSheetOpen(true);
                                                        }}
                                                    >
                                                        <PencilLineIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                    <p>Ubah Data</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            {/* Tombol Delete */}
                                            <DeleteButton
                                                url={`/console/profile/public-officers/d/cv/${item.id}`}
                                                title="Hapus Riwayat"
                                                variant="rect"
                                                popSide="bottom"
                                                pageName="Perangkat Daerah"
                                                className="group-hover/tr:bg-transparent group-hover/tr:text-red-500 [&_svg]:size-4"
                                                description="Anda yakin ingin menghapus riwayat ini? Tindakan ini tidak dapat dibatalkan."
                                                selectedData={item.title}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </section>
            <CvFormSheet
                open={isSheetOpen}
                onOpenChange={handleSheetOpenChange}
                tabIndex={activeTab.id}
                officerId={officerId}
                selectedData={selectedCv}
            />
        </ShowCard>
    );
}

interface CvFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tabIndex: number;
    officerId: string;
    selectedData: curriculumVitaeProps | null;
}

const DEFAULT_CV_FORM = { id: 0, title: '', institution: '', period: { s: 0, e: null, display: '' }, category: 1 };

function CvFormSheet({ open, onOpenChange, tabIndex, officerId, selectedData }: CvFormSheetProps) {
    const form = useForm<curriculumVitaeProps>(selectedData ? selectedData : DEFAULT_CV_FORM);

    // Sync form data setiap kali selectedData berubah
    useEffect(() => {
        if (open) {
            form.setData(selectedData ?? DEFAULT_CV_FORM);
        }
    }, [selectedData, open]);

    const [isClosing, setIsClosing] = useState<boolean>(false);

    const handleSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();

        if (selectedData) {
            form.transform(withMethod('PUT'));

            form.post(`/console/profile/public-officers/d/cv/${selectedData.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Riwayat berhasil diperbarui!');
                    afterSheetClose();
                },
                onError: () => {
                    toast.error('Terdapat data yang tidak valid.');
                },
            });
        } else {
            form.post(`/console/profile/public-officers/d/${officerId}/cv`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Riwayat berhasil ditambahkan!');
                    afterSheetClose();
                },
                onError: () => {
                    toast.error('Terdapat data yang tidak valid.');
                },
            });
        }
    };

    const afterSheetClose = () => {
        setIsClosing(true);
        onOpenChange(false);
        form.setData(DEFAULT_CV_FORM);
        form.clearErrors();
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                showCloseButton={false}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="flex flex-col gap-0 overflow-y-auto sm:max-w-md"
            >
                {!open && isClosing ? (
                    <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center bg-white">
                        <LoaderCircleIcon className="size-8 animate-spin" />
                        <p className="mt-3 text-sm text-gray-500">Menutup form...</p>
                    </div>
                ) : null}
                <SheetHeader className="border-b border-line-brand px-6 pt-6 pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        {selectedData ? (
                            <>
                                <SquarePenIcon className="size-4 text-primary" />
                                Ubah Riwayat
                            </>
                        ) : (
                            <>
                                <PlusCircleIcon className="size-4 text-primary" />
                                Tambah Riwayat
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription>{selectedData ? `Perbarui data.` : 'Isi form di bawah untuk menambahkan riwayat baru.'}</SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-y-5 px-6 py-5">
                    <form id="cv-form" onSubmit={handleSubmit} className="w-full space-y-4">
                        <FormInput
                            value={form.data.title}
                            error={form.errors.title}
                            label="Jenjang/Jabatan"
                            name="title"
                            placeholder="Cth: S1 / Kepala Dinas / Ketua"
                            onChange={(e) => form.setData('title', e.currentTarget.value)}
                        />
                        <FormInput
                            value={form.data.institution}
                            error={form.errors.institution}
                            label="Institusi/Instansi/Organisasi"
                            name="institution"
                            placeholder="Cth: Kominfo Donggala"
                            onChange={(e) => form.setData('institution', e.currentTarget.value)}
                        />
                        <FormInput
                            value={form.data.period.s || ''}
                            error={form.errors['period.s']}
                            label="Tahun Mulai"
                            name="period_start"
                            maxLength={4}
                            minLength={4}
                            placeholder="Cth: 1998"
                            onChange={(e) => form.setData('period.s', parseInt(e.currentTarget.value) || 0)}
                        />
                        <FormInput
                            value={form.data.period.e || ''}
                            error={form.errors['period.e']}
                            label="Tahun Selesai"
                            name="period_end"
                            maxLength={4}
                            minLength={4}
                            placeholder="Cth: 2023"
                            onChange={(e) => form.setData('period.e', parseInt(e.currentTarget.value) || 0)}
                        />

                        <FormSelect
                            wrapperClassName="w-full"
                            name="category"
                            label="Kategori"
                            options={tabs.map((tab) => ({ label: tab.label, id: tab.id.toString() }))}
                            value={form.data.category?.toString() || ''}
                            onChange={(v) => form.setData('category', v ? parseInt(v) : 0)}
                            required
                            error={form.errors.category}
                        />
                    </form>
                </div>

                <SheetFooter className="flex flex-row items-center gap-x-2 border-t border-line-brand px-6 py-4">
                    <Button
                        form="cv-form"
                        className="h-10 flex-1 cursor-pointer bg-blue-500 hover:bg-blue-700 in-disabled:text-red-500"
                        disabled={form.processing || !form.isDirty || !open}
                    >
                        {form.processing ? <LoaderCircleIcon className="animate-spin" /> : null}
                        {selectedData ? 'Simpan Perubahan' : 'Tambah'}
                    </Button>
                    <Button variant="destructive" className="size-10 cursor-pointer" onClick={afterSheetClose} disabled={form.processing}>
                        <XIcon />
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
