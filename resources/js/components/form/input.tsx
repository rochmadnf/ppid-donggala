import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { InputErrorMessage } from '../input-error-message';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { FormInputProps } from './types';

export function FormInput({ label, error, className, ...props }: Omit<ComponentProps<'input'>, 'form'> & FormInputProps) {
    return (
        <div>
            <Label htmlFor={props.name} className="text-sm leading-4 md:text-[15px] lg:text-[17px]">
                {label}
            </Label>
            <Input
                id={props.name}
                className={cn(
                    `mt-2.5 h-10 border-blue-500/30 shadow-xs md:h-12 md:text-lg lg:mt-3`,
                    'focus-visible:ring-[2.5px] focus-visible:ring-offset-2',
                    'selection:bg-blue-600 focus-visible:border-blue-500/45 focus-visible:ring-blue-500/75',
                    className,
                )}
                tabIndex={2}
                {...props}
            />
            <InputErrorMessage message={error} className={'mt-2'} />
        </div>
    );
}
