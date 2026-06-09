import { InputErrorMessage } from '@/components/input-error-message';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { EnumOptionType } from '@/types';

export function FormSelect({
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
    error?: string | undefined;
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
