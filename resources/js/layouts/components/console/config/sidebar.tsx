import { CirclePile, IdCardLanyardIcon, LayoutPanelLeftIcon, SquareChartGanttIcon, type LucideIcon } from 'lucide-react';

export type MenuItemProps = {
    id: string;
    label: string;
    icon: LucideIcon;
    url: string;
    permissions: string[];
    children: Omit<MenuItemProps, 'children' | 'icon'>[] | [];
};

export const menuItems: MenuItemProps[] = [
    {
        id: 'a0e34911-a5c1-4d73-a38e-257e7e05df97',
        label: 'Dashboard',
        icon: LayoutPanelLeftIcon,
        url: route('console.dashboard'),
        permissions: ['*'],
        children: [],
    },
    {
        id: 'a11f84e6-b499-40b0-a1cb-44d66ba1c327',
        label: 'Profil',
        icon: IdCardLanyardIcon,
        url: '#',
        permissions: ['read p-ppid'],
        children: [
            {
                id: 'a11f855c-7ee6-4b28-9e15-c745222360c6',
                label: 'PPID',
                url: route('console.profile.ppid.index'),
                permissions: ['read p-ppid'],
            },
        ],
    },
    {
        id: 'a0e34919-8d50-488b-90b6-20fcea5aa2ee',
        label: 'Informasi Publik',
        icon: SquareChartGanttIcon,
        url: '#',
        permissions: ['read periodic-pi', 'read immediate-pi', 'read anytime-pi', 'read excluded-pi'],
        children: [
            {
                id: 'a0e34990-9bfe-4128-bed1-ef29068e2bab',
                label: 'Berkala',
                url: route('console.public-information.index', { category: 'berkala' }),
                permissions: ['read periodic-pi'],
            },
            {
                id: 'a0e370ac-54a6-459f-be98-6d77208ac5b1',
                label: 'Serta Merta',
                url: route('console.public-information.index', { category: 'serta-merta' }),
                permissions: ['read immediate-pi'],
            },
            {
                id: 'a0e349b7-39e7-49ce-87ff-ac72a9704d14',
                label: 'Setiap Saat',
                url: route('console.public-information.index', { category: 'setiap-saat' }),
                permissions: ['read anytime-pi'],
            },
            {
                id: 'a0e371a0-e1fb-4f36-afda-1102447a8e50',
                label: 'Dikecualikan',
                url: route('console.public-information.index', { category: 'dikecualikan' }),
                permissions: ['read excluded-pi'],
            },
        ],
    },
    {
        id: 'a0e3be1f-c5e5-405a-ba53-a027a8f91f47',
        label: 'Data Master',
        icon: CirclePile,
        url: '#',
        permissions: ['read offices', 'read users', 'read role'],
        children: [
            {
                id: 'a0e3beae-66d8-4bf3-8863-174f5e278ed3',
                label: 'Perangkat Daerah',
                url: route('console.master-data.offices.index'),
                permissions: ['read offices'],
            },
            { id: 'a0e3d135-24de-4b7f-8ff6-85abd5739e3c', label: 'Pengguna', url: '#', permissions: ['read users'] },
            { id: 'a0e3d19f-84e8-4068-9a16-8e93dc9ef731', label: 'Peran & Hak Akses', url: '#', permissions: ['read role'] },
        ],
    },
];
