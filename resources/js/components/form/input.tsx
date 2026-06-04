import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { InputErrorMessage } from '../input-error-message';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { FormInputProps } from './types';

export function FormInput({
    label,
    error,
    className,
    inputSize = 'default',
    wrapperClassName,
    ...props
}: Omit<ComponentProps<'input'>, 'form'> & FormInputProps) {
    return (
        <div className={cn(wrapperClassName)}>
            <Label htmlFor={props.name} className={cn(inputSize === 'lg' ? 'text-sm leading-4 md:text-[15px] lg:text-[17px]' : '', className)}>
                {label} {props.required ? <span className="align-middle text-destructive">*</span> : null}
            </Label>
            <Input
                id={props.name}
                className={cn(
                    inputSize === 'lg'
                        ? 'mt-2.5 h-10 border-line-brand/80 selection:bg-blue-600 focus-visible:border-blue-500/45 focus-visible:ring-[2.5px] focus-visible:ring-blue-500/75 focus-visible:ring-offset-2 md:h-12 md:text-lg lg:mt-3'
                        : 'mt-2 mb-0.5 h-9.5',
                    className,
                )}
                aria-invalid={!!error}
                {...props}
            />
            <InputErrorMessage message={error} />
        </div>
    );
}
