// =============================================================================
// Hook: usePdfFullscreen
// Wraps the browser Fullscreen API with ESC-key handling
// =============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { usePdfViewerStore } from '../context/PdfViewerContext';

export function usePdfFullscreen() {
    const store = usePdfViewerStore();
    const { isFullscreen, setFullscreen } = store();
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Sync state when user presses ESC or browser exits fullscreen
    useEffect(() => {
        const handleChange = () => {
            setFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, [setFullscreen]);

    const enterFullscreen = useCallback(async () => {
        const el = containerRef.current;
        if (!el) return;
        try {
            await el.requestFullscreen();
            setFullscreen(true);
        } catch {
            // Fullscreen may be blocked in sandboxed iframes; fail silently
        }
    }, [setFullscreen]);

    const exitFullscreen = useCallback(async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
        setFullscreen(false);
    }, [setFullscreen]);

    const toggleFullscreen = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    return { containerRef, isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
}
