// =============================================================================
// PdfPageIndicator — "Page X of Y" input + label in the toolbar
// =============================================================================

import React, { memo, useCallback, useRef, useState } from 'react';
import { usePdfNavigation } from './hooks/usePdfNavigation';

export const PdfPageIndicator = memo(function PdfPageIndicator() {
    const { currentPage, totalPages, goToPage } = usePdfNavigation();
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = useCallback(() => {
        setIsEditing(true);
        setInputValue(String(currentPage));
        // Select all text on focus for quick replacement
        setTimeout(() => inputRef.current?.select(), 0);
    }, [currentPage]);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        const page = parseInt(inputValue, 10);
        if (!isNaN(page)) {
            goToPage(page);
        }
    }, [inputValue, goToPage]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.currentTarget.blur();
            }
            if (e.key === 'Escape') {
                setIsEditing(false);
                setInputValue(String(currentPage));
                inputRef.current?.blur();
            }
        },
        [currentPage],
    );

    return (
        <div className="flex items-center gap-1.5 text-sm" aria-label={`Halaman ${currentPage} dari ${totalPages}`}>
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                className="h-7 w-10 rounded border border-border bg-background text-center text-sm font-medium text-foreground ring-offset-background transition outline-none focus:border-primary focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                value={isEditing ? inputValue : currentPage}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={!totalPages}
                aria-label="Nomor halaman saat ini"
                aria-valuemin={1}
                aria-valuemax={totalPages}
                aria-valuenow={currentPage}
                aria-readonly={!totalPages}
            />
            <span className="text-muted-foreground select-none" aria-hidden="true">
                /
            </span>
            <span className="min-w-[1.5rem] text-center font-medium text-foreground" aria-label={`Total ${totalPages} halaman`}>
                {totalPages || '—'}
            </span>
        </div>
    );
});
