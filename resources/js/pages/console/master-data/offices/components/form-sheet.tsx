import { InputErrorMessage } from '@/components/input-error-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { withMethod } from '@/lib/inertia';
import type { PageDataProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircleIcon, PlusCircleIcon, SquarePenIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { OfficeDataProps, OfficeIndexProps } from '../types';

interface OfficeFormData {
    name: string;
    alias: string;
    address: string;
    phone: string;
    site_url: string;
    rank_id: string;
}

interface OfficeFormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedOffice: OfficeDataProps | null;
}

const EMPTY_FORM: OfficeFormData = {
    name: '',
    alias: '',
    address: '',
    phone: '',
    site_url: '',
    rank_id: '',
};

export function OfficeFormSheet({ open, onOpenChange, selectedOffice }: OfficeFormSheetProps) {
    const { ranks } = usePage<PageDataProps & OfficeIndexProps>().props;

    const [displayOffice, setDisplayOffice] = useState<OfficeDataProps | null>(null);
    const isEditMode = displayOffice !== null;

    const form = useForm<OfficeFormData>(EMPTY_FORM);

    const resetForm = () => {
        form.setDefaults(EMPTY_FORM);
        form.setData(EMPTY_FORM);
        form.resetAndClearErrors();
    };

    useEffect(() => {
        if (!open) {
            resetForm();
            return;
        }

        setDisplayOffice(selectedOffice);

        if (selectedOffice) {
            const editData = {
                name: selectedOffice.name.raw,
                alias: selectedOffice.name.alias,
                address: selectedOffice.address ?? '',
                phone: selectedOffice.phone ?? '',
                site_url: selectedOffice.site_url ?? '',
                rank_id: String(selectedOffice.rank.id),
            };

            form.setDefaults(editData);
            form.setData(editData);
            form.clearErrors();
        } else {
            resetForm();
        }
    }, [open, selectedOffice]);

    const handleSubmit = () => {
        if (isEditMode && displayOffice) {
            form.transform(withMethod('PUT'));
            form.post(`/console/master-data/offices/${displayOffice.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Perangkat daerah berhasil diperbarui.');
                    onOpenChange(false);
                },
            });
        } else {
            form.post(`/console/master-data/offices`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Perangkat daerah berhasil ditambahkan.');
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-md">
                <SheetHeader className="border-b border-line-brand px-6 pt-6 pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        {isEditMode ? (
                            <>
                                <SquarePenIcon className="size-4 text-primary" />
                                Ubah Perangkat Daerah
                            </>
                        ) : (
                            <>
                                <PlusCircleIcon className="size-4 text-primary" />
                                Tambah Perangkat Daerah
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditMode
                            ? `Perbarui data untuk "${displayOffice?.name.raw}".`
                            : 'Isi form di bawah untuk menambahkan perangkat daerah baru.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-y-5 px-6 py-5">
                    {/* Nama OPD */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name">
                            Nama OPD <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Dinas Komunikasi dan Informatika"
                            aria-invalid={!!form.errors.name}
                        />
                        <InputErrorMessage message={form.errors.name} />
                    </div>

                    {/* Alias */}
                    <div className="space-y-1.5">
                        <Label htmlFor="alias">
                            Singkatan <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="alias"
                            value={form.data.alias}
                            onChange={(e) => form.setData('alias', e.target.value)}
                            placeholder="Diskominfo"
                            aria-invalid={!!form.errors.alias}
                        />
                        <InputErrorMessage message={form.errors.alias} />
                    </div>

                    {/* Rank */}
                    <div className="space-y-1.5">
                        <Label htmlFor="rank_id">
                            Tingkat <span className="text-destructive">*</span>
                        </Label>
                        <Select value={form.data.rank_id} onValueChange={(val) => form.setData('rank_id', val)}>
                            <SelectTrigger className="w-full" id="rank_id" aria-invalid={!!form.errors.rank_id}>
                                <SelectValue placeholder="Pilih tingkat..." />
                            </SelectTrigger>
                            <SelectContent>
                                {ranks.map((rank) => (
                                    <SelectItem key={rank.id} value={rank.id.toString()}>
                                        {rank.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputErrorMessage message={form.errors.rank_id} />
                    </div>

                    {/* Alamat */}
                    <div className="space-y-1.5">
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                            id="address"
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            placeholder="Jl. Contoh No. 1, Kecamatan, Kota"
                            rows={3}
                            aria-invalid={!!form.errors.address}
                        />
                        <InputErrorMessage message={form.errors.address} />
                    </div>

                    {/* No. HP/Telepon */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone">No. HP / Telepon</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            placeholder="0811234567"
                            aria-invalid={!!form.errors.phone}
                        />
                        <InputErrorMessage message={form.errors.phone} />
                    </div>

                    {/* Situs Web */}
                    <div className="space-y-1.5">
                        <Label htmlFor="site_url">Situs Web</Label>
                        <Input
                            id="site_url"
                            type="url"
                            value={form.data.site_url}
                            onChange={(e) => form.setData('site_url', e.target.value)}
                            placeholder="https://diskominfo.donggalakab.go.id"
                            aria-invalid={!!form.errors.site_url}
                        />
                        <InputErrorMessage message={form.errors.site_url} />
                    </div>
                </div>

                <SheetFooter className="flex flex-row items-center gap-x-2 border-t border-line-brand px-6 py-4">
                    <Button
                        onClick={handleSubmit}
                        className="h-10 flex-1 cursor-pointer bg-blue-500 hover:bg-blue-700 in-disabled:text-red-500"
                        disabled={form.processing || !form.isDirty || !open}
                    >
                        {form.processing ? <LoaderCircleIcon className="animate-spin" /> : null}
                        {isEditMode ? 'Simpan Perubahan' : 'Tambah'}
                    </Button>
                    <Button variant="destructive" className="size-10 cursor-pointer" onClick={() => onOpenChange(false)} disabled={form.processing}>
                        <XIcon />
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
