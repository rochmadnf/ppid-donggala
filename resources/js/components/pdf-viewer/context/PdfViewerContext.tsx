// =============================================================================
// PDF Viewer — Context
// Passes static viewer config to child components without prop-drilling.
// Dynamic state lives in the Zustand store; only config lives here.
// =============================================================================

import React, { createContext, useContext, useMemo, useRef } from 'react';
import { createPdfViewerStore, type PdfViewerStore } from '../stores/pdfViewerStore';
import type { PdfViewerContextValue } from '../types';

// ---------------------------------------------------------------------------
// Context shapes
// ---------------------------------------------------------------------------

interface PdfViewerContextShape extends PdfViewerContextValue {
    store: PdfViewerStore;
}

// ---------------------------------------------------------------------------
// Context definition
// ---------------------------------------------------------------------------

const PdfViewerContext = createContext<PdfViewerContextShape | null>(null);

PdfViewerContext.displayName = 'PdfViewerContext';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface PdfViewerProviderProps {
    children: React.ReactNode;
    value: PdfViewerContextValue;
    defaultZoom: number;
}

export function PdfViewerProvider({ children, value, defaultZoom }: PdfViewerProviderProps) {
    // Create ONE store instance per mounted <PdfViewer /> using a ref so React
    // StrictMode double-invocations don't create two different stores.
    const storeRef = useRef<PdfViewerStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createPdfViewerStore(defaultZoom);
    }

    const contextValue = useMemo<PdfViewerContextShape>(
        () => ({ ...value, store: storeRef.current! }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [value.fileUrl, value.fileName, value.allowDownload, value.allowFullscreen, value.allowSearch, value.allowThumbnail, value.themePreference],
    );

    return <PdfViewerContext.Provider value={contextValue}>{children}</PdfViewerContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Access the static viewer config */
export function usePdfViewerContext(): PdfViewerContextShape {
    const ctx = useContext(PdfViewerContext);
    if (!ctx) {
        throw new Error('usePdfViewerContext must be used inside <PdfViewerProvider>');
    }
    return ctx;
}

/** Access the Zustand store for this viewer instance */
export function usePdfViewerStore(): PdfViewerStore {
    const { store } = usePdfViewerContext();
    return store;
}
