import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function InputErrorMessage({ className, message, ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return (
        <p {...props} className={cn('mt-1 text-sm text-destructive first-letter:uppercase', className)}>
            {message}
        </p>
    );
}
