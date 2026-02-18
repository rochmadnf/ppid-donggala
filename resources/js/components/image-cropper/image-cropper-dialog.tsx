/**
 * ImageCropperDialog — Full-featured image crop dialog
 *
 * Composes all image cropper modules inside a shadcn Dialog:
 *   1. Upload image (drag & drop or click)
 *   2. Select a preset (built-in or custom)
 *   3. Crop, zoom, rotate, flip
 *   4. Preview result
 *   5. Confirm → export blob
 *
 * Responsive: stacks vertically on mobile, side-by-side on desktop.
 */

import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { CropperCanvas } from './cropper-canvas';
import { CropperControls } from './cropper-controls';
import { CropperPreview } from './cropper-preview';
import { ImageDropzone } from './image-dropzone';
import type { CropPreset } from './presets';
import { useCropper } from './use-cropper';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageCropperDialogProps {
    /** Controlled open state */
    open: boolean;
    /** Callback when the dialog open state changes */
    onOpenChange: (open: boolean) => void;
    /** Key of the preset to select by default */
    defaultPreset?: string;
    /** Additional presets merged with the built-in ones */
    presets?: CropPreset[];
    /** Called when the user confirms the crop */
    onConfirm: (blob: Blob, preset: CropPreset) => void;
    /** Maximum upload size in MB (default: 5) */
    maxSizeMB?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageCropperDialog({
    open,
    onOpenChange,
    defaultPreset = 'avatar',
    presets: customPresets,
    onConfirm,
    maxSizeMB = 5,
}: ImageCropperDialogProps) {
    // ---- Local image source state -----------------------------------------
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // ---- Cropper hook -----------------------------------------------------
    const {
        imageRef,
        cropper,
        isReady,
        preset,
        presets,
        changeVersion,
        setPreset,
        setAspectRatio,
        zoomIn,
        zoomOut,
        rotateLeft,
        rotateRight,
        flipX,
        flipY,
        reset,
        getCroppedBlob,
    } = useCropper({
        imageSrc,
        defaultPreset,
        customPresets,
    });

    // ---- Preview dimensions (scaled down from output) ---------------------
    const previewSize = useMemo(() => {
        if (!preset) return { width: 120, height: 120 };
        const maxDim = 120;
        const ratio = preset.outputWidth / preset.outputHeight;
        if (ratio >= 1) {
            return { width: maxDim, height: Math.round(maxDim / ratio) };
        }
        return { width: Math.round(maxDim * ratio), height: maxDim };
    }, [preset]);

    // ---- Handle image selection from dropzone -----------------------------
    const handleImageSelect = useCallback((file: File) => {
        // Revoke previous blob URL to free memory
        setImageSrc((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    }, []);

    // ---- Handle confirm ---------------------------------------------------
    const handleConfirm = useCallback(async () => {
        if (!preset) return;

        setIsExporting(true);
        try {
            const blob = await getCroppedBlob('image/png', 0.92);
            if (blob) {
                onConfirm(blob, preset);
                // Clean up and close
                setImageSrc((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
                onOpenChange(false);
            }
        } catch (err) {
            console.error('[ImageCropperDialog] Export failed:', err);
        } finally {
            setIsExporting(false);
        }
    }, [preset, getCroppedBlob, onConfirm, onOpenChange]);

    // ---- Handle dialog close (cleanup) ------------------------------------
    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!next) {
                // Revoke blob URL on close
                setImageSrc((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
            }
            onOpenChange(next);
        },
        [onOpenChange],
    );

    // ---- Render -----------------------------------------------------------
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                    <DialogDescription>Upload an image, select a preset, and adjust the crop area.</DialogDescription>
                </DialogHeader>

                {/* ---- Main content area (scrollable) ---- */}
                <div className="flex-1 overflow-y-auto">
                    {!imageSrc ? (
                        /* Step 1 — Upload */
                        <ImageDropzone onImageSelect={handleImageSelect} maxSizeMB={maxSizeMB} />
                    ) : (
                        /* Step 2–4 — Crop */
                        <div className="flex flex-col gap-4">
                            {/* Canvas + Preview row */}
                            <div className="flex flex-col items-start gap-4 sm:flex-row">
                                {/* Cropper */}
                                <div className="min-w-0 flex-1">
                                    <CropperCanvas src={imageSrc} imageRef={imageRef} shape={preset?.shape} />
                                </div>

                                {/* Preview sidebar */}
                                {isReady && (
                                    <CropperPreview
                                        cropper={cropper}
                                        isReady={isReady}
                                        shape={preset?.shape}
                                        width={previewSize.width}
                                        height={previewSize.height}
                                        changeVersion={changeVersion}
                                        className="shrink-0"
                                    />
                                )}
                            </div>

                            {/* Controls */}
                            <CropperControls
                                isReady={isReady}
                                preset={preset}
                                presets={presets}
                                setPreset={setPreset}
                                setAspectRatio={setAspectRatio}
                                zoomIn={zoomIn}
                                zoomOut={zoomOut}
                                rotateLeft={rotateLeft}
                                rotateRight={rotateRight}
                                flipX={flipX}
                                flipY={flipY}
                                reset={reset}
                            />
                        </div>
                    )}
                </div>

                {/* ---- Footer ---- */}
                {imageSrc && (
                    <DialogFooter>
                        {/* Re-upload */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setImageSrc((prev) => {
                                    if (prev) URL.revokeObjectURL(prev);
                                    return null;
                                })
                            }
                            disabled={isExporting}
                        >
                            Change Image
                        </Button>

                        {/* Confirm */}
                        <Button type="button" disabled={!isReady || isExporting} onClick={handleConfirm}>
                            {isExporting ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Exporting…
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="size-4" />
                                    Confirm
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
