import { TextEditor } from '@/components/form/text-editor';
import { MetaTag } from '@/components/metatag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import ConsoleLayout from '@/layouts/console-layout';
import { spoofMethod } from '@/lib/inertia';
import type { PageDataProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import type { HTMLContent, JSONContent } from '@tiptap/core';
import { useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { PpidIndexProps } from './types';

const tabs: { label: string; id: string }[] = [
    { label: 'Profil Singkat', id: 'profil-singkat' },
    { label: 'Visi & Misi', id: 'visi-misi' },
    { label: 'Tugas dan Fungsi', id: 'tugas-fungsi' },
    { label: 'Struktur Organisasi', id: 'struktur-organisasi' },
];

const encodeHtml = (html: string): string => {
    const bytes = new TextEncoder().encode(html);
    const binary = Array.from(bytes, (b) => String.fromCodePoint(b)).join('');
    return btoa(binary);
};

export default function PpidIndexPage() {
    const { page, resources } = usePage<PageDataProps & PpidIndexProps>().props;
    const [activeTab, setActiveTab] = useState(resources.data[0].slug);

    const updateContent = (content: JSONContent, htmlContent: HTMLContent, slug: string) => {
        router.post(
            `/console/profile/ppid/${slug}/content-update`,
            spoofMethod(
                {
                    values: content,
                    html: encodeHtml(htmlContent),
                    slug,
                },
                'PATCH',
            ),
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    toast.error('Gagal memperbarui konten');
                },
                onSuccess: () => {
                    toast.success('Konten berhasil diperbarui');
                },
            },
        );
    };

    return (
        <>
            <MetaTag robots="00" withAppName {...page}>
                <meta name="og:url" content={`/console/profile/ppid`} />
                <link rel="canonical" href={`/console/profile/ppid`} />
            </MetaTag>

            <Tabs>
                <TabsList className="rounded-b-none border-b-0">
                    {resources.data.map((tab) => (
                        <TabsTrigger
                            className="border-b border-line-brand data-[active=true]:border-b-0 data-[active=true]:bg-white"
                            key={tab.slug}
                            label={tab.name}
                            active={tab.slug === activeTab}
                            onClick={() => setActiveTab(tab.slug)}
                        />
                    ))}
                </TabsList>
                <TabsContent className="rounded-t-none border-t-0 px-0 py-8">
                    <TextEditor
                        key={activeTab}
                        content={resources.data.find((tab) => tab.slug === activeTab)?.values}
                        onSave={(json, html) => updateContent(json, html, activeTab)}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
}

PpidIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
