import { ComboBox, type Option } from '@/components/combobox';
import { InputErrorMessage } from '@/components/input-error-message';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface FormComboboxProps<T extends { id: string | number }> {
    name: string;
    label?: string;
    placeholder?: string;
    getLabel: (item: T) => string;
    onSearch: (query: string) => Promise<T[]>;
    onChange?: (value: T | null) => void;
    defaultValue?: T | null;
    error?: string;
    required?: boolean;
}

export function FormCombobox<T extends { id: string | number }>({
    name,
    label,
    placeholder = 'Cari...',
    required = false,
    getLabel,
    onSearch,
    onChange,
    error = '',
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
        <div className="w-full space-y-2">
            <Label htmlFor={name}>
                {label} {required && <span className="align-middle text-destructive">*</span>}
            </Label>
            <ComboBox
                name={name}
                options={options}
                value={value ? String(value.id) : undefined}
                placeholder={placeholder}
                loading={loading}
                debounceDelay={800}
                onSearch={handleSearch}
                onChange={handleChange}
            />
            <InputErrorMessage className="mt-2" message={error} />
        </div>
    );
}

export const ComboboxFetcher = <T,>(routeName: string, params?: Record<string, unknown>, minLength = 1) => {
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
