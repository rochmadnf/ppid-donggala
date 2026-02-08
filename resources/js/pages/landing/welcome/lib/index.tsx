import { BookXIcon, CalendarMinus2Icon, NotebookPenIcon, NotebookTextIcon } from 'lucide-react';
import type { MenuProps } from '../types';

export const menus: MenuProps[] = [
    {
        id: 'informasi-berkala',
        title: 'Informasi Berkala',
        description: 'Informasi Publik yang wajib disediakan dan diumumkan secara berkala.',
        icon: CalendarMinus2Icon,
        url: '#',
    },
    {
        id: 'informasi-serta-merta',
        title: 'Informasi Serta Merta',
        description: 'Informasi Publik yang wajib disediakan dan diumumkan secara serta-merta tanpa penundaan.',
        icon: NotebookTextIcon,
        url: '#',
    },
    {
        id: 'informasi-setiap-saat',
        title: 'Informasi Setiap Saat',
        description: 'Informasi Publik yang dapat disediakan dan diumumkan setiap saat.',
        icon: NotebookPenIcon,
        url: '#',
    },
    {
        id: 'informasi-dikecualikan',
        title: 'Informasi Dikecualikan',
        description: 'Pengecualian informasi harus didasarkan pada pengujian konsekuensi yang ketat.',
        icon: BookXIcon,
        url: '#',
    },
];
