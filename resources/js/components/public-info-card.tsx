import type { MenuProps } from '@/pages/landing/welcome/types';

export function PublicInfoCard({ menu }: { menu: MenuProps }) {
    return (
        <div className="z-10 min-h-65 min-w-65 shrink-0 rounded-md border border-slate-300/50 bg-white/60 p-4 shadow-lg xl:max-w-70">
            <div className="flex size-15 items-center justify-center rounded-full bg-blue-700/80">
                <menu.icon className="h-8 w-8 text-white" />
            </div>
            <div className="mt-6">
                <h5 className="text-xl font-semibold text-slate-900 transition-colors duration-150 hover:text-slate-600">
                    <a href={menu.url}>{menu.title}</a>
                </h5>
                <p className="mt-2 text-[15px]/[1.4] text-slate-700">{menu.description}</p>
            </div>
        </div>
    );
}
