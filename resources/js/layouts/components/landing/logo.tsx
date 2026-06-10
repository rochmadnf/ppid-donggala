import type { DrawerProps } from '@/layouts/types';
import { getEndpoint } from '@/lib/endpoint';
import { appAsset, cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { LogInIcon, PlusIcon } from 'lucide-react';

export type LogoProps = {
    className?: string;
    imgClassName?: string;
    src?: string;
};

export function Logo({ className, imgClassName, src = '/assets/img/ppid.png', openDrawer, setOpenDrawer }: LogoProps & DrawerProps) {
    return (
        // Logo
        <div
            className={cn(
                'flex w-full items-center justify-between border-b border-b-line-brand px-4 py-3 shadow shadow-slate-500/20 md:justify-start md:gap-x-4 md:border-b-0 md:px-6 md:py-4 md:shadow-none',
                className,
            )}
        >
            <Link href={'/'}>
                <img
                    src={appAsset(src)}
                    alt="PPID Logo"
                    className={cn('h-8 md:h-10', imgClassName)}
                    title="Pejabat Pengelola Informasi dan Dokumentasi"
                />
            </Link>
            <div aria-label="logo" className="hidden border-l border-line-brand pl-4 md:block">
                <h1 className="font-bold text-slate-950">Pejabat Pengelola Informasi dan Dokumentasi</h1>
                <p>Kabupaten Donggala</p>
            </div>

            <div className="flex items-center gap-x-2">
                <Link
                    href={getEndpoint('login')}
                    onClick={() => setOpenDrawer(!openDrawer)}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-xs border-2 border-white bg-blue-200 text-blue-700 ring-1 ring-blue-500/60 transition duration-150 hover:bg-gray-300 md:hidden"
                >
                    <LogInIcon className={cn('pointer-events-none size-5 transform transition-transform duration-300')} />
                </Link>
                <button
                    onClick={() => setOpenDrawer(!openDrawer)}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-xs border-2 border-white bg-gray-200 text-slate-700 ring-1 ring-black/30 transition duration-150 hover:bg-gray-300 md:hidden"
                >
                    <PlusIcon
                        className={cn(
                            'pointer-events-none size-5 transform transition-transform duration-300',
                            openDrawer ? 'rotate-45' : 'rotate-0',
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
