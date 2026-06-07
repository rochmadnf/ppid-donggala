// =============================================================================
// PdfLoading — Skeleton / spinner shown while the document is loading
// =============================================================================

import { FileText } from 'lucide-react';
import { memo } from 'react';

export const PdfLoading = memo(function PdfLoading() {
    return (
        <div
            className="flex h-full w-full flex-col items-center justify-center gap-4 bg-muted/30"
            role="status"
            aria-label="PDF dokumen sedang dimuat"
        >
            {/* Pulsing file icon */}
            <div className="relative flex-center">
                <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/10" />
                <div className="relative flex-center h-14 w-14 rounded-full bg-primary/10">
                    <FileText className="h-7 w-7 animate-pulse text-primary" aria-hidden="true" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium text-foreground">Memuat dokumen…</p>
                <p className="text-xs text-muted-foreground">Harap tunggu sebentar</p>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <div className="h-full w-1/2 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-primary/40" />
            </div>
        </div>
    );
});
