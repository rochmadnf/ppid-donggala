import { DotsCorner } from '@/components/dots-corner';
import { useState, type PropsWithChildren } from 'react';
import { BottomNav, Footer, Header } from './components/landing';

export function LandingLayout({ children }: PropsWithChildren) {
    const [openDrawer, setOpenDrawer] = useState(false);
    return (
        <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center border-line-brand md:border-x">
            <Header openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            <main className="relative min-h-dvh w-full pb-8">
                <DotsCorner />
                {children}
            </main>
            <Footer />
            <BottomNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        </div>
    );
}
