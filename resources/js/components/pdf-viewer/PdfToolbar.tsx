// =============================================================================
// PdfToolbar — Header toolbar, WhatsApp Web-inspired
// Responsive: shows full controls on desktop, compact on mobile
// =============================================================================

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { memo } from 'react';
import { usePdfViewerContext, usePdfViewerStore } from './context/PdfViewerContext';
import { usePdfNavigation } from './hooks/usePdfNavigation';
import { PdfDownloadButton } from './PdfDownloadButton';
import { PdfFullscreenButton } from './PdfFullscreenButton';
import { PdfPageIndicator } from './PdfPageIndicator';
import { PdfSearch } from './PdfSearch';

interface PdfToolbarProps {
    className?: string;
}

export const PdfToolbar = memo(function PdfToolbar({ className }: PdfToolbarProps) {
    const { fileName, allowDownload, allowFullscreen, allowSearch, allowThumbnail } = usePdfViewerContext();
    const store = usePdfViewerStore();
    const { isSidebarOpen, toggleSidebar } = store();
    const { nextPage, prevPage, isFirstPage, isLastPage } = usePdfNavigation();

    return (
        <header
            className={cn('flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3 shadow-sm', 'z-20 select-none', className)}
            role="toolbar"
            aria-label="PDF toolbar"
        >
            {/* ── Left group ─────────────────────────────────────── */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* Sidebar toggle (desktop only) */}
                {allowThumbnail && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground md:flex"
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? 'Tutup sidebar thumbnail' : 'Buka sidebar thumbnail'}
                        aria-expanded={isSidebarOpen}
                        aria-controls="pdf-thumbnail-sidebar"
                    >
                        {isSidebarOpen ? (
                            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
                        )}
                    </Button>
                )}

                {/* File icon + name */}
                <div className="flex min-w-0 items-center gap-1.5">
                    <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate text-sm font-medium text-foreground" title={fileName} aria-label={`File: ${fileName}`}>
                        {fileName}
                    </span>
                </div>
            </div>

            {/* ── Centre group — navigation ───────────────────────── */}
            <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Navigasi halaman">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-40"
                    onClick={prevPage}
                    disabled={isFirstPage}
                    aria-label="Halaman sebelumnya"
                    title="Halaman sebelumnya (←)"
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>

                <PdfPageIndicator />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-40"
                    onClick={nextPage}
                    disabled={isLastPage}
                    aria-label="Halaman berikutnya"
                    title="Halaman berikutnya (→)"
                >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
            </div>

            {/* ── Right group — actions ───────────────────────────── */}
            <div className="flex shrink-0 items-center gap-0.5" role="group" aria-label="Aksi dokumen">
                {allowSearch && <PdfSearch />}
                {allowDownload && <PdfDownloadButton />}
                {allowFullscreen && <PdfFullscreenButton />}
            </div>
        </header>
    );
});
