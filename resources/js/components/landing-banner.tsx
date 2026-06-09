import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { PageDataProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SlashIcon } from 'lucide-react';
import { Fragment, type JSX } from 'react';
import { DotsCorner } from './dots-corner';

const variants = {
    ocean: {
        background: 'linear-gradient(to right, var(--color-blue-900), var(--color-indigo-800))',
        heading: 'text-white',
        description: 'text-blue-200',
        breadcrumb: {
            last: 'text-white',
            item: { default: 'text-blue-300', hover: 'hover:text-white' },
        },
    },
    forest: {
        background: 'linear-gradient(to right, var(--color-green-900), var(--color-teal-800))',
        heading: 'text-white',
        description: 'text-green-200',
        breadcrumb: {
            last: 'text-white',
            item: { default: 'text-green-300', hover: 'hover:text-white' },
        },
    },
    sunset: {
        background: 'linear-gradient(to right, var(--color-orange-800), var(--color-rose-800))',
        heading: 'text-white',
        description: 'text-orange-200',
        breadcrumb: {
            last: 'text-white',
            item: { default: 'text-orange-300', hover: 'hover:text-white' },
        },
    },
    dusk: {
        background: 'linear-gradient(to right, var(--color-purple-900), var(--color-indigo-900))',
        heading: 'text-white',
        description: 'text-purple-200',
        breadcrumb: {
            last: 'text-white',
            item: { default: 'text-purple-300', hover: 'hover:text-white' },
        },
    },
    slate: {
        background: 'linear-gradient(to right, var(--color-slate-800), var(--color-slate-900))',
        heading: 'text-white',
        description: 'text-slate-300',
        breadcrumb: {
            last: 'text-white',
            item: { default: 'text-slate-400', hover: 'hover:text-white' },
        },
    },
} as const;

const alignVariants = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
} as const;

export type BannerVariant = keyof typeof variants;
export type BannerAlign = keyof typeof alignVariants;

export function LandingBanner({
    title,
    description,
    className,
    variant = 'ocean',
    align = 'center',
}: {
    title: string;
    description: string;
    className?: string;
    variant?: BannerVariant;
    align?: BannerAlign;
}): JSX.Element {
    const { page } = usePage<PageDataProps>().props;
    const v = variants[variant];

    return (
        <section
            aria-label={title}
            className={cn(
                'relative flex h-90 w-full flex-col justify-center border-b border-line-brand px-4 sm:h-85 md:px-8',
                alignVariants[align],
                className,
            )}
            style={{ backgroundImage: v.background }}
        >
            <Breadcrumb>
                <BreadcrumbList className={cn('mb-6', v.breadcrumb.item.default)}>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={'/'} className={cn(v.breadcrumb.item.default, v.breadcrumb.item.hover)}>
                                Beranda
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <SlashIcon />
                    </BreadcrumbSeparator>
                    {page.breadcrumbs.items.map((bc, idx, arr) => {
                        const lastItem = idx === arr.length - 1;

                        return lastItem ? (
                            <BreadcrumbPage className={v.breadcrumb.last} key={`${bc.label}-${bc.id}`}>
                                {bc.label}
                            </BreadcrumbPage>
                        ) : (
                            <Fragment key={`${bc.label}-${bc.id}`}>
                                {bc.url === '#' ? (
                                    <BreadcrumbPage className={cn(v.breadcrumb.item.default)}>{bc.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild className={cn(v.breadcrumb.item.default, v.breadcrumb.item.hover)}>
                                            <Link href={bc.url}>{bc.label}</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                )}
                                <BreadcrumbSeparator>
                                    <SlashIcon />
                                </BreadcrumbSeparator>
                            </Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className={cn('mb-4 text-4xl font-bold lg:text-5xl', v.heading)}>{title}</h1>
            <p className={cn('max-w-3xl text-[15px] leading-relaxed md:text-lg', v.description)}>{description}</p>

            <DotsCorner side="bottom" />
        </section>
    );
}
