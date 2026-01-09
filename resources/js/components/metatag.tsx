import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export interface MetaTagProps {
    title: string;
    description: string;
    type?: string;
}

export function MetaTag({ title, description, type = 'website', children }: PropsWithChildren<MetaTagProps>) {
    return (
        <Head title={title}>
            <meta name="description" content={description} />
            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {children}
        </Head>
    );
}
