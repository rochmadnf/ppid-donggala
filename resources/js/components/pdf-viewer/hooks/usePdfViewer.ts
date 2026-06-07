// =============================================================================
// Hook: usePdfViewer
// Primary hook for consumers to read viewer state via Zustand
// =============================================================================

import { useCallback } from 'react';
import { usePdfViewerContext } from '../context/PdfViewerContext';

export function usePdfViewer() {
    const { store, ...config } = usePdfViewerContext();

    // Use useStore pattern from Zustand v5
    const state = store();

    const goToPage = useCallback(
        (page: number) => {
            const clamped = Math.max(1, Math.min(page, state.totalPages || 1));
            state.setCurrentPage(clamped);
        },
        [state],
    );

    return {
        // Config (static)
        ...config,

        // State (reactive)
        isLoaded: state.isLoaded,
        isError: state.isError,
        errorMessage: state.errorMessage,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        isSidebarOpen: state.isSidebarOpen,
        isSearchOpen: state.isSearchOpen,
        isFullscreen: state.isFullscreen,
        zoomLevel: state.zoomLevel,

        // Actions
        goToPage,
        setLoaded: state.setLoaded,
        setError: state.setError,
        setTotalPages: state.setTotalPages,
        setCurrentPage: state.setCurrentPage,
        setSidebarOpen: state.setSidebarOpen,
        setSearchOpen: state.setSearchOpen,
        setFullscreen: state.setFullscreen,
        setZoomLevel: state.setZoomLevel,
        toggleSidebar: state.toggleSidebar,
        toggleSearch: state.toggleSearch,
        reset: state.reset,
    };
}
