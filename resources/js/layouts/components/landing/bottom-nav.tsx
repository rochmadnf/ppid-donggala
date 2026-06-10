import { DotsCorner } from '@/components/dots-corner';
import { GlowImage } from '@/components/glow-image';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { DrawerProps } from '@/layouts/types';
import { getEndpoint } from '@/lib/endpoint';
import { appAsset, cn } from '@/lib/utils';
import type { PageDataProps, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutPanelLeftIcon, LogInIcon, PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DrawerTrigger } from './components/drawer-trigger';
import { MenuItems, type MenuItemsProps } from './constants/navigation-menu';

export function BottomNav({ openDrawer, setOpenDrawer }: DrawerProps) {
    const { auth } = usePage<SharedData>().props;
    return (
        <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
            <SheetContent showCloseButton={false} className="w-full">
                <SheetHeader className="sr-only hidden">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>&nbsp;</SheetDescription>
                </SheetHeader>

                <header className="relative flex h-[87.8px] items-center gap-x-4 border-b border-line-brand p-4 pt-3">
                    <GlowImage dropShadowSize={7} src={appAsset('/assets/img/logo.png')} alt="Kab. Donggala" className="w-18 self-start" />

                    <div className="w-full">
                        <p className="mt-0.5 align-middle text-[13px] font-bold tracking-wide uppercase mobile-xs:mt-0 mobile-xs:text-sm">
                            Pejabat Pengelola Informasi <br className="mobile-xs:hidden" /> dan Dokumentasi
                        </p>

                        <p className="mt-0.5 text-xs font-medium italic">Kabupaten Donggala</p>
                    </div>
                    <DrawerTrigger openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} className="absolute right-6 -bottom-4 mobile-xs:right-4" />

                    <DotsCorner side="bottom" />
                </header>

                <BottomNavMenu setOpenDrawer={setOpenDrawer} />

                <footer className="relative border-t border-line-brand p-4">
                    <DotsCorner />
                    <Button asChild size="lg" variant={auth.user === null ? 'brand' : 'default'} className="w-full rounded">
                        <Link href={auth.user === null ? getEndpoint('login') : getEndpoint('dashboard')}>
                            {auth.user === null ? (
                                <>
                                    <LogInIcon />
                                    Login Admin
                                </>
                            ) : (
                                <>
                                    <LayoutPanelLeftIcon />
                                    Dashboard
                                </>
                            )}
                        </Link>
                    </Button>
                </footer>
            </SheetContent>
        </Sheet>
    );
}

function BottomNavMenu({ setOpenDrawer }: { setOpenDrawer: (open: boolean) => void }) {
    const { page } = usePage<PageDataProps>().props;
    const activeParentId = useMemo(() => {
        return MenuItems.find((menu) => menu.children?.items.some((child) => child.id === page.id))?.id ?? null;
    }, [page.id]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(activeParentId);

    const handleClose = () => setOpenDrawer(false);

    return (
        <ul className="mt-6 flex h-full flex-1 flex-col items-start justify-start gap-y-4 overflow-y-auto px-2 uppercase mobile-xs:px-4">
            {MenuItems.map((menu) => {
                if (menu !== null && menu.children?.items.length > 0) {
                    const menuIds = [...menu.children?.items.map((child) => child.id), menu.id];

                    return (
                        <BottomCollapsibleNavMenuItem
                            key={menu.id}
                            menu={menu}
                            menuIds={menuIds}
                            isOpen={openMenuId === menu.id}
                            pageId={page.id}
                            onOpenChange={(open) => setOpenMenuId(open ? menu.id : null)}
                            onClose={handleClose}
                        />
                    );
                } else {
                    return <BottomNavMenuItem key={menu.id + menu.title} menu={menu} isActive={page.id === menu.id} onClose={handleClose} />;
                }
            })}
        </ul>
    );
}

function BottomNavMenuItem({ menu, isActive, onClose }: { menu: MenuItemsProps; isActive: boolean; onClose: () => void }) {
    return (
        <li
            className={cn(
                'group relative w-full cursor-pointer rounded-md border border-ppid-primary p-4 font-medium transition-all duration-200 select-none',
                isActive ? 'bg-blue-500 text-white' : 'text-ppid-primary hover:bg-blue-500 hover:text-white',
            )}
            title={menu.title}
        >
            <Link href={menu.href} className="inline-flex w-full items-center justify-between" onClick={onClose}>
                {menu.title}
            </Link>
        </li>
    );
}

function BottomCollapsibleNavMenuItem({
    pageId,
    menu,
    menuIds,
    isOpen,
    onOpenChange,
    onClose,
}: {
    pageId: string;
    menu: MenuItemsProps;
    menuIds: string[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
}) {
    return (
        <Collapsible asChild className="group/menu-trigger relative w-full" title={menu.title} open={isOpen} onOpenChange={onOpenChange}>
            <li>
                <CollapsibleTrigger asChild>
                    <button
                        className={cn(
                            'inline-flex w-full cursor-pointer items-center rounded-md border border-ppid-primary p-4 font-medium uppercase transition-all duration-200 select-none data-[state=open]:rounded-b-none data-[state=open]:border-b-0 [&_svg]:pointer-events-none [&_svg]:size-4.5',
                            isOpen || menuIds.includes(pageId)
                                ? 'border-b-0 bg-blue-500 text-white'
                                : 'border-b text-ppid-primary hover:bg-blue-500 hover:text-white',
                        )}
                    >
                        <span className="flex-1 text-left">{menu.title}</span>
                        <PlusIcon className="size-5! w-full transition-transform duration-200 group-hover/menu-trigger:rotate-15 group-data-[state=open]/menu-trigger:rotate-45" />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                    <ul
                        className={cn(
                            'flex flex-col gap-y-2.5 border py-4',
                            isOpen ? 'rounded-b-md border-t-0 border-ppid-primary' : 'rounded-b-none border-t border-line-brand',
                        )}
                    >
                        {menu.children?.items.map((child) => (
                            <li className={cn('group/menu-tree relative')} title={child.title} key={child.id}>
                                <Link
                                    href={child.href}
                                    className={cn(
                                        'inline-flex w-full items-center rounded py-1.5 pr-2 pl-4 text-[15.35px] tracking-wide transition-colors duration-200',
                                        child.id === pageId
                                            ? 'bg-sidebar-menu-bg text-sidebar-menu-text'
                                            : 'bg-transparent text-sidebar-menu-inactive-text group-hover/menu-tree:bg-sidebar-menu-bg group-hover/menu-tree:text-sidebar-menu-text',
                                    )}
                                    onClick={onClose}
                                >
                                    {child.title}
                                </Link>
                                <span
                                    className={cn(
                                        'absolute left-0 h-full w-1 rounded-r transition-all duration-200',
                                        child.id === pageId
                                            ? 'bg-ppid-primary opacity-100'
                                            : 'opacity-0 group-hover/menu-tree:bg-sidebar-menu-text group-hover/menu-tree:opacity-100',
                                    )}
                                ></span>
                                <span
                                    className={cn(
                                        'absolute right-0 h-full w-1 rounded-l transition-all duration-200',
                                        child.id === pageId
                                            ? 'bg-ppid-primary opacity-100'
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
