import AppLogo from '@/components/app-logo';
import { GlowImage } from '@/components/glow-image';
import { appAsset } from '@/lib/utils';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import type { AuthLayoutProps } from './types';

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-0 sm:px-8 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden size-full lg:block">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: `radial-gradient(125% 125% at 50% 0%, #0d1a36 0%, transparent 60%),radial-gradient(125% 125% at 50% 100%, #010133 0%, transparent 60%), #000000`,
                    }}
                />
                <div className="relative flex size-full flex-col justify-center gap-y-12 px-24">
                    <div className="flex flex-row items-center justify-between gap-x-2.5 text-white">
                        <GlowImage
                            src={appAsset('/assets/img/logo.png')}
                            alt="Kab. Donggala"
                            className="row-span-2 flex w-44 items-center justify-center"
                            animate
                        />

                        <div className="">
                            <p className="mt-2 align-middle text-2xl font-bold tracking-wide uppercase">
                                Pejabat Pengelola Informasi dan Dokumentasi
                            </p>

                            <p className="text-[17px] font-medium italic">Kabupaten Donggala</p>
                        </div>
                    </div>

                    <p className="justify-center px-4 text-lg tracking-[0.01em] text-white/75">
                        Pusat layanan digital PPID Pemerintah Kabupaten Donggala untuk mengelola permohonan informasi, keberatan masyarakat, dan
                        publikasi informasi publik dalam satu platform yang efisien dan mudah digunakan.
                    </p>
                </div>
            </div>
            <div className="relative flex h-dvh items-center justify-center bg-white lg:p-8">
                <div
                    id="diagonal-cross-grid"
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 bg-white px-8 pt-4 pb-8 shadow-blue-300/30 sm:w-115 sm:rounded-4xl sm:border sm:border-line-brand sm:shadow-xl">
                    <AppLogo className="mt-0 w-24 self-center sm:mt-4" />

                    <div className="mb-4 flex flex-col gap-2 text-left sm:border-t sm:pt-4">
                        <h1 className="text-xl font-medium md:text-3xl">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground md:text-base">{description}</p>
                    </div>

                    {children}

                    <p className="text-center text-xs text-muted-foreground sm:text-sm">
                        &copy; 2026 PPID Pemerintah Kabupaten Donggala. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
}
