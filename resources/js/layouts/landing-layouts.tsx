import { type PropsWithChildren } from 'react';
import { Footer, Header } from './components/landing';

export function LandingLayout({ children }: PropsWithChildren) {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center">
            <Header />
            <main className="w-full pb-8">{children}</main>
            <Footer />
        </div>
    );
}
