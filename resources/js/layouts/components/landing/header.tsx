import type { DrawerProps } from '@/layouts/types';
import { Link } from '@inertiajs/react';
import { Logo } from './logo';

export function Header({ openDrawer, setOpenDrawer }: DrawerProps) {
    return (
        <header className="flex w-full flex-col">
            <Logo openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />

            {/* Navigation */}
            <nav className="hidden border-t border-slate-300/50 py-4 text-sm uppercase md:block">
                <ul className="flex items-center justify-center gap-x-2">
                    <li>
                        <Link className="rounded p-2 transition duration-200 hover:bg-blue-500 hover:text-white" href={route('welcome')}>
                            Beranda
                        </Link>
                    </li>
                    <li>
                        <Link className="rounded p-2 transition duration-200 hover:bg-blue-500 hover:text-white" href={route('welcome')}>
                            Tentang Kami
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
