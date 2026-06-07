// =============================================================================
// Hook: usePdfSearch
// Manages the search panel open/close state via Zustand
// EmbedPDF handles the actual full-text search internally via panel-search
// =============================================================================

import { useCallback } from 'react';
import { usePdfViewerStore } from '../context/PdfViewerContext';

export function usePdfSearch() {
    const store = usePdfViewerStore();
    const { isSearchOpen, setSearchOpen } = store();

    const openSearch = useCallback(() => setSearchOpen(true), [setSearchOpen]);
    const closeSearch = useCallback(() => setSearchOpen(false), [setSearchOpen]);
    const toggleSearch = useCallback(() => setSearchOpen(!isSearchOpen), [isSearchOpen, setSearchOpen]);

    return { isSearchOpen, openSearch, closeSearch, toggleSearch };
}
