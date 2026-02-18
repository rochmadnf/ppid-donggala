/**
 * CropperCanvas — Visual cropper surface
 *
 * Renders the <img> element that CropperJS v2 wraps with its custom elements.
 * This component is intentionally logic-free — it only handles rendering
 * and delegates all behaviour to the `useCropper` hook via the `imageRef`.
 *
 * Styled to match Pintura — dark immersive workspace, no border chrome.
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
                // Pintura-style: dark immersive workspace, rounded, no visible border
                'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900',
                'min-h-64 sm:min-h-96',
                className,
            )}
        >
            <img
                ref={imageRef}
                src={src}
                alt="Image to crop"
                crossOrigin="anonymous"
                className="block h-full max-h-full w-full object-contain"
                draggable={false}
            />
        </div>
    );
}
