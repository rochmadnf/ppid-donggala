import { Link } from '@inertiajs/react';
import { Logo } from './logo';

export function Header() {
    return (
        <header className="flex w-full flex-col gap-y-4 py-8">
            <Logo />

            {/* Navigation */}
            <nav className="border-t border-slate-300/75 py-4 text-sm uppercase">
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
