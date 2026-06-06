import { DotsCorner } from '@/components/dots-corner';
import { LandingBanner } from '@/components/landing-banner';
import { MetaTag } from '@/components/metatag';
import { LandingLayout } from '@/layouts/landing-layouts';
import { formatDate } from '@/lib/date';
import type { PublicOfficerIndexProps } from '@/pages/console/profile/public-officers/types';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

export default function PublicOfficerPage() {
    const { page, resources } = usePage<PageDataProps & PublicOfficerIndexProps>().props;

    return (
        <>
            <MetaTag robots="11" withAppName {...page}>
                <meta name="og:url" content={route('profile.public-officers.index')} />
                <link rel="canonical" href={route('profile.public-officers.index')} />
            </MetaTag>

            <LandingBanner
                variant="ocean"
                title="Profil Pejabat Publik"
                description="Informasi pejabat publik Pemerintah Kabupaten Donggala yang dapat diakses masyarakat untuk mendukung keterbukaan dan transparansi penyelenggaraan pemerintahan."
            />

            <main className="relative w-full border-b border-line-brand px-10 pt-16 pb-8">
                <DotsCorner side="bottom" />
                <div className="section-label">
                    <div className="dot"></div>
                    <span>Pimpinan Utama</span>
                </div>
                <div className="officer-leader-row">
                    {resources.data
                        .filter((officer) =>
                            ['Bupati', 'Wakil Bupati', 'Sekretaris Daerah'].some((position) => officer.position.name.includes(position)),
                        )
                        .map((officer) => (
                            <div key={officer.id} className="officer-leader-card">
                                <div className="officer-leader-card-top">
                                    <div className="officer-leader-photo-wrap">
                                        <img className="officer-leader-photo" src={officer.photo} alt={`Foto ${officer.name}`} />
                                    </div>
                                    <div className="officer-leader-info-top">
                                        <div className="officer-leader-position-top">{officer.position.name}</div>
                                        <div className="officer-leader-name-top">{officer.name}</div>
                                    </div>
                                </div>
                                <div className="officer-leader-body">
                                    <div className="officer-office">
                                        <div className="officer-office-icon">🏛️</div>
                                        <div>
                                            <div className="officer-office-label">Instansi</div>
                                            <div className="officer-office-name">{officer.office.name}</div>
                                        </div>
                                    </div>
                                    <div className="officer-leader-meta">
                                        <span className="officer-meta-pill">
                                            Periode {formatDate(officer.period_start, 'YYYY')} -{' '}
                                            {officer.period_end ? formatDate(officer.period_end, 'YYYY') : 'Sekarang'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="section-label">
                    <div className="dot"></div>
                    <span>Daftar Lengkap Pejabat Publik</span>
                </div>
                <div className="sgrid">
                    {resources.data
                        .filter(
                            (staff) => !['Bupati', 'Wakil Bupati', 'Sekretaris Daerah'].some((position) => staff.position.name.includes(position)),
                        )
                        .map((staff) => (
                            <div className="scard">
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
            </main>
        </>
    );
}

PublicOfficerPage.layout = (page: ReactNode) => <LandingLayout>{page}</LandingLayout>;
