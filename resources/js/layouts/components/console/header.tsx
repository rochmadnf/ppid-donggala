import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { PageDataProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { menuItems } from './config/sidebar';

export function ConsoleHeader() {
    const { page } = usePage<PageDataProps>().props;
    const rootBc = menuItems.find((item) => item.id === page.breadcrumbs.group_id);

    return (
        <header className="sticky top-0 z-10 flex h-header-h w-full items-center border-b border-line-brand bg-white px-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        {rootBc && rootBc?.children.length <= 0 ? (
                            <BreadcrumbLink href={rootBc?.url ?? '#'} title={rootBc?.label}>
                                {rootBc ? <rootBc.icon className="size-4" /> : null}
                            </BreadcrumbLink>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <BreadcrumbLink href={rootBc?.url ?? '#'} title={rootBc?.label}>
                                        {rootBc ? <rootBc.icon className="size-4" /> : null}
                                    </BreadcrumbLink>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuGroup>
                                        {rootBc?.children.map((child) => (
                                            <DropdownMenuItem key={child.id} asChild disabled={page.id === child.id}>
                                                <Link href={child.url}>{child.label}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {page.breadcrumbs.items.map((bc, idx, arr) => {
                        const lastItem = idx === arr.length - 1;

                        return lastItem ? (
                            <BreadcrumbPage key={bc.id}>{bc.label}</BreadcrumbPage>
                        ) : (
                            <>
                                <BreadcrumbItem key={bc.id}>
                                    <BreadcrumbLink href={bc.url}>{bc.label}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
}
