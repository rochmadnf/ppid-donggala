// =============================================================================
// PDF Viewer — Zustand Store (v5)
// Shared state for toolbar, sidebar, search, navigation, fullscreen
// =============================================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PdfViewerState } from '../types';

// ---------------------------------------------------------------------------
// Default / initial state
// ---------------------------------------------------------------------------

const initialState = {
    isLoaded: false,
    isError: false,
    errorMessage: null,
    totalPages: 0,
    currentPage: 1,
    isSidebarOpen: true,
    isSearchOpen: false,
    isFullscreen: false,
    zoomLevel: 100,
} as const;

// ---------------------------------------------------------------------------
// Store factory — create a NEW store per <PdfViewer /> instance so that
// multiple viewers on the same page don't share state.
// ---------------------------------------------------------------------------

export const createPdfViewerStore = (defaultZoom = 100) =>
    create<PdfViewerState>()(
        devtools(
            (set) => ({
                ...initialState,
                zoomLevel: defaultZoom,

                // ── Actions ─────────────────────────────────────────────────────────

                setLoaded: (loaded) => set({ isLoaded: loaded }, false, 'setLoaded'),

                setError: (message) => set({ isError: message !== null, errorMessage: message }, false, 'setError'),

                setTotalPages: (total) => set({ totalPages: total }, false, 'setTotalPages'),

                setCurrentPage: (page) => set({ currentPage: page }, false, 'setCurrentPage'),

                setSidebarOpen: (open) => set({ isSidebarOpen: open }, false, 'setSidebarOpen'),

                setSearchOpen: (open) => set({ isSearchOpen: open }, false, 'setSearchOpen'),

                setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }, false, 'setFullscreen'),

                setZoomLevel: (level) => set({ zoomLevel: level }, false, 'setZoomLevel'),

                toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen }), false, 'toggleSidebar'),

                toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen }), false, 'toggleSearch'),

                reset: () => set({ ...initialState, zoomLevel: defaultZoom }, false, 'reset'),
            }),
            { name: 'PdfViewerStore', enabled: process.env.NODE_ENV !== 'production' },
        ),
    );

// Re-export the type for convenience
export type PdfViewerStore = ReturnType<typeof createPdfViewerStore>;
