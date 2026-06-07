// =============================================================================
// PdfSidebar — Thumbnail sidebar
// Desktop: collapsible left panel
// Mobile: Radix Dialog / Sheet (vaul)
// =============================================================================

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeftOpen, X } from 'lucide-react';
import { memo } from 'react';
import { Drawer } from 'vaul';
import { usePdfViewerStore } from './context/PdfViewerContext';

// ---------------------------------------------------------------------------
// Thumbnail count placeholder — EmbedPDF renders its own sidebar via the
// panel-sidebar category. We render a custom sidebar shell here that wraps
// the PDFViewer's built-in thumbnail panel using CSS overrides.
// When using the drop-in viewer, thumbnail panel is controlled via
// disabledCategories. This sidebar is only used in CUSTOM wrappers.
// ---------------------------------------------------------------------------

interface PdfSidebarProps {
    className?: string;
}

// ── Desktop sidebar ─────────────────────────────────────────────────────────

export const PdfDesktopSidebar = memo(function PdfDesktopSidebar({ className }: PdfSidebarProps) {
    const store = usePdfViewerStore();
    const { isSidebarOpen } = store();

    return (
        <aside
            id="pdf-thumbnail-sidebar"
            className={cn(
                'relative hidden shrink-0 flex-col overflow-hidden border-r border-border bg-muted/30 transition-all duration-300 md:flex',
                isSidebarOpen ? 'w-[160px]' : 'w-0',
                className,
            )}
            aria-label="Thumbnail sidebar"
            aria-hidden={!isSidebarOpen}
        >
            {isSidebarOpen && (
                <div className="flex h-full flex-col">
                    <div className="border-b border-border px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Halaman
                    </div>
                    {/* EmbedPDF injects thumbnails here — we provide the scroll container */}
                    <div
                        className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-2 scrollbar-thumb-border scrollbar-track-transparent"
                        role="list"
                        aria-label="Daftar thumbnail halaman"
                    >
                        {/* Thumbnails are rendered by EmbedPDF panel-sidebar internally */}
                    </div>
                </div>
            )}
        </aside>
    );
});

// ── Mobile bottom sheet (Vaul Drawer) ───────────────────────────────────────

export const PdfMobileSidebar = memo(function PdfMobileSidebar() {
    const store = usePdfViewerStore();
    const { isSidebarOpen, setSidebarOpen } = store();

    return (
        <>
            {/* Floating trigger button (mobile only) */}
            <Button
                variant="secondary"
                size="icon"
                className="fixed bottom-20 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka daftar thumbnail halaman"
                aria-controls="pdf-mobile-sidebar"
            >
                <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
            </Button>

            <Drawer.Root open={isSidebarOpen} onOpenChange={setSidebarOpen} direction="left">
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 md:hidden" />
                    <Drawer.Content
                        id="pdf-mobile-sidebar"
                        className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-card shadow-xl outline-none md:hidden"
                        aria-label="Thumbnail sidebar"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <span className="text-sm font-semibold text-foreground">Thumbnail Halaman</span>
                            <Drawer.Close asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Tutup sidebar">
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </Drawer.Close>
                        </div>

                        {/* Thumbnails container */}
                        <div
                            className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thumb-border scrollbar-track-transparent"
                            role="list"
                            aria-label="Daftar thumbnail halaman"
                        >
                            {/* EmbedPDF renders thumbnails here via panel-sidebar */}
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </>
    );
});
