import type { DrawerProps } from '@/layouts/types';
import { Link, usePage } from '@inertiajs/react';
import { Logo } from './logo';

import { DotsCorner } from '@/components/dots-corner';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import type { PageDataProps } from '@/types';
import { ManuItems, type MenuItemsProps } from './constants/navigation-menu';

export function Header({ openDrawer, setOpenDrawer }: DrawerProps) {
    return (
        <header className="flex w-full flex-col">
            <Logo openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />

            <div className="relative hidden items-center justify-center border-y border-line-brand py-6 text-sm md:flex">
                <DotsCorner />
                <NavigationMenu viewport={false}>
                    <NavigationMenuList className="gap-4">
                        {ManuItems.map((menu) => (
                            <NavItem key={menu.id} uuid={menu.id} routeName={menu.href} label={menu.title} children={menu.children} />
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
}

const baseClassName = 'font-medium tracking-wide text-gray-600 uppercase hover:text-ppid-primary sm:text-sm md:text-[14.5px]';

function NavItem({
    uuid,
    routeName,
    label,
    children,
    wrapperClassName,
}: {
    uuid: string;
    routeName: string;
    label: string;
    children: Pick<MenuItemsProps, 'children'>['children'];
    wrapperClassName?: string;
}) {
    const { page } = usePage<PageDataProps>().props;
    return (
        <NavigationMenuItem className={wrapperClassName}>
            {children !== null && children.items.length > 0 ? (
                <>
                    <NavigationMenuTrigger
                        className={cn(baseClassName, 'data-[state=open]:text-ppid-primary data-[state=open]:focus:text-ppid-primary')}
                    >
                        {label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="space-y-2 py-2" style={{ width: `calc(var(--spacing) * ${children.wrapper.width})` }}>
                            {children.items.map((child) => (
                                <NavigationMenuLink
                                    key={child.id}
                                    className={cn(
                                        baseClassName,
                                        'group/nav-link relative inline-flex w-full items-center rounded px-4 py-2 font-normal hover:bg-ppid-primary/5 md:text-[13px]',
                                    )}
                                    asChild
                                >
                                    <Link href={child.href}>
                                        <div className="absolute left-0 h-full w-1 transform bg-ppid-primary opacity-0 transition duration-150 group-hover/nav-link:opacity-100"></div>
                                        {child.title}
                                    </Link>
                                </NavigationMenuLink>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </>
            ) : (
                <NavigationMenuLink className={cn(baseClassName, page.id === uuid ? 'text-ppid-primary' : 'text-gray-600')} asChild>
                    <Link href={routeName}>{label}</Link>
                </NavigationMenuLink>
            )}
        </NavigationMenuItem>
    );
}
