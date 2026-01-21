import { LayoutPanelLeftIcon, SquareChartGanttIcon, type LucideIcon } from 'lucide-react';

export type MenuItemProps = {
    id: string;
    label: string;
    icon: LucideIcon;
    url: string;
    children: Pick<MenuItemProps, 'id' | 'label' | 'url'>[] | [];
};

export const menuItems: MenuItemProps[] = [
    {
        id: 'a0e34911-a5c1-4d73-a38e-257e7e05df97',
        label: 'Dashboard',
        icon: LayoutPanelLeftIcon,
        url: route('console.dashboard'),
        children: [],
    },
    {
        id: 'a0e34919-8d50-488b-90b6-20fcea5aa2ee',
        label: 'Informasi Publik',
        icon: SquareChartGanttIcon,
        url: '#',
        children: [
            { id: 'a0e34990-9bfe-4128-bed1-ef29068e2bab', label: 'Berkala', url: route('console.public-information.index', { category: 'berkala' }) },
            {
                id: 'a0e370ac-54a6-459f-be98-6d77208ac5b1',
                label: 'Serta Merta',
                url: route('console.public-information.index', { category: 'serta-merta' }),
            },
            {
                id: 'a0e349b7-39e7-49ce-87ff-ac72a9704d14',
                label: 'Setiap Saat',
                url: route('console.public-information.index', { category: 'setiap-saat' }),
            },
            {
                id: 'a0e371a0-e1fb-4f36-afda-1102447a8e50',
                label: 'Dikecualikan',
                url: route('console.public-information.index', { category: 'dikecualikan' }),
            },
        ],
    },
];
