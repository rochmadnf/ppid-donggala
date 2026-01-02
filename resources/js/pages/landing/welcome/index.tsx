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
            <div className="flex gap-x-8 pt-5">
                <div className="flex shrink-0 grow-0 basis-1/2 flex-col gap-y-6 self-center">
                    <h1 className="text-5xl leading-14 font-bold text-blue-700">
                        Portal PPID <br /> Kabupaten Donggala
                    </h1>

                    <h5 className="text-xl text-gray-600">
                        Setiap orang berhak memperoleh Informasi Publik sesuai dengan UU No. 14 Tahun 2008. Website PPID BPS menyediakan Informasi
                        Publik Berkala, Setiap Saat, Serta-merta, dan Informasi lainnya.
                    </h5>
                </div>

                {/* Image */}
                <div className="hidden shrink-0 grow-0 basis-1/2 overflow-hidden rounded-tl-4xl rounded-tr-xl rounded-b-xl rounded-br-[6rem] shadow-xl shadow-blue-700/25 xl:block">
                    <img src="./assets/img/dgl-wisata.png" alt="Donggala Kota Wisata" className="h-auto w-full" />
                </div>
            </div>

            {/* Information Categories */}
            <div className="relative mt-28 flex min-h-130 w-full flex-row items-center justify-start gap-x-8 overflow-x-auto overflow-y-hidden px-8 py-6">
                <TitleDivider title="Informasi Publik" className="absolute top-4 left-2" />
                {menus.map((menu) => (
                    <PublicInfoCard key={menu.id} menu={menu} />
                ))}
                <Particles className="absolute inset-0 z-0" color="#172554" quantity={200} size={1} refresh />
            </div>
        </>
    );
}

WelcomePage.layout = (page: ReactNode) => <LandingLayout>{page}</LandingLayout>;
