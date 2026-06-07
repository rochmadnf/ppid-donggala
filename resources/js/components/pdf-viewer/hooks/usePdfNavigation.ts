// =============================================================================
// Hook: usePdfNavigation
// Page navigation helpers with keyboard support
// =============================================================================

import { useCallback, useEffect } from 'react';
import { usePdfViewerStore } from '../context/PdfViewerContext';

export function usePdfNavigation() {
    const store = usePdfViewerStore();
    const { currentPage, totalPages, setCurrentPage } = store();

    const goToPage = useCallback(
        (page: number) => {
            if (!totalPages) return;
            const clamped = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(clamped);
        },
        [totalPages, setCurrentPage],
    );

    const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
    const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);
    const firstPage = useCallback(() => goToPage(1), [goToPage]);
    const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

    // Keyboard navigation (ArrowRight / ArrowLeft) when the viewer is focused
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            // Only trigger when NOT focused in an input/select
            const target = e.target as HTMLElement;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') nextPage();
            if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevPage();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [nextPage, prevPage]);

    return {
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        isFirstPage: currentPage <= 1,
        isLastPage: currentPage >= totalPages,
    };
}
