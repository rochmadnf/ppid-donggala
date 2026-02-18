/**
 * CropperPreview — Live crop result preview
 *
 * Renders a real-time preview of the cropped area by listening to both
 * DOM-level cropper events (user gestures) and the `changeVersion` counter
 * from the hook (programmatic actions like rotate, flip, etc.).
 *
 * Shape masking (circle / rect) is applied via Tailwind utilities.
 */

import type Cropper from 'cropperjs';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CropperPreviewProps {
    /** CropperJS instance (null when not initialised) */
    cropper: Cropper | null;
    /** Whether the cropper is ready */
    isReady: boolean;
    /** Shape mask for the preview */
    shape?: 'circle' | 'rect';
    /** Preview width in CSS pixels */
    width?: number;
    /** Preview height in CSS pixels */
    height?: number;
    /** Incremented by the hook on programmatic changes */
    changeVersion?: number;
    /** Additional class names */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CropperPreview({ cropper, isReady, shape = 'rect', width = 120, height = 120, changeVersion = 0, className }: CropperPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasPreview, setHasPreview] = useState(false);

    /**
     * Render the current crop area into the preview canvas.
     * Debounced via requestAnimationFrame to avoid excessive redraws.
     */
    const rafRef = useRef<number>(0);

    const updatePreview = useCallback(async () => {
        // Cancel any pending frame
        cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(async () => {
            if (!cropper) return;

            const selection = cropper.getCropperSelection();
            const canvas = canvasRef.current;
            if (!selection || !canvas) return;

            try {
                const srcCanvas = await selection.$toCanvas({ width, height });
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = width;
                canvas.height = height;
                ctx.clearRect(0, 0, width, height);

                // Apply circular clip when needed
                if (shape === 'circle') {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                }

                ctx.drawImage(srcCanvas, 0, 0, width, height);

                if (shape === 'circle') {
                    ctx.restore();
                }

                setHasPreview(true);
            } catch {
                // Silently ignore – the cropper may be mid-transition
            }
        });
    }, [cropper, width, height, shape]);

    // ---- Listen to user gestures on the cropper canvas --------------------
    useEffect(() => {
        if (!isReady || !cropper) return;

        const cropperCanvas = cropper.getCropperCanvas();
        if (!cropperCanvas) return;

        const handle = () => updatePreview();

        // `actionend` fires when the user finishes a drag/pinch/wheel gesture
        cropperCanvas.addEventListener('actionend', handle);
        // `action` fires during the gesture for smoother feedback
        cropperCanvas.addEventListener('action', handle);

        // Initial render
        updatePreview();

        return () => {
            cancelAnimationFrame(rafRef.current);
            cropperCanvas.removeEventListener('actionend', handle);
            cropperCanvas.removeEventListener('action', handle);
        };
    }, [isReady, cropper, updatePreview]);

    // ---- React to programmatic changes via changeVersion ------------------
    useEffect(() => {
        if (isReady && changeVersion > 0) {
            updatePreview();
        }
    }, [changeVersion, isReady, updatePreview]);

    // ---- Render -----------------------------------------------------------
    return (
        <div data-slot="cropper-preview" className={cn('flex flex-col items-center gap-2', className)}>
            <span className="text-[10px] font-medium tracking-wider text-neutral-500 uppercase">Preview</span>
            <div
                className={cn('overflow-hidden bg-neutral-800 ring-1 ring-white/10', shape === 'circle' ? 'rounded-full' : 'rounded-lg')}
                style={{ width, height }}
            >
                <canvas ref={canvasRef} width={width} height={height} className={cn('block', !hasPreview && 'opacity-0')} aria-label="Crop preview" />
            </div>
        </div>
    );
}
