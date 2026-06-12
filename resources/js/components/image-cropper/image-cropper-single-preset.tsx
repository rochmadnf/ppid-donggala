import { CheckIcon, ImageIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

import { CropperCanvas } from './cropper-canvas';
import { CropperControls } from './cropper-controls';
import { useTempUpload } from './hooks/use-temp-upload';
import { ImageDropzone } from './image-dropzone';
import type { CropPreset } from './presets';
import { useCropper } from './use-cropper';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Controls how the picked file is turned into a src for CropperJS.
 *
 * - 'server' (default) — file is POSTed to /api/temp-images first; the
 *   returned HTTP URL is used.  Safe behind any CSP / WAF.
 * - 'blob'             — file is turned into a blob: URL client-side via
 *   URL.createObjectURL().  Zero latency, but blocked by strict CSP / WAF.
 * - 'base64'           — file is read into a data: URI via FileReader.
 *   No server round-trip, no blob: scheme — works on most CSP configs that
 *   allow `data:` in img-src.  Larger memory footprint for big files.
 */
export type ImageSourceMode = 'server' | 'blob' | 'base64';

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
    onConfirm: (blob: Blob, preset: CropPreset) => void | Promise<void>;
    /** Maximum upload size in MB (default: 5) */
    maxSizeMB?: number;
    /** Output MIME type (default: image/png) */
    outputType?: string;
    /** Output quality between 0 and 1 (default: 0.92) */
    outputQuality?: number;
    /**
     * How the selected image is converted to a src for CropperJS.
     * - 'server' (default) — upload to /api/temp-images, use returned HTTP URL
     * - 'blob'             — URL.createObjectURL() — fast but blocked by CSP/WAF
     * - 'base64'           — FileReader data: URI — no server, no blob: scheme
     */
    imageSourceMode?: ImageSourceMode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a File to a base64 data: URI using FileReader. */
function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('FileReader failed to read the file.'));
        reader.readAsDataURL(file);
    });
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
    outputType = 'image/png',
    outputQuality = 0.92,
    imageSourceMode = 'server',
}: ImageCropperDialogProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // ---- Server-upload state (only used when imageSourceMode === 'server') -
    const { isUploading, error: uploadError, upload, reset: resetUpload } = useTempUpload();

    // ---- Cropper hook -----------------------------------------------------
    const {
        imageRef,
        isReady,
        preset,
        presets,
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
    const handleImageSelect = useCallback(
        async (file: File) => {
            if (imageSourceMode === 'server') {
                // --- Mode: server ---
                // POST the file to /api/temp-images and use the returned HTTP URL.
                // Safe behind any CSP / WAF because the src is a plain HTTP URL.
                try {
                    const { url } = await upload(file);
                    setImageSrc(url);
                } catch {
                    // Error already tracked inside useTempUpload.
                }
                return;
            }

            if (imageSourceMode === 'blob') {
                // --- Mode: blob ---
                // Fast, zero-latency, but may be blocked by CSP / WAF (blob: scheme).
                // Revoke any previous blob URL to free memory.
                setImageSrc((prev) => {
                    if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
                    return URL.createObjectURL(file);
                });
                return;
            }

            // --- Mode: base64 ---
            // Read the file into a data: URI via FileReader.
            // No server round-trip, no blob: scheme.
            // Note: large files will produce a large string in memory.
            try {
                const dataUrl = await readFileAsDataURL(file);
                setImageSrc(dataUrl);
            } catch (err) {
                console.error('[ImageCropperDialog] FileReader failed:', err);
            }
        },
        [imageSourceMode, upload],
    );

    // ---- Clear current image (back to dropzone) ---------------------------
    const clearImage = useCallback(() => {
        setImageSrc((prev) => {
            // Revoke blob URL to free memory (blob mode only)
            if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
            return null;
        });
        // Reset server-upload state (no-op in blob / base64 modes)
        resetUpload();
    }, [resetUpload]);

    // ---- Handle confirm ---------------------------------------------------
    const handleConfirm = useCallback(async () => {
        if (!preset) return;

        setIsExporting(true);
        try {
            const blob = await getCroppedBlob(outputType, outputQuality);
            if (blob) {
                await onConfirm(blob, preset);
                // Cleanup after successful confirm
                setImageSrc((prev) => {
                    if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
                    return null;
                });
                resetUpload();
            }
        } catch (err) {
            console.error('[ImageCropperDialog] Export failed:', err);
        } finally {
            setIsExporting(false);
        }
    }, [preset, getCroppedBlob, onConfirm, outputType, outputQuality, resetUpload]);

    // ---- Handle dialog close (cleanup) ------------------------------------
    const handleClose = useCallback(() => {
        setImageSrc((prev) => {
            if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
            return null;
        });
        resetUpload();
        onOpenChange(false);
    }, [onOpenChange, resetUpload]);

    // ---- Derived busy state ----------------------------------------------
    // isUploading is only true in 'server' mode; always false in blob/base64.
    const isBusy = isUploading;

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
                            <h2 className="text-sm font-semibold text-white">{preset?.label || 'Crop Image'}</h2>
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
                                onClick={clearImage}
                                disabled={isExporting || isBusy}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                            >
                                Ganti gambar
                            </button>
                        )}

                        {/* Confirm */}
                        {imageSrc && (
                            <Button
                                type="button"
                                size="sm"
                                disabled={!isReady || isExporting || isBusy}
                                onClick={handleConfirm}
                                className="rounded-lg bg-white text-neutral-900 hover:bg-neutral-200"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2Icon className="size-3.5 animate-spin" />
                                        Mengekspor...
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="size-3.5" />
                                        Terapkan
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
                    {/* Uploading spinner — server mode only */}
                    {isBusy && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3">
                            <Loader2Icon className="size-8 animate-spin text-neutral-400" />
                            <p className="text-sm text-neutral-400">Mengunggah gambar…</p>
                        </div>
                    )}

                    {/* Upload error — server mode only */}
                    {!isBusy && uploadError && !imageSrc && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                            <p className="text-sm text-red-400">{uploadError}</p>
                            <button
                                type="button"
                                onClick={clearImage}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                Coba lagi
                            </button>
                        </div>
                    )}

                    {/* Step 1 — Dropzone */}
                    {!isBusy && !uploadError && !imageSrc && (
                        <div className="flex flex-1 items-center justify-center p-6">
                            <ImageDropzone onImageSelect={handleImageSelect} maxSizeMB={maxSizeMB} className="w-full max-w-md" />
                        </div>
                    )}

                    {/* Step 2–4 — Crop workspace */}
                    {!isBusy && imageSrc && (
                        <div className="flex min-h-0 flex-1 flex-col">
                            <div className="flex min-h-0 flex-1 items-stretch gap-0">
                                <div className="flex min-w-0 flex-1 items-center justify-center p-3 sm:p-4">
                                    <CropperCanvas src={imageSrc} imageRef={imageRef} shape={preset?.shape} className="border-0 bg-transparent" />
                                </div>
                            </div>

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
