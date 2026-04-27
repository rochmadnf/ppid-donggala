import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { PageDataProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircleIcon, PlusCircleIcon, SquarePenIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
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

    // Snapshot data edit — hanya diperbarui saat sheet terbuka
    const committedOfficeRef = useRef<OfficeDataProps | null>(null);
    if (open) {
        committedOfficeRef.current = selectedOffice;
    }

    const committed = committedOfficeRef.current;
    const isEditMode = committed !== null; // ← pakai committed, bukan selectedOffice langsung

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<OfficeFormData>(EMPTY_FORM);

    useEffect(() => {
        if (open) {
            if (isEditMode && committed) {
                setData({
                    name: committed.name.raw,
                    alias: committed.name.alias,
                    address: committed.address ?? '',
                    phone: committed.phone ?? '',
                    site_url: committed.site_url ?? '',
                    rank_id: String(committed.rank.id),
                });
            } else {
                reset();
                clearErrors();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, committed]);

    const handleSubmit = () => {
        if (isEditMode && committed) {
            put(route('console.master-data.offices.update', { office_id: committed.id }), {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
            });
        } else {
            post(route('console.master-data.offices.store'), {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 overflow-y-auto sm:max-w-lg">
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
                        {isEditMode ? `Perbarui data untuk "${committed?.name.raw}".` : 'Isi form di bawah untuk menambahkan perangkat daerah baru.'}
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
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Dinas Komunikasi dan Informatika"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    {/* Alias */}
                    <div className="space-y-1.5">
                        <Label htmlFor="alias">
                            Singkatan <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="alias"
                            value={data.alias}
                            onChange={(e) => setData('alias', e.target.value)}
                            placeholder="Diskominfo"
                            aria-invalid={!!errors.alias}
                        />
                        {errors.alias && <p className="text-xs text-destructive">{errors.alias}</p>}
                    </div>

                    {/* Rank */}
                    <div className="space-y-1.5">
                        <Label htmlFor="rank_id">
                            Tingkat <span className="text-destructive">*</span>
                        </Label>
                        <Select value={data.rank_id} onValueChange={(val) => setData('rank_id', val)}>
                            <SelectTrigger className="w-full" id="rank_id" aria-invalid={!!errors.rank_id}>
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
                        {errors.rank_id && <p className="text-xs text-destructive">{errors.rank_id}</p>}
                    </div>

                    {/* Alamat */}
                    <div className="space-y-1.5">
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Jl. Contoh No. 1, Kecamatan, Kota"
                            rows={3}
                            aria-invalid={!!errors.address}
                        />
                        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                    </div>

                    {/* No. HP/Telepon */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone">No. HP / Telepon</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="0811234567"
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>

                    {/* Situs Web */}
                    <div className="space-y-1.5">
                        <Label htmlFor="site_url">Situs Web</Label>
                        <Input
                            id="site_url"
                            type="url"
                            value={data.site_url}
                            onChange={(e) => setData('site_url', e.target.value)}
                            placeholder="https://diskominfo.donggalakab.go.id"
                            aria-invalid={!!errors.site_url}
                        />
                        {errors.site_url && <p className="text-xs text-destructive">{errors.site_url}</p>}
                    </div>
                </div>

                <SheetFooter className="grid grid-cols-3 place-content-between place-items-center gap-2 border-t border-line-brand px-6 py-4">
                    <Button onClick={handleSubmit} variant={'brand'} className="col-span-2 w-full cursor-pointer" disabled={processing}>
                        {processing ? <LoaderCircleIcon className="animate-spin" /> : null}
                        {isEditMode ? 'Simpan Perubahan' : 'Tambah'}
                    </Button>
                    <Button
                        variant="destructive"
                        className="col-span-1 w-full cursor-pointer"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
