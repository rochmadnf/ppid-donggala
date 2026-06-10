import type { DrawerProps } from '@/layouts/types';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';

export function DrawerTrigger({ openDrawer, setOpenDrawer, className }: DrawerProps & { className?: string }) {
    return (
        <button
            onClick={() => setOpenDrawer(!openDrawer)}
            className={cn(
                'inline-flex size-8 cursor-pointer items-center justify-center rounded-xs border-2 border-white text-slate-700 ring-1 transition duration-150 md:hidden',
                openDrawer ? 'bg-blue-200 ring-line-brand hover:bg-blue-300' : 'bg-gray-200 ring-black/30 hover:bg-gray-300',
                className,
            )}
        >
            <PlusIcon
                className={cn(
                    'pointer-events-none size-5 transform transition-transform duration-300',
                    openDrawer ? 'rotate-45 text-ppid-primary' : 'rotate-0',
                )}
            />
        </button>
    );
}
