// =============================================================================
// PDF Viewer — Public API barrel
// Only export what consumers need. EmbedPDF internals stay hidden.
// =============================================================================

// ── Main component ───────────────────────────────────────────────────────────
export { PdfViewer } from './PdfViewer';

// ── Sub-components (if consumer wants to compose custom layouts) ─────────────
export { PdfDownloadButton } from './PdfDownloadButton';
export { PdfError } from './PdfError';
export { PdfFullscreenButton } from './PdfFullscreenButton';
export { PdfLoading } from './PdfLoading';
export { PdfPageIndicator } from './PdfPageIndicator';
export { PdfSearch } from './PdfSearch';
export { PdfDesktopSidebar, PdfMobileSidebar } from './PdfSidebar';
export { PdfToolbar } from './PdfToolbar';

// ── Hooks (for advanced custom integrations) ─────────────────────────────────
export { usePdfFullscreen } from './hooks/usePdfFullscreen';
export { usePdfNavigation } from './hooks/usePdfNavigation';
export { usePdfSearch } from './hooks/usePdfSearch';
export { usePdfViewer } from './hooks/usePdfViewer';
export { ZOOM_LEVELS, usePdfZoom } from './hooks/usePdfZoom';

// ── Context (for custom children inside PdfViewerProvider) ───────────────────
export { PdfViewerProvider, usePdfViewerContext } from './context/PdfViewerContext';

// ── Types ────────────────────────────────────────────────────────────────────
export type { PdfViewerContextValue, PdfViewerProps } from './types';
