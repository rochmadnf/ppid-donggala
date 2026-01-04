import { Link } from '@inertiajs/react';

export function Footer() {
    return (
        <footer className="flex w-full flex-col items-start justify-between gap-x-0 gap-y-3 border-t border-slate-300/50 bg-white px-4 py-3 md:flex-row md:gap-x-4 md:gap-y-0 md:px-6 md:py-8">
            <div>
                <Link href={route('welcome')}>
                    <img src={'./assets/img/ppid.png'} alt="PPID Logo" className="h-8 md:h-10" title="Pejabat Pengelola Informasi dan Dokumentasi" />
                </Link>
            </div>
            <div className="flex flex-1 flex-col pl-0 md:pl-4">
                <div>
                    <h1 className="text-sm font-bold text-slate-950 md:text-base">Pejabat Pengelola Informasi dan Dokumentasi</h1>
                    <p className="text-xs md:text-sm">Kabupaten Donggala</p>
                </div>
                <small className="pt-1.5 text-xs md:text-sm md:leading-5">
                    Gedung Kantor Dinas Komunikasi dan Informatika Kabupaten Donggala <br />
                    Jl. Jati No. 14 Kel. Gunung Bale, Kec. Banawa, Kab. Donggala <br />
                    email:{' '}
                    <a href="mailto:ppid@donggala.go.id" className="transition-colors duration-300 hover:text-blue-500">
                        ppid@donggala.go.id
                    </a>
                </small>
            </div>
            <div aria-label="contact-us">
                <h4 className="text-sm font-bold md:text-base">Ikuti Kami di Media Sosial</h4>

                {/* Media Sosial */}
            </div>
        </footer>
    );
}
