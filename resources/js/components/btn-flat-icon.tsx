import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps, ReactNode } from 'react';

export function ButtonFlatIcon({ className, asChild = false, ...props }: { children: ReactNode; asChild?: boolean } & ComponentProps<'button'>) {
    const Comp = asChild ? Slot : 'button';
    return <Comp data-slot="button" className={cn(`inline-flex items-center rounded-xs px-4 py-2`, className)} {...props} />;
}
