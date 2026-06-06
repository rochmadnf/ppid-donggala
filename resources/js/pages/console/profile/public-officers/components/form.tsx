import { ComboboxFetcher, FormCombobox } from '@/components/form/combobox';
import { FormDatePicker } from '@/components/form/date-picker';
import { FormInput } from '@/components/form/input';
import { FormSelect } from '@/components/form/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { witaToUtc } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { OfficeDataProps } from '@/pages/console/master-data/offices/types';
import type { PositionDataProps } from '@/pages/console/master-data/positions/types';
import type { PageDataProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircleIcon, XIcon } from 'lucide-react';
import { type SubmitEventHandler } from 'react';
import toast from 'react-hot-toast';
import type { PublicOfficerDataShowProps, PublicOfficerForm, PublicOfficerFormPageProps } from '../types';

const EMPTY_FORM: PublicOfficerDataShowProps = {
    id: '',
    name: '',
    position: {
        id: '',
        name: '',
    },
    office: {
        id: '',
        name: '',
        alias: '',
        rank: null,
    },
    is_active: true,
    photo: '',
    birth_place: '',
    birth_date: '',
    last_education: '',
    gender: '',
    marital_status: '',
    religion: '',
    period_start: '',
    cv: null,
    period_end: null,
};

function RowWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn(`flex flex-row items-center justify-between gap-x-2`, className)}>{children}</div>;
}

export function PublicOfficerForm({ open, onOpenChange, selectedRecord = null }: PublicOfficerForm) {
    const { options } = usePage<PageDataProps & PublicOfficerFormPageProps>().props;

    const form = useForm<PublicOfficerDataShowProps>(selectedRecord !== null ? selectedRecord : EMPTY_FORM);

    const handleSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        if (selectedRecord !== null) {
            form.transform((data) => ({
                ...data,
                period_end: data.is_active ? null : data.period_end,
            }));
            form.put(route('console.profile.public-officers.update', selectedRecord.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Data pejabat publik berhasil diperbarui.');
                    onOpenChange(false);
                    afterModalClosed(form.data);
                    if (form.data.is_active) form.setData('period_end', null);
                },
                onError: () => {
                    toast.error('Terdapat data yang tidak valid!');
                },
            });
        } else {
            form.post(route('console.profile.public-officers.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Pejabat publik berhasil ditambahkan.');
                    onOpenChange(false);
                    afterModalClosed();
                },
                onError: () => {
                    toast.error('Terdapat data yang tidak valid!');
                },
            });
        }
    };

    const afterModalClosed = (newData?: PublicOfficerDataShowProps) => {
        form.reset();
        form.setDefaults(newData || (selectedRecord !== null ? selectedRecord : EMPTY_FORM));
        form.setData(newData || (selectedRecord !== null ? selectedRecord : EMPTY_FORM));
        form.clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="md:max-w-200"
                onInteractOutside={(e) => e.preventDefault()}
                showCloseButton={false}
                onEscapeKeyDown={() => afterModalClosed()}
            >
                <DialogHeader>
                    <DialogTitle>{selectedRecord === null ? 'Tambah Pejabat Publik' : 'Ubah Data'}</DialogTitle>
                    <DialogDescription>
                        {selectedRecord === null
                            ? 'Silakan lengkapi data berikut untuk menambahkan pejabat publik baru.'
                            : 'Silakan perbarui data berikut untuk mengubah informasi pejabat publik.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <RowWrapper className="items-start">
                        <FormInput
                            error={form.errors.name}
                            wrapperClassName="w-full"
                            label="Nama Lengkap"
                            placeholder="Nama Lengkap..."
                            name="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            required
                            tabIndex={1}
                        />

                        <FormSelect
                            name="last_education"
                            label="Pendidikan Terakhir"
                            options={options.educations}
                            value={form.data.last_education?.toString()}
                            onChange={(v) => form.setData('last_education', v)}
                            error={form.errors.last_education}
                            required
                            wrapperClassName="w-full"
                            tabIndex={2}
                        />
                    </RowWrapper>

                    <RowWrapper className="items-start justify-start">
                        <FormInput
                            error={form.errors.birth_place}
                            label="Tempat Lahir"
                            placeholder="Tempat Lahir..."
                            name="birth_place"
                            wrapperClassName="w-full"
                            tabIndex={3}
                            value={form.data.birth_place}
                            onChange={(e) => form.setData('birth_place', e.target.value)}
                            required
                        />
                        <FormDatePicker
                            name="birth_date"
                            label="Tanggal Lahir"
                            value={form.data.birth_date}
                            wrapperClassName="w-full"
                            onChange={(v) => form.setData('birth_date', witaToUtc(v as string))}
                            error={form.errors.birth_date}
                            required
                            tabIndex={4}
                        />
                    </RowWrapper>

                    <RowWrapper>
                        <FormSelect
                            wrapperClassName="w-full"
                            name="gender"
                            required
                            options={[
                                { id: '1', label: 'Laki-Laki' },
                                { id: '0', label: 'Perempuan' },
                            ]}
                            error={form.errors.gender}
                            label="Jenis Kelamin"
                            value={form.data.gender?.toString() || ''}
                            onChange={(v) => form.setData('gender', v)}
                            tabIndex={5}
                        />
                        <FormSelect
                            wrapperClassName="w-full"
                            name="religion"
                            required
                            options={options.religions}
                            error={form.errors.religion}
                            label="Agama"
                            value={form.data.religion?.toString() || ''}
                            onChange={(v) => form.setData('religion', v)}
                            tabIndex={6}
                        />
                        <FormSelect
                            wrapperClassName="w-full"
                            name="marital_status"
                            required
                            options={options.maritalStatuses}
                            error={form.errors.marital_status}
                            label="Status Perkawinan"
                            value={form.data.marital_status?.toString() || ''}
                            onChange={(v) => form.setData('marital_status', v)}
                            tabIndex={7}
                        />
                    </RowWrapper>

                    <FormCombobox<OfficeDataProps>
                        name="office_id"
                        key={`office-${selectedRecord?.id ?? 'new'}`}
                        label="Pilih Kantor"
                        placeholder="Cari Kantor..."
                        required
                        getLabel={(u) => u.name.raw}
                        error={form.errors['office.id']}
                        onSearch={ComboboxFetcher<OfficeDataProps>('console.master-data.offices.index', { to: 'cb' })}
                        onChange={(opt) => {
                            form.setData({
                                ...form.data,
                                office: {
                                    id: opt?.id ?? '',
                                    name: opt?.name.raw ?? '',
                                    alias: opt?.name.alias ?? '',
                                    rank: opt?.rank?.id ?? null,
                                },
                                position: { id: '', name: '' }, // ← reset position sekaligus
                            });
                        }}
                        defaultValue={
                            form.data.office?.id
                                ? ({
                                      id: form.data.office.id,
                                      name: {
                                          raw: form.data.office.name,
                                          alias: form.data.office.alias,
                                      },
                                      rank: {
                                          id: form.data.office.rank,
                                      },
                                  } as OfficeDataProps)
                                : null
                        }
                    />

                    <FormCombobox<PositionDataProps>
                        name="position_id"
                        key={`position-${selectedRecord?.id ?? 'new'}-${form.data.office?.id}`}
                        label="Pilih Jabatan"
                        required
                        placeholder="Cari Jabatan..."
                        getLabel={(u) => u.name}
                        error={form.errors['position.id']}
                        onSearch={ComboboxFetcher<PositionDataProps>('console.master-data.positions.index', { for: form.data.office?.rank })}
                        onChange={(opt) =>
                            form.setData('position', {
                                id: opt?.id ?? '',
                                name: opt?.name ?? '',
                            })
                        }
                        defaultValue={
                            form.data.position?.id
                                ? ({
                                      id: form.data.position.id,
                                      name: form.data.position.name,
                                  } as PositionDataProps)
                                : null
                        }
                    />

                    <FormSelect
                        wrapperClassName="w-full"
                        name="is_active"
                        label="Status Keaktifan"
                        options={[
                            { id: '1', label: 'Aktif' },
                            { id: '0', label: 'Tidak Aktif' },
                        ]}
                        value={form.data.is_active ? '1' : '0'}
                        onChange={(v) => {
                            const isActive = v === '1';
                            form.setData('is_active', isActive);

                            setTimeout(() => {
                                document.getElementById(isActive ? 'period_start' : 'period_end')?.focus();
                            }, 50);
                        }}
                        required
                        error={form.errors.is_active}
                    />
                    <RowWrapper>
                        <FormDatePicker
                            wrapperClassName="w-full"
                            name="period_start"
                            label="Periode Awal"
                            value={form.data.period_start}
                            onChange={(v) => form.setData('period_start', witaToUtc(v as string))}
                            error={form.errors.period_start}
                            required
                        />

                        {form.data.is_active ? null : (
                            <FormDatePicker
                                wrapperClassName="w-full"
                                name="period_end"
                                label="Periode Akhir"
                                value={form.data.period_end ?? ''}
                                onChange={(v) => form.setData('period_end', witaToUtc(v as string))}
                                error={form.errors.period_end}
                                required
                            />
                        )}
                    </RowWrapper>

                    <div className="flex flex-row items-center gap-x-2">
                        <Button
                            type="submit"
                            className="h-10 flex-1 cursor-pointer bg-blue-500 hover:bg-blue-700 in-disabled:text-red-500"
                            disabled={form.processing || !form.isDirty || !open}
                        >
                            {form.processing ? <LoaderCircleIcon className="animate-spin" /> : null}
                            {selectedRecord !== null ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="size-10 cursor-pointer"
                            onClick={() => afterModalClosed()}
                            disabled={form.processing}
                        >
                            <XIcon />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
