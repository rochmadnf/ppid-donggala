import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function Tabs({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('w-full', className)} {...props}>
            {children}
        </div>
    );
}

export function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex h-12 flex-row overflow-hidden rounded border border-line-brand bg-gray-100/65 whitespace-nowrap', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function TabsTrigger({ className, label, active = false, ...props }: HTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
    return (
        <button
            role="tab"
            type="button"
            data-active={active}
            className={cn(
                'w-full cursor-pointer border-r border-line-brand text-[15.5px] text-gray-600 last:border-r-0 hover:bg-blue-300/35 hover:text-sidebar-menu-text data-[active=true]:bg-blue-100/95 data-[active=true]:text-sidebar-menu-text sm:px-6',
                className,
            )}
            {...props}
        >
            <p className="font-medium tracking-tight text-pretty">{label}</p>
        </button>
    );
}

export function TabsContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('w-full rounded border border-line-brand bg-white p-4', className)} {...props}>
            {children}
        </div>
    );
}
