// =============================================================================
// PdfSearch — Search toggle button
// The actual search panel is handled by EmbedPDF via panel-search category.
// This button is only used when EmbedPDF search panel is externally controlled.
// =============================================================================

import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { memo } from 'react';
import { usePdfSearch } from './hooks/usePdfSearch';

export const PdfSearch = memo(function PdfSearch() {
    const { isSearchOpen, toggleSearch } = usePdfSearch();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={isSearchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
            aria-pressed={isSearchOpen}
            title={isSearchOpen ? 'Tutup pencarian' : 'Cari dalam dokumen (Ctrl+F)'}
        >
            {isSearchOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
        </Button>
    );
});
