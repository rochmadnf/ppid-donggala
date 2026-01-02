import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export type LogoProps = {
    className?: string;
    src?: string;
};

export function Logo({ className, src = './assets/img/ppid.png' }: LogoProps) {
    return (
        // Logo
        <div className="flex items-center gap-x-4">
            <Link href={route('welcome')}>
                <img src={src} alt="PPID Logo" className={cn('h-10', className)} title="Pejabat Pengelola Informasi dan Dokumentasi" />
            </Link>
            <div aria-label="logo" className="border-l border-slate-300/50 pl-4">
                <h1 className="font-bold text-slate-950">Pejabat Pengelola Informasi dan Dokumentasi</h1>
                <p>Kabupaten Donggala</p>
            </div>
        </div>
    );
}
