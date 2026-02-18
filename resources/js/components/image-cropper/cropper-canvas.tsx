/**
 * CropperCanvas — Visual cropper surface
 *
 * Renders the <img> element that CropperJS v2 wraps with its custom elements.
 * This component is intentionally logic-free — it only handles rendering
 * and delegates all behaviour to the `useCropper` hook via the `imageRef`.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CropperCanvasProps {
    /** Image source URL (blob / data / remote) */
    src: string;
    /** Ref obtained from `useCropper().imageRef` — attached to the <img> */
    imageRef: React.RefObject<HTMLImageElement | null>;
    /** Active shape preset — controls visual container masking */
    shape?: 'circle' | 'rect';
    /** Additional class names for the outer wrapper */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CropperCanvas({ src, imageRef, shape = 'rect', className }: CropperCanvasProps) {
    return (
        <div
            data-slot="cropper-canvas-wrapper"
            className={cn(
                'relative w-full overflow-hidden rounded-lg border bg-muted',
                // Min height ensures the cropper has a usable area on small screens
                'min-h-70 sm:min-h-90',
                className,
            )}
        >
            {/*
             * The <img> is the only element CropperJS needs.
             * CropperJS v2 wraps it with custom elements (<cropper-canvas>, etc.)
             * during initialisation and removes them on destroy.
             *
             * `display: block` prevents the inline‐image gap.
             * `max-h / max-w` ensure the image fits within the container.
             */}
            <img
                ref={imageRef}
                src={src}
                alt="Image to crop"
                crossOrigin="anonymous"
                className="block max-h-[70vh] w-full object-contain"
                // Prevent native drag behaviour (CropperJS handles gestures)
                draggable={false}
            />
        </div>
    );
}
