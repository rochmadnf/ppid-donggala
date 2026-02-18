/**
 * ImageCropperDialog — Pintura-style image crop editor
 *
 * Full-panel dark editor dialog with:
 *   - Dark workspace background
 *   - Centered canvas with floating controls
 *   - Bottom toolbar + preset pills
 *   - Compact header and action bar
 *
 * Flow: Upload → Select preset → Crop → Preview → Confirm
 */

import { CheckIcon, ImageIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

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
        centerImage,
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
        if (!preset) return { width: 100, height: 100 };
        const maxDim = 100;
        const ratio = preset.outputWidth / preset.outputHeight;
        if (ratio >= 1) {
            return { width: maxDim, height: Math.round(maxDim / ratio) };
        }
        return { width: Math.round(maxDim * ratio), height: maxDim };
    }, [preset]);

    // ---- Handle image selection from dropzone -----------------------------
    const handleImageSelect = useCallback((file: File) => {
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
    const handleClose = useCallback(() => {
        setImageSrc((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        onOpenChange(false);
    }, [onOpenChange]);

    if (!open) return null;

    // ---- Render -----------------------------------------------------------
    return (
        <div role="dialog" aria-modal="true" aria-label="Crop image" className="fixed inset-0 z-50 flex flex-col">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

            {/* Editor panel */}
            <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col p-3 sm:p-4">
                {/* ---- Top bar ---- */}
                <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-neutral-800 p-1.5">
                            <ImageIcon className="size-4 text-neutral-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Crop Image</h2>
                            {preset && (
                                <p className="text-[11px] text-neutral-500">
                                    {preset.label} · {preset.outputWidth}×{preset.outputHeight}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Re-upload */}
                        {imageSrc && (
                            <button
                                type="button"
                                onClick={() =>
                                    setImageSrc((prev) => {
                                        if (prev) URL.revokeObjectURL(prev);
                                        return null;
                                    })
                                }
                                disabled={isExporting}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                            >
                                Change image
                            </button>
                        )}

                        {/* Confirm */}
                        {imageSrc && (
                            <Button
                                type="button"
                                size="sm"
                                disabled={!isReady || isExporting}
                                onClick={handleConfirm}
                                className="rounded-lg bg-white text-neutral-900 hover:bg-neutral-200"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2Icon className="size-3.5 animate-spin" />
                                        Exporting…
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="size-3.5" />
                                        Done
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Close */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Close"
                        >
                            <XIcon className="size-4" />
                        </button>
                    </div>
                </div>

                {/* ---- Main workspace ---- */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-neutral-900/90 ring-1 ring-white/6">
                    {!imageSrc ? (
                        /* Step 1 — Upload */
                        <div className="flex flex-1 items-center justify-center p-6">
                            <ImageDropzone onImageSelect={handleImageSelect} maxSizeMB={maxSizeMB} className="w-full max-w-md" />
                        </div>
                    ) : (
                        /* Step 2–4 — Crop workspace */
                        <div className="flex min-h-0 flex-1 flex-col">
                            {/* Canvas + Preview */}
                            <div className="flex min-h-0 flex-1 items-stretch gap-0">
                                {/* Canvas area */}
                                <div className="flex min-w-0 flex-1 items-center justify-center p-3 sm:p-4">
                                    <CropperCanvas src={imageSrc} imageRef={imageRef} shape={preset?.shape} className="border-0 bg-transparent" />
                                </div>

                                {/* Preview sidebar (desktop) */}
                                <div className="hidden w-37 items-center justify-center border-l border-white/6 px-4 sm:flex">
                                    {isReady && (
                                        <CropperPreview
                                            cropper={cropper}
                                            isReady={isReady}
                                            shape={preset?.shape}
                                            width={previewSize.width}
                                            height={previewSize.height}
                                            changeVersion={changeVersion}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Bottom controls bar */}
                            <div className="border-t border-white/6 px-3 py-2.5 sm:px-4">
                                <CropperControls
                                    isReady={isReady}
                                    preset={preset}
                                    presets={presets}
                                    setPreset={setPreset}
                                    setAspectRatio={setAspectRatio}
                                    centerImage={centerImage}
                                    zoomIn={zoomIn}
                                    zoomOut={zoomOut}
                                    rotateLeft={rotateLeft}
                                    rotateRight={rotateRight}
                                    flipX={flipX}
                                    flipY={flipY}
                                    reset={reset}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
