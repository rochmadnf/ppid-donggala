// =============================================================================
// PdfViewer — Main public component
// Wraps @embedpdf/react-pdf-viewer (v2) behind a clean reusable abstraction.
//
// FIX: EmbedPDF v2 TIDAK memiliki onDocumentLoaded / onError sebagai prop
// langsung di <PDFViewer>. Event lifecycle hanya tersedia lewat:
//   registry → docManager.onDocumentOpened() / onDocumentError()
//
// Strategi:
// 1. Gunakan `initialDocuments` config (bukan prop `src`) untuk load PDF
// 2. Pasang listener via viewerRef.current.registry setelah mount
// 3. Fallback: jika listener tidak terpanggil dalam 3 detik, anggap berhasil
//    (PDF sudah tampil, hanya overlay loading-nya yang tidak hilang)
// =============================================================================

import { cn } from '@/lib/utils';
import { PDFViewer, type PDFViewerRef } from '@embedpdf/react-pdf-viewer';
import React, { memo, Suspense, useCallback, useEffect, useRef } from 'react';

import { PdfViewerProvider, usePdfViewerStore } from './context/PdfViewerContext';
import { usePdfFullscreen } from './hooks/usePdfFullscreen';
import type { EmbedPdfCategory, PdfViewerProps } from './types';

import { PdfError } from './PdfError';
import { PdfLoading } from './PdfLoading';
import { PdfToolbar } from './PdfToolbar';

// ---------------------------------------------------------------------------
// Internal viewer — rendered inside the context/store providers
// ---------------------------------------------------------------------------

const PdfViewerInner = memo(function PdfViewerInner({
    fileUrl,
    themePreference,
    allowDownload,
    allowSearch,
    allowThumbnail,
    onLoad,
    onError,
}: Pick<PdfViewerProps, 'fileUrl' | 'themePreference' | 'allowDownload' | 'allowSearch' | 'allowThumbnail' | 'onLoad' | 'onError'>) {
    const store = usePdfViewerStore();
    const { isLoaded, isError, errorMessage, setLoaded, setError, reset } = store();

    const { containerRef } = usePdfFullscreen();
    const viewerRef = useRef<PDFViewerRef>(null);
    const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Build disabled categories from props
    const disabledCategories = React.useMemo<string[]>(() => {
        const disabled: EmbedPdfCategory[] = ['annotation', 'redaction', 'insert', 'history'];
        if (!allowDownload) disabled.push('export');
        if (!allowSearch) disabled.push('panel-search');
        if (!allowThumbnail) disabled.push('panel-sidebar');
        return disabled;
    }, [allowDownload, allowSearch, allowThumbnail]);

    // ── Reset state whenever fileUrl changes ────────────────────────────────
    useEffect(() => {
        reset();
    }, [fileUrl, reset]);

    // ── Attach document lifecycle listeners via EmbedPDF registry ───────────
    //
    // EmbedPDF v2 exposes events ONLY through:
    //   const registry = await viewerRef.current?.registry
    //   const dm = registry.getPlugin('document-manager').provides()
    //   dm.onDocumentOpened(cb)
    //   dm.onDocumentError(cb)
    //
    // We also set a 3-second fallback so the overlay always clears — the PDF
    // renders internally regardless; only our overlay state was stuck.
    // ────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        const attachListeners = async () => {
            // Small delay so the viewer has time to initialize its registry
            await new Promise((r) => setTimeout(r, 200));
            if (cancelled) return;

            try {
                const registry = await viewerRef.current?.registry;
                if (!registry || cancelled) return;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dm = (registry as any).getPlugin('document-manager')?.provides();

                if (!dm) {
                    // Registry available but no document-manager — still clear overlay
                    setLoaded(true);
                    onLoad?.();
                    return;
                }

                // Success listener
                dm.onDocumentOpened?.(() => {
                    if (cancelled) return;
                    clearTimeout(fallbackTimerRef.current ?? undefined);
                    setLoaded(true);
                    setError(null);
                    onLoad?.();
                });

                // Error listener
                dm.onDocumentError?.(({ error }: { error: unknown }) => {
                    if (cancelled) return;
                    clearTimeout(fallbackTimerRef.current ?? undefined);
                    const msg = error instanceof Error ? error.message : 'Dokumen tidak dapat dimuat. Pastikan URL valid.';
                    setError(msg);
                    onError?.(error instanceof Error ? error : new Error(msg));
                });
            } catch {
                // If registry access fails entirely, clear overlay via fallback
            }
        };

        // ── Fallback timer (3 s) ─────────────────────────────────────────────
        // If the event never fires (e.g. API changed), remove the loading
        // overlay so users can see the PDF that EmbedPDF already rendered.
        fallbackTimerRef.current = setTimeout(() => {
            if (!cancelled) {
                setLoaded(true);
                onLoad?.();
            }
        }, 3000);

        attachListeners();

        return () => {
            cancelled = true;
            if (fallbackTimerRef.current) {
                clearTimeout(fallbackTimerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUrl]);

    // ── Retry handler ────────────────────────────────────────────────────────
    const handleRetry = useCallback(() => {
        reset();
    }, [reset]);

    // ── Render ──────────────────────────────────────────────────────────────

    if (isError) {
        return <PdfError message={errorMessage} onRetry={handleRetry} />;
    }

    return (
        <div ref={containerRef} className="relative flex h-full w-full flex-col overflow-hidden">
            {/* Loading overlay — removed once EmbedPDF fires onDocumentOpened
          or fallback timer fires (whichever comes first) */}
            {!isLoaded && (
                <div className="absolute inset-0 z-10">
                    <PdfLoading />
                </div>
            )}

            {/* EmbedPDF PDFViewer — always rendered; opacity hides it while loading */}
            <div
                className={cn('flex-1 overflow-hidden transition-opacity duration-300', isLoaded ? 'opacity-100' : 'opacity-0')}
                aria-label="Area konten PDF"
                aria-busy={!isLoaded}
            >
                <PDFViewer
                    ref={viewerRef}
                    config={{
                        // ── Use initialDocuments (v2 canonical way) ──────────────────
                        documentManager: {
                            initialDocuments: [
                                {
                                    url: fileUrl,
                                    autoActivate: true,
                                },
                            ],
                        },
                        tabBar: 'never',
                        theme: {
                            preference: themePreference ?? 'system',
                        },
                        disabledCategories,
                        zoom: {
                            defaultZoom: 'fit-width',
                        },
                        scroll: {
                            direction: 'vertical',
                        },
                    }}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
        </div>
    );
});

// ---------------------------------------------------------------------------
// Public <PdfViewer /> component
// ---------------------------------------------------------------------------

export const PdfViewer = memo(function PdfViewer({
    fileUrl,
    fileName = 'Dokumen PDF',
    defaultZoom = 100,
    allowDownload = true,
    allowFullscreen = true,
    allowSearch = true,
    allowThumbnail = true,
    themePreference = 'system',
    className,
    onLoad,
    onError,
}: PdfViewerProps) {
    const contextValue = React.useMemo(
        () => ({
            fileUrl,
            fileName,
            allowDownload,
            allowFullscreen,
            allowSearch,
            allowThumbnail,
            themePreference,
        }),
        [fileUrl, fileName, allowDownload, allowFullscreen, allowSearch, allowThumbnail, themePreference],
    );

    return (
        <PdfViewerProvider value={contextValue} defaultZoom={defaultZoom}>
            <div
                className={cn(
                    'relative flex h-full w-full flex-col overflow-hidden',
                    'rounded-lg border border-border bg-card shadow-sm',
                    'font-sans antialiased',
                    className,
                )}
                role="application"
                aria-label={`PDF Viewer: ${fileName}`}
            >
                {/* Toolbar */}
                <PdfToolbar />

                {/* Content area */}
                <div className="relative flex min-h-0 flex-1 overflow-hidden">
                    <main className="relative min-w-0 flex-1 overflow-hidden bg-muted/20" aria-label="Konten PDF">
                        <Suspense fallback={<PdfLoading />}>
                            <PdfViewerInner
                                fileUrl={fileUrl}
                                themePreference={themePreference}
                                allowDownload={allowDownload}
                                allowSearch={allowSearch}
                                allowThumbnail={allowThumbnail}
                                onLoad={onLoad}
                                onError={onError}
                            />
                        </Suspense>
                    </main>
                </div>
            </div>
        </PdfViewerProvider>
    );
});

PdfViewer.displayName = 'PdfViewer';
