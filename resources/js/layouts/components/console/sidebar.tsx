import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDownIcon, LayoutPanelLeftIcon, LogOutIcon, RssIcon } from 'lucide-react';

export function Sidebar() {
    return (
        <div className="col-span-3 hidden flex-col justify-between border-r border-line-brand bg-white md:flex md:gap-y-4">
            <SidebarHeader />
            <SidebarMenu />
            <SidebarFooter />
        </div>
    );
}

export function SidebarHeader() {
    return (
        <div className="flex h-16 items-center border-b border-line-brand px-4">
            <AppLogo className="h-auto w-18" />
            <div className="ml-2 border-l border-line-brand pl-2">
                <h1 className="text-xs font-bold">Pejabat Pengelola Informasi dan Dokumentasi</h1>
            </div>
        </div>
    );
}

export function SidebarMenu() {
    return (
        <ul className="flex flex-1 flex-col gap-y-2.5 p-4">
            <li className="relative">
                <Link
                    href={route('console.dashboard')}
                    className="inline-flex w-full items-center gap-x-2 rounded-md bg-blue-100/50 px-2 py-1.5 tracking-wide text-blue-700 transition duration-200 [&_svg]:pointer-events-none [&_svg]:size-4"
                >
                    <LayoutPanelLeftIcon />
                    Dashboard
                </Link>
            </li>
            <li className="relative">
                <Link
                    href="/console/public-information"
                    className="inline-flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 tracking-wide text-slate-600 transition duration-200 hover:bg-blue-100/50 hover:text-blue-700 [&_svg]:pointer-events-none [&_svg]:size-4"
                >
                    <RssIcon />
                    Informasi Publik
                </Link>
            </li>
        </ul>
    );
}

export function SidebarFooter() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex items-center justify-center p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="group/footer flex w-full cursor-pointer items-center justify-between gap-x-2.5 rounded-md border border-line-brand bg-white p-3 transition duration-150 hover:bg-slate-100">
                        <Avatar className="size-10 rounded-lg bg-blue-700 text-blue-50 shadow shadow-blue-500 transition duration-150 group-hover/footer:shadow-md">
                            <AvatarImage src={auth.user.avatar} alt="User Avatar" />
                            <AvatarFallback>RF</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left leading-tight">
                            <span className="truncate font-medium">{auth.user.username}</span>
                            <span className="truncate text-xs">user_role</span>
                        </div>
                        <ChevronsUpDownIcon className="size-4 text-slate-600 transition duration-150 group-hover/footer:text-slate-900" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-71.5">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild variant="destructive">
                        <Link
                            href={route('logout')}
                            className="w-full cursor-pointer py-2 text-base font-medium tracking-wide"
                            as="button"
                            method="post"
                        >
                            <LogOutIcon className="size-5" />
                            Keluar
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
