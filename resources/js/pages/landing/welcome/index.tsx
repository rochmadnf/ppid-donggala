import { PublicInfoCard } from '@/components/public-info-card';
import { TitleDivider } from '@/components/title-divider';
import { Particles } from '@/components/ui/particles';
import { LandingLayout } from '@/layouts/landing-layouts';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { menus } from './lib';

export default function WelcomePage() {
    return (
        <>
            <Head title="PPID Donggala &#8211; Menuju Masyarakat Informasi">
                <meta name="description" content="Selamat datang di PPID Donggala, sumber informasi resmi Pemerintah Kabupaten Donggala." />
            </Head>

            {/* HERO */}
            <div className="mt-0 grid grid-cols-12 place-content-center items-center gap-x-8 px-0 pt-5 md:mt-10 md:px-6">
                <div className="col-span-full px-4 md:col-span-6 md:px-0">
                    <h1 className="mt-8 text-6xl leading-10 font-bold tracking-tight text-slate-900 md:mt-0 md:leading-14">
                        Portal PPID <br /> <span className="text-4xl text-blue-700 sm:text-5xl">Kabupaten Donggala</span>
                    </h1>

                    <h5 className="mt-5.5 text-base leading-8 text-gray-600 md:text-xl">
                        Setiap orang berhak memperoleh Informasi Publik sesuai dengan UU No. 14 Tahun 2008. Website PPID BPS menyediakan Informasi
                        Publik Berkala, Setiap Saat, Serta-merta, dan Informasi lainnya.
                    </h5>
                </div>

                {/* Image */}
                <div className="hidden overflow-hidden rounded-tl-4xl rounded-tr-xl rounded-b-xl rounded-br-[6rem] shadow-xl shadow-blue-700/25 md:col-span-6 xl:block">
                    <img src="./assets/img/dgl-wisata.png" alt="Donggala Kota Wisata" className="h-auto w-full" />
                </div>
            </div>

            {/* Information Categories */}
            <div className="relative mt-12 flex min-h-100 w-full flex-col items-center justify-start gap-x-0 gap-y-6 overflow-x-auto overflow-y-hidden px-4 py-6 pt-24 md:mt-28 md:flex-row md:gap-x-8 md:gap-y-0 md:px-6">
                <TitleDivider title="Informasi Publik" className="absolute top-4 left-4 md:left-6" />
                {menus.map((menu) => (
                    <PublicInfoCard key={menu.id} menu={menu} />
                ))}
                <Particles className="absolute inset-0 z-0" color="#172554" quantity={200} size={1} refresh />
            </div>
        </>
    );
}

WelcomePage.layout = (page: ReactNode) => <LandingLayout>{page}</LandingLayout>;
