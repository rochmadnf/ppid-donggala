// =============================================================================
// PDF Viewer — Types
// Stack: React 19 + TypeScript 6 + EmbedPDF v2 + Zustand v5
// =============================================================================

// ---------------------------------------------------------------------------
// Public API — props accepted by <PdfViewer />
// ---------------------------------------------------------------------------

export interface PdfViewerProps {
    /** URL or path to the PDF document */
    fileUrl: string;
    /** Display name shown in the header */
    fileName?: string;
    /** Initial zoom level in percent (e.g. 100 = 100%) */
    defaultZoom?: number;
    /** Show the download button */
    allowDownload?: boolean;
    /** Allow entering fullscreen mode */
    allowFullscreen?: boolean;
    /** Show the search panel toggle */
    allowSearch?: boolean;
    /** Show the thumbnail sidebar toggle */
    allowThumbnail?: boolean;
    /** Force colour mode — defaults to 'system' */
    themePreference?: 'light' | 'dark' | 'system';
    /** CSS class applied to the outermost container */
    className?: string;
    /** Called when the document finishes loading */
    onLoad?: () => void;
    /** Called when an error occurs */
    onError?: (error: Error) => void;
}

// ---------------------------------------------------------------------------
// Internal state — managed by Zustand
// ---------------------------------------------------------------------------

export interface PdfViewerState {
    // Document
    isLoaded: boolean;
    isError: boolean;
    errorMessage: string | null;
    totalPages: number;
    currentPage: number;

    // UI panels
    isSidebarOpen: boolean;
    isSearchOpen: boolean;
    isFullscreen: boolean;

    // Zoom
    zoomLevel: number;

    // Actions
    setLoaded: (loaded: boolean) => void;
    setError: (message: string | null) => void;
    setTotalPages: (total: number) => void;
    setCurrentPage: (page: number) => void;
    setSidebarOpen: (open: boolean) => void;
    setSearchOpen: (open: boolean) => void;
    setFullscreen: (fullscreen: boolean) => void;
    setZoomLevel: (level: number) => void;
    toggleSidebar: () => void;
    toggleSearch: () => void;
    reset: () => void;
}

// ---------------------------------------------------------------------------
// Context value passed to child components
// ---------------------------------------------------------------------------

export interface PdfViewerContextValue {
    fileUrl: string;
    fileName: string;
    allowDownload: boolean;
    allowFullscreen: boolean;
    allowSearch: boolean;
    allowThumbnail: boolean;
    themePreference: 'light' | 'dark' | 'system';
}

// ---------------------------------------------------------------------------
// EmbedPDF disabled categories type helper
// ---------------------------------------------------------------------------

export type EmbedPdfCategory =
    | 'zoom'
    | 'zoom-in'
    | 'zoom-out'
    | 'zoom-fit-page'
    | 'zoom-fit-width'
    | 'annotation'
    | 'form'
    | 'redaction'
    | 'document'
    | 'document-open'
    | 'document-close'
    | 'document-print'
    | 'document-fullscreen'
    | 'panel'
    | 'panel-sidebar'
    | 'panel-search'
    | 'panel-comment'
    | 'tools'
    | 'selection'
    | 'history'
    | 'insert'
    | 'navigation'
    | 'spread'
    | 'rotate'
    | 'scroll'
    | 'print'
    | 'export';
