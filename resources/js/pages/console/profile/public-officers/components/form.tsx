import { ComboBox, type Option } from '@/components/combobox';
import { DatePicker } from '@/components/datepicker/date-picker';
import { FormInput } from '@/components/form/input';
import { InputErrorMessage } from '@/components/input-error-message';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, witaToUtc } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { OfficeDataProps } from '@/pages/console/master-data/offices/types';
import type { PageDataProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircleIcon, XIcon } from 'lucide-react';
import { useEffect, useState, type SubmitEventHandler } from 'react';
import toast from 'react-hot-toast';
import type { EnumOptionType, PublicOfficerDataShowProps, PublicOfficerForm, PublicOfficerShowProps } from '../types';

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
    period_end: null,
};

function RowWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn(`flex flex-row items-center justify-between gap-x-2`, className)}>{children}</div>;
}

function FormSelect({
    name,
    label,
    options,
    value,
    onChange,
    wrapperClassName,
    error,
    required = false,
    tabIndex,
}: {
    name: string;
    label: string;
    options: EnumOptionType[];
    value: string;
    onChange: (value: string) => void;
    wrapperClassName?: string;
    error?: string;
    required?: boolean;
    tabIndex?: number;
}) {
    return (
        <div className={cn('space-y-2', wrapperClassName)}>
            <Label htmlFor={name}>
                {label} {required && <span className="align-middle text-destructive">*</span>}
            </Label>
            <Select required={required} value={value} onValueChange={onChange}>
                <SelectTrigger id={name} name={name} className="h-9.5 w-full" tabIndex={tabIndex}>
                    <SelectValue placeholder={`Pilih ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputErrorMessage className="mt-2" message={error} />
        </div>
    );
}

function FormDatePicker({
    name,
    label,
    value,
    onChange,
    wrapperClassName,
    defaultDateFormat = 'DD-MM-YYYY',
    error,
    required = false,
    tabIndex,
}: {
    name: string;
    label: string;
    value: string;
    onChange: (value: string | Date | undefined) => void;
    wrapperClassName?: string;
    defaultDateFormat?: string;
    error?: string;
    required?: boolean;
    tabIndex?: number;
}) {
    return (
        <div className={cn('space-y-2', wrapperClassName)}>
            <Label htmlFor={name}>
                {label} {required && <span className="align-middle text-destructive">*</span>}
            </Label>
            <DatePicker
                tabIndex={tabIndex}
                id={name}
                name={name}
                className="h-9.5"
                value={formatDate(value, defaultDateFormat)}
                calendarSide="right"
                onChange={onChange}
                maxDate={new Date()}
            />
            <InputErrorMessage className="mt-2" message={error} />
        </div>
    );
}

export interface FormComboboxProps<T extends { id: string | number }> {
    label?: string;
    placeholder?: string;
    getLabel: (item: T) => string;
    onSearch: (query: string) => Promise<T[]>;
    onChange?: (value: T | null) => void;
    defaultValue?: T | null;
}

export function FormCombobox<T extends { id: string | number }>({
    label,
    placeholder = 'Cari...',
    getLabel,
    onSearch,
    onChange,
    defaultValue = null,
}: FormComboboxProps<T>) {
    const [rawOptions, setRawOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<T | null>(defaultValue);

    useEffect(() => {
        setValue(defaultValue ?? null);
        if (defaultValue) {
            setRawOptions((prev) => {
                const exists = prev.some((o) => String(o.id) === String(defaultValue.id));
                return exists ? prev : [defaultValue, ...prev];
            });
        }
    }, [defaultValue?.id]);

    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            const results = await onSearch(query);
            setRawOptions(results);
        } finally {
            setLoading(false);
        }
    };

    const options: Option[] = rawOptions.map((item) => ({
        id: String(item.id),
        label: getLabel(item),
        meta: item as Record<string, unknown>,
    }));

    const handleChange = (opt: Option | Option[] | null) => {
        if (Array.isArray(opt) || opt === null) {
            setValue(null);
            onChange?.(null);
            return;
        }

        const original = rawOptions.find((item) => String(item.id) === String(opt.id)) ?? null;
        setValue(original);
        onChange?.(original);
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <ComboBox
                options={options}
                value={value ? String(value.id) : undefined}
                placeholder={placeholder}
                loading={loading}
                onSearch={handleSearch}
                onChange={handleChange}
            />
        </div>
    );
}

export const ComboboxFetcher = <T,>(routeName: string, params?: Record<string, unknown>, minLength = 2) => {
    return async (query: string): Promise<T[]> => {
        try {
            if (query.length < minLength) return [];

            const response = await axios.get(route(routeName), {
                params: { keyword: query, per_page: 15, ...params },
            });

            return response.data;
        } catch {
            return [];
        }
    };
};

export function PublicOfficerForm({ open, onOpenChange, selectedRecord = null }: PublicOfficerForm) {
    const { resources } = usePage<PageDataProps & PublicOfficerShowProps>().props;

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
                    if (form.data.is_active) form.setData('period_end', null);
                },
                onError: () => {
                    toast.error('Terdapat data yang tidak valid!');
                },
            });
        } else {
            // for create method
        }
    };

    const afterModalClosed = () => {
        form.reset();
        form.setDefaults(selectedRecord !== null ? selectedRecord : EMPTY_FORM);
        form.setData(selectedRecord !== null ? selectedRecord : EMPTY_FORM);
        form.clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="md:max-w-xl"
                onInteractOutside={(e) => e.preventDefault()}
                showCloseButton={false}
                onEscapeKeyDown={afterModalClosed}
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
                    <FormInput
                        error={form.errors.name}
                        label="Nama"
                        name="name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        tabIndex={1}
                    />

                    <FormSelect
                        name="last_education"
                        label="Pendidikan Terakhir"
                        options={resources.educations}
                        value={form.data.last_education?.toString()}
                        onChange={(v) => form.setData('last_education', v)}
                        error={form.errors.last_education}
                        required
                        tabIndex={2}
                    />

                    <RowWrapper className="items-start justify-start">
                        <FormInput
                            error={form.errors.birth_place}
                            label="Tempat Lahir"
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
                            options={resources.religions}
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
                            options={resources.maritalStatuses}
                            error={form.errors.marital_status}
                            label="Status Perkawinan"
                            value={form.data.marital_status?.toString() || ''}
                            onChange={(v) => form.setData('marital_status', v)}
                            tabIndex={7}
                        />
                    </RowWrapper>

                    <FormCombobox<OfficeDataProps>
                        key={selectedRecord?.id ?? 'new'}
                        label="Pilih Perangkat Daerah"
                        getLabel={(u) => u.name.raw}
                        onSearch={ComboboxFetcher<OfficeDataProps>('console.master-data.offices.index', { to: 'cb' })}
                        onChange={(opt) => form.setData('office', { id: opt?.id ?? '', name: opt?.name.raw ?? '', alias: opt?.name.alias ?? '' })}
                        defaultValue={
                            selectedRecord
                                ? ({
                                      id: selectedRecord.office.id,
                                      name: {
                                          raw: selectedRecord.office.name,
                                          alias: selectedRecord.office.alias,
                                      },
                                  } as OfficeDataProps)
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
                        tabIndex={8}
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
                            tabIndex={9}
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
                                tabIndex={10}
                            />
                        )}
                    </RowWrapper>

                    <div className="flex flex-row items-center gap-x-2">
                        <Button
                            type="submit"
                            className="h-10 flex-1 cursor-pointer bg-blue-500 hover:bg-blue-700 in-disabled:text-red-500"
                            disabled={form.processing || !form.isDirty || !open}
                            tabIndex={11}
                        >
                            {form.processing ? <LoaderCircleIcon className="animate-spin" /> : null}
                            {selectedRecord !== null ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="size-10 cursor-pointer"
                            onClick={afterModalClosed}
                            disabled={form.processing}
                            tabIndex={12}
                        >
                            <XIcon />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
