export interface MenuItemsProps {
    id: string;
    title: string;
    href: string;
    children: {
        wrapper: {
            width: number;
        };
        items: Omit<MenuItemsProps, 'children'>[];
    } | null;
}

export const ManuItems: MenuItemsProps[] = [
    {
        id: 'a1f3b461-f0f0-40b9-9515-0c1024fb73f4',
        title: 'Beranda',
        href: '/',
        children: null,
    },
    {
        id: 'a11f84e6-b499-40b0-a1cb-44d66ba1c327',
        title: 'Profil',
        href: '#',
        children: {
            wrapper: {
                width: 52,
            },
            items: [
                {
                    id: 'a11f855c-7ee6-4b28-9e15-c745222360c6',
                    href: '#',
                    title: 'Profil PPID',
                },
                {
                    id: 'a19cc394-4736-4cf7-a557-65080dd2d9a2',
                    href: '/profile/public-officers',
                    title: 'Profil Pejabat Publik',
                },
            ],
        },
    },
    {
        id: 'a1f3d831-ba5d-469d-b90c-f973dde58d22',
        title: 'Informasi Publik',
        href: '#',
        children: {
            wrapper: {
                width: 60,
            },
            items: [
                {
                    id: 'a1f3d920-d846-4b8c-a028-36df3baef2e7',
                    href: '#',
                    title: 'Informasi Berkala',
                },
                {
                    id: 'a1f3d937-6aa8-47e6-a3b4-d66fd93ee0f8',
                    href: '#',
                    title: 'Informasi Serta Merta',
                },
                {
                    id: 'a1f3d949-8728-482c-881f-b04974b791f4',
                    href: '#',
                    title: 'Informasi Setiap Saat',
                },
                {
                    id: 'a1f3d958-770f-46f5-a0d3-f82890046ffd',
                    href: '#',
                    title: 'Informasi Dikecualikan',
                },
            ],
        },
    },
    {
        id: 'a1f3c948-5ffe-4783-9e6a-b637b475a203',
        title: 'Layanan',
        href: '#',
        children: {
            wrapper: {
                width: 60,
            },
            items: [
                {
                    id: 'a1f3c98e-5049-46bf-a6a2-e935e60566ef',
                    title: 'Prosedur Permohonan',
                    href: '#',
                },
                {
                    id: 'a1f3d000-a5b0-4f9f-9f56-fd485400852c',
                    title: 'Tata Cara Keberatan',
                    href: '#',
                },
                {
                    id: 'a1f3d034-45b5-4128-9ebb-b8cdec7cb407',
                    title: 'Penyelesaian Sengketa',
                    href: '#',
                },
                {
                    id: 'a1f3d0dc-2851-49d6-b54e-e1cf0f037bcd',
                    title: 'Jalur dan Waktu Layanan',
                    href: '#',
                },
                {
                    id: 'a1f3d0eb-2296-4cf0-aa7b-4bb18cb8ff72',
                    title: 'SOP PPID',
                    href: '#',
                },
            ],
        },
    },
    {
        id: 'a1f3e085-510c-4978-8c7c-f4b15c1aa5fc',
        title: 'Permohonan',
        href: '#',
        children: {
            wrapper: {
                width: 52,
            },
            items: [
                {
                    id: 'a1f3e139-83b5-45e1-a3a7-91941a1dcaac',
                    title: 'Formulir Permohonan',
                    href: '#',
                },
                {
                    id: 'a1f3e12c-a5aa-4e0d-bd12-d1f490735868',
                    title: 'Formulir Keberatan',
                    href: '#',
                },
            ],
        },
    },
];
