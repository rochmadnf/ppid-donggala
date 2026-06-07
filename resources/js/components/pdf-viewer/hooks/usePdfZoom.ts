// =============================================================================
// Hook: usePdfZoom
// Manages zoom level state (tracked locally; EmbedPDF handles the actual zoom)
// =============================================================================

import { useCallback } from 'react';
import { usePdfViewerStore } from '../context/PdfViewerContext';

export const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200, 300] as const;
export const ZOOM_STEP = 25;
export const ZOOM_MIN = 25;
export const ZOOM_MAX = 500;

export function usePdfZoom() {
    const store = usePdfViewerStore();
    const { zoomLevel, setZoomLevel } = store();

    const clampZoom = (level: number) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(level)));

    const zoomIn = useCallback(() => setZoomLevel(clampZoom(zoomLevel + ZOOM_STEP)), [zoomLevel, setZoomLevel]);

    const zoomOut = useCallback(() => setZoomLevel(clampZoom(zoomLevel - ZOOM_STEP)), [zoomLevel, setZoomLevel]);

    const zoomTo = useCallback((level: number) => setZoomLevel(clampZoom(level)), [setZoomLevel]);

    const resetZoom = useCallback(() => setZoomLevel(100), [setZoomLevel]);

    return {
        zoomLevel,
        zoomIn,
        zoomOut,
        zoomTo,
        resetZoom,
        canZoomIn: zoomLevel < ZOOM_MAX,
        canZoomOut: zoomLevel > ZOOM_MIN,
        zoomLevels: ZOOM_LEVELS,
    };
}
