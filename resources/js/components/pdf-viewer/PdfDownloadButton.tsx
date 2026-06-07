// =============================================================================
// PdfDownloadButton — Download the original PDF
// =============================================================================

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { memo, useCallback } from 'react';
import { usePdfViewerContext } from './context/PdfViewerContext';

export const PdfDownloadButton = memo(function PdfDownloadButton() {
    const { fileUrl, fileName } = usePdfViewerContext();

    const handleDownload = useCallback(() => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName ?? 'document.pdf';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [fileUrl, fileName]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={`Unduh ${fileName ?? 'dokumen PDF'}`}
            title="Unduh PDF"
        >
            <Download className="h-4 w-4" aria-hidden="true" />
        </Button>
    );
});
