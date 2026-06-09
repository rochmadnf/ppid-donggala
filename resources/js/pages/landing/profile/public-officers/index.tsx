import { DotsCorner } from '@/components/dots-corner';
import { LandingBanner } from '@/components/landing-banner';
import { MetaTag } from '@/components/metatag';
import { LandingLayout } from '@/layouts/landing-layouts';
import type { PublicOfficerIndexProps } from '@/pages/console/profile/public-officers/types';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { DatabaseZapIcon } from 'lucide-react';
import { type ReactNode } from 'react';

export default function PublicOfficerPage() {
    const { page, resources } = usePage<PageDataProps & PublicOfficerIndexProps>().props;

    return (
        <>
            <MetaTag robots="11" withAppName {...page}>
                <meta name="og:url" content={'/profile/public-officers'} />
                <link rel="canonical" href={'/profile/public-officers'} />
            </MetaTag>

            <LandingBanner
                variant="ocean"
                title="Profil Pejabat Publik"
                description="Informasi pejabat publik Pemerintah Kabupaten Donggala yang dapat diakses masyarakat untuk mendukung keterbukaan dan transparansi penyelenggaraan pemerintahan."
            />

            <main className="relative w-full border-b border-line-brand px-10 pt-16 pb-8">
                <DotsCorner side="bottom" />
                {resources.data.length === 0 ? (
                    <div className="flex min-h-80 w-full flex-col items-center justify-center gap-y-2">
                        <div className="rounded-full bg-blue-50/80 p-8">
                            <DatabaseZapIcon className="size-18 text-blue-400 md:size-20" />
                        </div>
                        <p className="text-[15px] font-medium text-blue-400 sm:text-base">Belum ada data yang tersedia.</p>
                    </div>
                ) : (
                    <div className="sgrid">
                        {resources.data.map((staff) => (
                            <div className="scard" key={staff.id + staff.name}>
                                <div className="sphoto">
                                    <img src={staff.photo} alt={staff.name} />
                                    <div className="sdstrip">
                                        <span className="stag">{staff.office.alias}</span>
                                    </div>
                                </div>
                                <div className="sbody">
                                    <div className="srole truncate" title={staff.position.name}>
                                        {staff.position.name}
                                    </div>
                                    <div className="sname">{staff.name}</div>
                                    <span className="skt">{staff.office.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}

PublicOfficerPage.layout = (page: ReactNode) => <LandingLayout>{page}</LandingLayout>;
