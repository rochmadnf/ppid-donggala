// =============================================================================
// PdfFullscreenButton — Toggle browser fullscreen
// =============================================================================

import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { memo } from 'react';
import { usePdfFullscreen } from './hooks/usePdfFullscreen';

export const PdfFullscreenButton = memo(function PdfFullscreenButton() {
    const { isFullscreen, toggleFullscreen } = usePdfFullscreen();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={isFullscreen ? 'Keluar dari layar penuh' : 'Tampilkan layar penuh'}
            aria-pressed={isFullscreen}
            title={isFullscreen ? 'Keluar layar penuh (Esc)' : 'Layar penuh'}
        >
            {isFullscreen ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
        </Button>
    );
});
