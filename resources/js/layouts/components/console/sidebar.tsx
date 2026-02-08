import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PageDataProps, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDownIcon, Globe2Icon, LogOutIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { menuItems, type MenuItemProps } from './config/sidebar';

export function Sidebar() {
    return (
        <div className="relative col-span-3 hidden border-r border-line-brand bg-white md:block">
            <aside className="sticky top-0 z-10 flex h-dvh flex-col justify-between gap-y-4">
                <SidebarHeader />
                <SidebarMenu />
                <SidebarFooter />
            </aside>
        </div>
    );
}

export function SidebarHeader() {
    return (
        <div className="flex h-header-h shrink-0 items-center border-b border-line-brand px-4" aria-label="sidebar header" data-slot="sidebar-header">
            <AppLogo className="h-auto w-18" />
            <div className="ml-2 border-l border-line-brand pl-2">
                <h1 className="text-xs font-bold" aria-label="sidebar title" data-slot="sidebar-title">
                    Pejabat Pengelola Informasi dan Dokumentasi
                </h1>
            </div>
        </div>
    );
}

export function SidebarMenu() {
    const { page } = usePage<PageDataProps>().props;

    return (
        <ul
            className={cn(
                'relative mx-2 flex flex-1 flex-col gap-y-2.5 overflow-y-auto rounded-md px-2.5',
                'scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-sidebar-menu-bg',
            )}
        >
            {menuItems.map((menu) => {
                if (menu.children.length > 0) {
                    const { id, url, ...menuItemProps } = menu;
                    const menuIds = [...menu.children.map((child) => child.id), id];

                    return <CollapsibleMenuItem key={id} {...menuItemProps} menuIds={menuIds} isOpen={menuIds.includes(page.id)} pageId={page.id} />;
                } else {
                    const { id, children, ...menuItemProps } = menu;
                    return <SidebarMenuItem key={id} {...menuItemProps} isActive={page.id === id} />;
                }
            })}
        </ul>
    );
}

export function SidebarMenuItem({
    icon: Icon,
    label,
    url,
    isActive = false,
    className,
}: Pick<MenuItemProps, 'icon' | 'label' | 'url'> & { isActive?: boolean; className?: string }) {
    return (
        <li className="relative last:mt-auto" title={label}>
            <Link
                href={url}
                className={cn(
                    'inline-flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 tracking-wide transition duration-200 [&_svg]:pointer-events-none [&_svg]:size-4.5',
                    isActive
                        ? 'bg-sidebar-menu-bg text-sidebar-menu-text'
                        : 'bg-transparent text-sidebar-menu-inactive-text hover:bg-sidebar-menu-bg hover:text-sidebar-menu-text',
                    className,
                )}
            >
                <Icon />
                {label}
            </Link>
        </li>
    );
}

export function CollapsibleMenuItem({
    label,
    icon: CollapsibleIcon,
    children: collapsibleChildren,
    isOpen = false,
    pageId,
    menuIds,
}: { isOpen?: boolean; pageId: string; menuIds: string[] } & Pick<MenuItemProps, 'children' | 'icon' | 'label'>) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isOpen);
    useEffect(() => setIsCollapsed(isOpen), [isOpen]);
    return (
        <Collapsible asChild className="group/menu-trigger relative" title={label} open={isCollapsed} onOpenChange={(open) => setIsCollapsed(open)}>
            <li>
                <CollapsibleTrigger asChild>
                    <button
                        className={cn(
                            'inline-flex w-full cursor-pointer flex-row items-center gap-x-2 rounded-md px-2 py-1.5 tracking-wide transition duration-200 [&_svg]:pointer-events-none [&_svg]:size-4.5',
                            isCollapsed || menuIds.includes(pageId)
                                ? 'bg-sidebar-menu-bg text-sidebar-menu-text'
                                : 'bg-transparent text-sidebar-menu-inactive-text hover:bg-sidebar-menu-bg hover:text-sidebar-menu-text',
                        )}
                    >
                        <CollapsibleIcon />
                        <span className="flex-1 text-left">{label}</span>
                        <PlusIcon className="size-4! w-full transition-transform duration-200 group-hover/menu-trigger:rotate-15 group-data-[state=open]/menu-trigger:rotate-45" />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                    <ul
                        className={cn(
                            'ml-3.5 flex flex-col gap-y-2.5 border-l-[1.5px] p-2 pr-0',
                            isCollapsed ? 'border-blue-700/30' : 'border-line-brand',
                        )}
                    >
                        {collapsibleChildren.map((child) => (
                            <li className={cn('group/menu-tree relative')} title={child.label} key={child.id}>
                                <Link
                                    href={child.url}
                                    className={cn(
                                        'inline-flex w-full items-center rounded px-2 py-1.5 text-[15.35px] tracking-wide transition-colors duration-200',
                                        child.id === pageId
                                            ? 'bg-sidebar-menu-bg text-sidebar-menu-text'
                                            : 'bg-transparent text-sidebar-menu-inactive-text group-hover/menu-tree:bg-sidebar-menu-bg group-hover/menu-tree:text-sidebar-menu-text',
                                    )}
                                >
                                    {child.label}
                                </Link>
                                <span
                                    className={cn(
                                        'absolute top-1/2 -left-[9.5px] h-5 w-0.5 -translate-y-1/2 rounded transition-all duration-200',
                                        child.id === pageId
                                            ? 'bg-sidebar-menu-text opacity-100'
                                            : 'opacity-0 group-hover/menu-tree:bg-sidebar-menu-text group-hover/menu-tree:opacity-100',
                                    )}
                                ></span>
                            </li>
                        ))}
                    </ul>
                </CollapsibleContent>
            </li>
        </Collapsible>
    );
}

export function SidebarFooter() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex shrink-0 items-center justify-center border-t border-line-brand px-2 py-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="group/footer flex w-full cursor-pointer items-center justify-between gap-x-2.5 rounded-md border border-line-brand bg-white p-3 transition duration-150 hover:bg-slate-100">
                        <Avatar className="size-10 rounded-lg bg-blue-700 text-blue-50 shadow shadow-blue-500 transition duration-150 group-hover/footer:shadow-md">
                            <AvatarImage src={auth.user.avatar} alt="User Avatar" />
                            <AvatarFallback>RF</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left leading-tight">
                            <span className="truncate text-lg/tight font-medium">{auth.user.username}</span>
                            <span className="truncate text-xs">{auth.user.role}</span>
                        </div>
                        <ChevronsUpDownIcon className="size-4 text-slate-600 transition duration-150 group-hover/footer:text-slate-900" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-71.5">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-sidebar-menu-inactive-text select-none">Lainnya</DropdownMenuLabel>
                        <DropdownMenuItem asChild variant="primary">
                            <Link
                                href={route('welcome')}
                                className="w-full py-2 text-base font-medium tracking-wide"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Globe2Icon className="size-5 animate-spin [animation-duration:5s]" />
                                Lihat Situs
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild variant="destructive">
                            <Link href={route('logout')} className="w-full py-2 text-base font-medium tracking-wide" as="button" method="post">
                                <LogOutIcon className="size-5" />
                                Keluar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
