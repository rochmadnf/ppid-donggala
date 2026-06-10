import type { DrawerProps } from '@/layouts/types';
import { getEndpoint } from '@/lib/endpoint';
import { appAsset, cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutPanelLeftIcon, LogInIcon } from 'lucide-react';
import { DrawerTrigger } from './components/drawer-trigger';

export type LogoProps = {
    className?: string;
    imgClassName?: string;
    src?: string;
};

export function Logo({ className, imgClassName, src = '/assets/img/ppid.png', openDrawer, setOpenDrawer }: LogoProps & DrawerProps) {
    const { auth } = usePage<SharedData>().props;
    const loggedIn = auth.user !== null;

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
                    href={getEndpoint(loggedIn ? 'dashboard' : 'login')}
                    className={cn(
                        'inline-flex size-8 cursor-pointer items-center justify-center rounded-xs border-2 border-white ring-1 transition duration-150 md:hidden [&_svg]:pointer-events-none [&_svg]:size-5',
                        loggedIn
                            ? 'bg-primary/65 text-white/85 ring-primary/60 hover:bg-primary/85'
                            : 'bg-blue-200 text-blue-700 ring-blue-500/60 hover:bg-blue-300',
                    )}
                >
                    {loggedIn ? (
                        <>
                            <LayoutPanelLeftIcon />
                        </>
                    ) : (
                        <>
                            <LogInIcon />
                        </>
                    )}
                </Link>
                <DrawerTrigger openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            </div>
        </div>
    );
}
