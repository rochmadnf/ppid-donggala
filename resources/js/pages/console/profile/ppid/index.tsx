import { MetaTag } from '@/components/metatag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import ConsoleLayout from '@/layouts/console-layout';
import type { PageDataProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

const tabs: { label: string; id: string }[] = [
    { label: 'Profil Singkat', id: 'profil-singkat' },
    { label: 'Visi & Misi', id: 'visi-misi' },
    { label: 'Tugas dan Fungsi', id: 'tugas-fungsi' },
    { label: 'Struktur Organisasi', id: 'struktur-organisasi' },
];

export default function PpidIndexPage() {
    const { page } = usePage<PageDataProps>().props;
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={route('console.profile.ppid.index')} />
                <link rel="canonical" href={route('console.profile.ppid.index')} />
            </MetaTag>

            <Tabs>
                <TabsList className="rounded-b-none border-b-0">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            className="border-b border-line-brand data-[active=true]:border-b-0 data-[active=true]:bg-white"
                            key={tab.id}
                            label={tab.label}
                            active={tab.id === activeTab}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </TabsList>
                <TabsContent className="rounded-t-none border-t-0 py-8">content</TabsContent>
            </Tabs>
        </>
    );
}

PpidIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
