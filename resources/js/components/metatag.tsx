import { appAsset } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export interface MetaTagProps {
    title: string;
    description: string;
    type?: string;
    image?: string;
    withAppName?: boolean;
}

export function MetaTag({
    title,
    description,
    type = 'website',
    image = '/assets/img/welcome-card.webp',
    withAppName = false,
    children,
}: PropsWithChildren<MetaTagProps>) {
    return (
        <Head title={withAppName ? `PPID Kabupaten Donggala &#8211; ${title}` : title}>
            <meta name="description" content={description} itemProp="description" />

            {/* Open Graph */}
            <meta property="og:title" content={withAppName ? `PPID Kabupaten Donggala &#8211; ${title}` : title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={appAsset(image)} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={withAppName ? `PPID Kabupaten Donggala &#8211; ${title}` : title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={appAsset(image)} />

            {children}
        </Head>
    );
}
