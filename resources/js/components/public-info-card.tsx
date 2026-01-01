import { BookXIcon, CalendarMinus2Icon, NotebookPenIcon, NotebookTextIcon } from 'lucide-react';
import { type ComponentType, type SVGProps } from 'react';

const menus: { id: string; title: string; description: string; icon: ComponentType<SVGProps<SVGSVGElement>>; url: string }[] = [
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
        description: 'Informasi Publik yang wajib disediakan dan diumumkan secara serta merta tanpa penundaan.',
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

export function PublicInfoCard() {
    return (
        <div className="relative z-10 flex flex-row items-center gap-x-8 gap-y-4">
            {menus.map((menu) => (
                <div key={menu.title} className="min-h-60 w-65 rounded-md bg-white/60 p-4 shadow-md">
                    <div className="flex items-center gap-x-4"></div>
                    <div className="flex size-15 items-center justify-center rounded-full bg-blue-700/80">
                        <menu.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="mt-6">
                        <h5 className="text-xl font-semibold text-slate-900">
                            <a href={menu.url}>{menu.title}</a>
                        </h5>
                        <p className="mt-2 text-slate-700">{menu.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
