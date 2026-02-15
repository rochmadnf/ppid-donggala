import { appAsset } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export interface MetaTagProps {
    title: string;
    description: string;
    type?: string;
    image?: string;
    robots?: '00' | '01' | '10' | '11';
    withAppName?: boolean;
}

export function getRobots(v: string) {
    const values: { [key: string]: string } = {
        '11': 'index, follow',
        '10': 'index, nofollow',
        '01': 'noindex, follow',
        '00': 'noindex, nofollow',
    };
    return values[v];
}

export function MetaTag({
    title,
    description,
    type = 'website',
    image = '/assets/img/welcome-card.webp',
    withAppName = false,
    robots = '11',
    children,
}: PropsWithChildren<MetaTagProps>) {
    return (
        <Head title={withAppName ? `PPID Kabupaten Donggala &#8211; ${title}` : title}>
            <meta name="description" content={description} itemProp="description" />
            <meta name="robots" content={getRobots(robots)} />

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
