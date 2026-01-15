import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import type { AuthLayoutProps } from './types';

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col items-center justify-center bg-muted p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-blue-300" />
                <Link href={route('welcome')} className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogo />
                </Link>
                <div className="relative z-20 mt-6 text-center">
                    <h2 className="text-3xl leading-tight font-bold text-slate-900">Pejabat Pengelola Informasi dan Dokumentasi</h2>
                    <p className="mt-2 text-xl font-semibold text-slate-900/90">Kabupaten Donggala</p>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-108">
                    <Link href={route('welcome')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogo className="w-30" />
                    </Link>
                    <div className="mt-4 mb-8 flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                        <h1 className="text-xl font-medium md:text-3xl">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground md:text-base">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
