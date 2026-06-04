import { DatePicker } from '@/components/datepicker/date-picker';
import { InputErrorMessage } from '@/components/input-error-message';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

export function FormDatePicker({
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
