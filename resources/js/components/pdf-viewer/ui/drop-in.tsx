import { cn } from '@/lib/utils';
import { PDFViewer, type ThemePreference } from '@embedpdf/react-pdf-viewer';

const bahasa = {
    code: 'id',
    name: 'Bahasa Indonesia',
    translations: {
        zoom: {
            in: 'Perbesar',
            out: 'Perkecil',
            fitWidth: 'Sesuaikan Lebar',
            fitPage: 'Sesuaikan Halaman',
            marquee: 'Perbesar area pilihan',
            menu: 'Menu Zoom',
            level: 'Tingkat Zoom ({level}%)',
            dragTip: 'Drag to select area to zoom',
        },
        document: {
            open: 'Buka Dokumen',
            export: 'Unduh',
            print: 'Cetak',
            fullscreen: 'Layar Penuh',
            menu: 'Menu Dokumen',
            close: 'Tutup',
            protect: 'Keamanan',
            loading: 'Memuat dokumen...',
        },
        capture: {
            screenshot: 'Tangkapan Layar',
        },
        panel: {
            search: 'Cari',
        },
        search: {
            placeholder: 'Cari dalam dokumen',
            caseSensitive: 'Peka huruf besar/kecil',
            wholeWord: 'Kata lengkap',
            resultsFound: '{count} hasil ditemukan',
            page: 'Halaman {page}',
        },
        documentError: {
            title: 'Galat saat memuat dokumen',
            unknown: 'Galat tidak diketahui',
            errorCode: 'Kode Galat: {code}',
            close: 'Tutup Dokumen',
        },
        pan: {
            toggle: 'Beralih ke mode geser',
        },
        pointer: {
            toggle: 'Beralih ke mode penunjuk',
        },
        menu: {
            viewControls: 'Kontrol Tampilan',
            zoomControls: 'Kontrol Zoom',
            moreOptions: 'Opsi Lainnya',
        },
        outline: {
            title: 'Outline',
            loading: 'Memuat daftar isi...',
            noOutline: 'Tidak ada daftar isi tersedia',
            noBookmarks: 'Dokumen ini tidak berisi bookmark',
        },
    },
};

interface DropInPDFViewerProps {
    className?: string;
    theme?: ThemePreference;
    url: string;
    disabledCategories?: string[];
}

export function DropInPDFViewer({ className, theme = 'light', url, disabledCategories }: DropInPDFViewerProps) {
    return (
        <PDFViewer
            className={cn('size-full', className)}
            config={{
                i18n: {
                    defaultLocale: 'id',
                    fallbackLocale: 'en',
                    locales: [bahasa],
                },
                src: url,
                theme: { preference: theme },
                disabledCategories: disabledCategories,
            }}
        />
    );
}
