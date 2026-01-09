import { ButtonFlatIcon } from '@/components/btn-flat-icon';
import { MetaTag } from '@/components/metatag';
import { PublicInfoCard } from '@/components/public-info-card';
import { TitleDivider } from '@/components/title-divider';
import { Particles } from '@/components/ui/particles';
import { LandingLayout } from '@/layouts/landing-layouts';
import { Link } from '@inertiajs/react';
import { MoveRightIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { menus } from './lib';

export default function WelcomePage() {
    return (
        <>
            <MetaTag
                title="PPID Donggala &#8211; Menuju Masyarakat Informasi"
                description="Selamat datang di PPID Donggala, sumber informasi resmi Pemerintah Kabupaten Donggala."
            >
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content="ppid, ppid donggala, ppid kabupaten donggala, kabupaten donggala, pemda donggala" />

                <meta property="og:url" content={route('welcome')} />
                <meta property="og:canonical" content={route('welcome')} />
            </MetaTag>

            {/* HERO */}
            <div className="mt-0 grid grid-cols-12 place-content-center items-center gap-x-8 px-0 pt-5 md:mt-10 md:px-6">
                <div className="col-span-full px-4 md:col-span-6 md:px-0">
                    <h1 className="mt-8 text-6xl leading-10 font-bold tracking-tight text-slate-900 md:mt-0 md:leading-14">
                        Portal PPID <br /> <span className="text-4xl text-blue-700 sm:text-5xl">Kabupaten Donggala</span>
                    </h1>

                    <h5 className="mt-5.5 text-base text-gray-600 md:text-xl md:leading-8">
                        Setiap orang berhak memperoleh Informasi Publik sesuai dengan <span className="text-gray-800">UU No. 14 Tahun 2008</span>.
                        Website PPID Pemerintah Kabupaten Donggala menyediakan Informasi Publik Berkala, Setiap Saat, Serta-merta, dan Informasi
                        lainnya.
                    </h5>
                </div>

                {/* Image */}
                <div className="hidden overflow-hidden rounded-tl-4xl rounded-tr-xl rounded-b-xl rounded-br-[6rem] shadow-xl shadow-blue-700/25 md:col-span-6 xl:block">
                    <img src="./assets/img/dgl-wisata.png" alt="Donggala Kota Wisata" className="h-auto w-full" />
                </div>
            </div>

            {/* Information Categories */}
            <div className="relative z-1 mt-12 flex min-h-105 w-full flex-col items-center justify-start gap-x-0 gap-y-6 overflow-x-auto overflow-y-hidden rounded-b-4xl bg-white px-4 py-6 pt-24 shadow-bottom-md shadow-slate-950/15 md:mt-28 md:flex-row md:justify-center md:gap-x-8 md:gap-y-0 md:rounded-b-[2.5rem] md:px-6">
                <TitleDivider title="Informasi Publik" className="absolute top-4 left-4 md:left-6" />
                {menus.map((menu) => (
                    <PublicInfoCard key={menu.id} menu={menu} />
                ))}
                <Particles className="absolute inset-0 z-0" color="#172554" quantity={200} size={1} refresh />
            </div>

            {/* E-Form Hero */}
            <div className="-mt-20 grid min-h-50 grid-cols-12 bg-linear-to-tr from-blue-700 to-blue-400 px-6 pt-32 pb-32 text-white md:bg-linear-to-r md:pt-38 md:pb-28">
                <div className="col-span-full md:col-span-7">
                    <h6 className="flex w-fit items-center rounded-full border border-white px-4 py-1.5 text-xs tracking-wide">
                        <span className="mr-2 size-1.5 animate-pulse rounded-full bg-yellow-400"></span>E - FORM
                    </h6>

                    <h1 className="mt-6 text-4xl leading-12 font-bold md:mt-8 md:text-5xl md:leading-16">
                        Pengajuan Informasi Publik Kini Lebih Mudah
                    </h1>

                    <p className="mt-2 text-lg text-white/95">
                        Ajukan permohonan Informasi Publik, atau Keberatan Informasi Publik dengan mengisi formulir elektronik.
                    </p>

                    <div className="mt-8 flex flex-col gap-x-0 gap-y-6 md:flex-row md:items-center md:gap-x-4 md:gap-y-0">
                        <ButtonFlatIcon asChild>
                            <Link
                                href={route('welcome')}
                                className="group flex-col items-start bg-white text-slate-950 transition-colors duration-200 ease-out hover:bg-white/90 md:items-center"
                            >
                                <small className="self-start text-[13.5px]/[1.43] text-slate-700">Ajukan</small>
                                <span className="inline-flex items-center gap-x-1 font-bold tracking-wide whitespace-nowrap">
                                    Permohonan Informasi{' '}
                                    <MoveRightIcon className="pointer-events-none hidden size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 md:inline" />
                                </span>
                            </Link>
                        </ButtonFlatIcon>
                        <ButtonFlatIcon asChild>
                            <Link
                                href={route('welcome')}
                                className="group flex-col items-start border border-white text-white transition-colors duration-200 ease-out hover:bg-white hover:text-slate-950 md:items-center"
                            >
                                <small className="self-start text-[13.5px]/[1.43] text-white/90 group-hover:text-slate-700">Ajukan</small>
                                <span className="inline-flex items-center gap-x-1 font-bold tracking-wide whitespace-nowrap">
                                    Keberatan Informasi{' '}
                                    <MoveRightIcon className="pointer-events-none hidden size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 md:inline" />
                                </span>
                            </Link>
                        </ButtonFlatIcon>
                    </div>
                </div>

                <div className="hidden md:col-span-5 md:block">
                    <img src="./assets/icons/req-docs.webp" className="mx-auto w-[75%]" alt="Formulir Pengajuan Informasi" />
                </div>
            </div>

            {/* News Section */}
            <div className="z-2 -mt-20 min-h-30 rounded-t-4xl bg-white px-6 md:rounded-t-[2.5rem]"></div>
        </>
    );
}

WelcomePage.layout = (page: ReactNode) => <LandingLayout>{page}</LandingLayout>;
