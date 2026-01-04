import { useState, type PropsWithChildren } from 'react';
import { BottomNav, Footer, Header } from './components/landing';

export function LandingLayout({ children }: PropsWithChildren) {
    const [openDrawer, setOpenDrawer] = useState(false);
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center border-slate-300/50 md:border-x">
            <Header openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            <main className="w-full pb-8">{children}</main>
            <Footer />
            <BottomNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        </div>
    );
}
