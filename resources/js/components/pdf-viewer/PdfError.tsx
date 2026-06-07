// =============================================================================
// PdfError — Error state when document fails to load
// =============================================================================

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { memo } from 'react';

interface PdfErrorProps {
    message?: string | null;
    onRetry?: () => void;
}

export const PdfError = memo(function PdfError({ message, onRetry }: PdfErrorProps) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-muted/30 p-8 text-center" role="alert" aria-live="assertive">
            <div className="flex-center h-16 w-16 rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>

            <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Gagal memuat dokumen</h3>
                <p className="max-w-xs text-sm text-muted-foreground">
                    {message ?? 'Terjadi kesalahan saat memuat PDF. Pastikan URL valid dan coba lagi.'}
                </p>
            </div>

            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="gap-2" aria-label="Coba muat ulang dokumen">
                    <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                    Coba Lagi
                </Button>
            )}
        </div>
    );
});
