import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import type { AuthLayoutProps } from './types';

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-107">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="#" className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-4 flex w-44 items-center justify-center rounded-md bg-slate-900 p-4 shadow shadow-blue-700">
                                <AppLogo className="w-44" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-medium">{title}</h1>
                            <p className="text-center text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
