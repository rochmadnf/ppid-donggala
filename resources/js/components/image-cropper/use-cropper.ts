/**
 * useCropper — Core Hook
 *
 * Manages the CropperJS v2 instance lifecycle, preset configuration,
 * and exposes a UI-agnostic API for image cropping operations.
 *
 * Responsibilities:
 *  - Initialise / destroy CropperJS on image load / unmount
 *  - Apply and switch presets dynamically
 *  - Provide zoom, rotate, flip, reset actions
 *  - Generate cropped output (canvas / blob)
 *  - Enforce selection boundary constraints (canvas / image / none)
 *
 * SSR Safety:
 *  - `cropperjs` (and its `@cropper/element` dep) access `HTMLElement` at
 *    module-load time, which crashes Node.js SSR.
 *  - Fix: use a *dynamic* `import('cropperjs')` inside the `useEffect` so
 *    the module is only evaluated in the browser, never on the server.
 */

import type Cropper from 'cropperjs';
import type { CropperImage, CropperSelection } from 'cropperjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BUILT_IN_PRESETS, type CropPreset, getPreset, mergePresets } from './presets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WithinMode = 'canvas' | 'image' | 'none';

export interface UseCropperOptions {
    /** Image source URL (blob URL, data URL, or remote URL) */
    imageSrc: string | null;
    /** Key of the preset to apply on init (defaults to first available) */
    defaultPreset?: string;
    /** Additional presets merged with built-ins */
    customPresets?: CropPreset[];
    /**
     * Boundary constraint mode.
     * - 'canvas'  : selection stays within the cropper canvas (default)
     * - 'image'   : selection stays within the image (even when transformed)
     * - 'none'    : no constraint
     */
    within?: WithinMode;
}

export interface UseCropperReturn {
    /** Ref to attach to the <img> element rendered by CropperCanvas */
    imageRef: React.RefObject<HTMLImageElement | null>;
    /** Raw CropperJS instance (null until ready) */
    cropper: Cropper | null;
    /** Whether the cropper is fully initialised */
    isReady: boolean;
    /** Currently active preset */
    preset: CropPreset | null;
    /** All available presets (built-in + custom) */
    presets: CropPreset[];
    /** Monotonic counter that increments on every programmatic change */
    changeVersion: number;
    /** Current boundary constraint mode */
    within: WithinMode;
    /** Update boundary constraint mode at runtime */
    setWithin: (mode: WithinMode) => void;
    /** Force cropper layout reflow + recenter (useful after dynamic layout changes) */
    reflow: () => void;

    // -- Preset --
    setPreset: (key: string) => void;

    // -- Actions --
    centerImage: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    rotateLeft: () => void;
    rotateRight: () => void;
    rotateTo: (degrees: number) => void;
    flipX: () => void;
    flipY: () => void;
    setAspectRatio: (ratio: number | null) => void;
    reset: () => void;

    // -- Output --
    getCroppedCanvas: () => Promise<HTMLCanvasElement | null>;
    getCroppedBlob: (type?: string, quality?: number) => Promise<Blob | null>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default template with movable + resizable selection */
const CROPPER_TEMPLATE = `
  <cropper-canvas background>
    <cropper-image rotatable scalable translatable></cropper-image>
    <cropper-shade hidden></cropper-shade>
    <cropper-handle action="select" plain></cropper-handle>
    <cropper-selection initial-coverage="0.8" movable resizable zoomable>
      <cropper-grid role="grid" covered></cropper-grid>
      <cropper-crosshair centered></cropper-crosshair>
      <cropper-handle action="move" theme-color="rgba(255,255,255,0.35)"></cropper-handle>
      <cropper-handle action="n-resize"></cropper-handle>
      <cropper-handle action="e-resize"></cropper-handle>
      <cropper-handle action="s-resize"></cropper-handle>
      <cropper-handle action="w-resize"></cropper-handle>
      <cropper-handle action="ne-resize"></cropper-handle>
      <cropper-handle action="nw-resize"></cropper-handle>
      <cropper-handle action="se-resize"></cropper-handle>
      <cropper-handle action="sw-resize"></cropper-handle>
    </cropper-selection>
  </cropper-canvas>
`;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCropper({ imageSrc, defaultPreset, customPresets = [], within: initialWithin = 'image' }: UseCropperOptions): UseCropperReturn {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<Cropper | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [activePresetKey, setActivePresetKey] = useState(defaultPreset ?? '');
    const [changeVersion, setChangeVersion] = useState(0);
    const [within, setWithin] = useState<WithinMode>(initialWithin);
    const refreshImageBoundsRef = useRef<(() => void) | null>(null);
    const isResettingRef = useRef(false);

    /**
     * Keep a ref in sync with `within` so that event listeners (which close
     * over the ref) always read the latest value without needing to be
     * re-registered whenever the mode changes.
     */
    const withinRef = useRef<WithinMode>(within);
    useEffect(() => {
        withinRef.current = within;
    }, [within]);

    // ---- Merged presets (memoised) ----------------------------------------
    const allPresets = useMemo(() => mergePresets(BUILT_IN_PRESETS, customPresets), [customPresets]);

    const activePreset = useMemo(() => {
        if (activePresetKey) {
            return getPreset(allPresets, activePresetKey) ?? allPresets[0] ?? null;
        }
        return allPresets[0] ?? null;
    }, [allPresets, activePresetKey]);

    // ---- Notify helper (bumps change counter) -----------------------------
    const notifyChange = useCallback(() => setChangeVersion((v) => v + 1), []);

    // ---- Apply circle shape mask to selection -----------------------------
    const applyShapeMask = useCallback((selection: CropperSelection | null, shape: 'circle' | 'rect') => {
        if (!selection) return;
        const el = selection as unknown as HTMLElement;
        if (shape === 'circle') {
            el.style.borderRadius = '50%';
            el.style.overflow = 'hidden';
        } else {
            el.style.borderRadius = '';
            el.style.overflow = '';
        }
    }, []);

    // ---- Force reflow helper ---------------------------------------------
    const reflow = useCallback(() => {
        const cropper = cropperRef.current;
        const img = imageRef.current;
        if (!cropper || !img) return;

        const canvasHost = cropper.getCropperCanvas() as unknown as HTMLElement | null;
        const parent = img.parentElement;

        if (canvasHost && parent) {
            const width = parent.clientWidth;
            const height = parent.clientHeight;

            if (width > 0 && height > 0) {
                canvasHost.style.display = 'block';
                canvasHost.style.width = `${width}px`;
                canvasHost.style.height = `${height}px`;
                canvasHost.style.minWidth = '0';
                canvasHost.style.minHeight = '0';
            }
        }

        const image = cropper.getCropperImage();
        const selection = cropper.getCropperSelection();
        image?.$center('contain');
        selection?.$center();
        refreshImageBoundsRef.current?.();
        notifyChange();
    }, [notifyChange]);

    // ---- Boundary helpers -------------------------------------------------

    /**
     * Returns true when `inner` is fully contained within `outer`.
     * Both rects are expected to be raw DOMRect values.
     * `canvasRect` is used to translate absolute page coordinates into
     * canvas-local coordinates (mirrors the Vue inSelection helper).
     */
    const inBounds = useCallback((innerRect: DOMRect, outerRect: DOMRect, canvasRect: DOMRect): boolean => {
        const epsilon = 1.5;
        const innerX = innerRect.left - canvasRect.left;
        const innerY = innerRect.top - canvasRect.top;
        const outerX = outerRect.left - canvasRect.left;
        const outerY = outerRect.top - canvasRect.top;

        return (
            innerX >= outerX - epsilon &&
            innerY >= outerY - epsilon &&
            innerX + innerRect.width <= outerX + outerRect.width + epsilon &&
            innerY + innerRect.height <= outerY + outerRect.height + epsilon
        );
    }, []);

    // ---- Init / destroy CropperJS on image change -------------------------
    useEffect(() => {
        const img = imageRef.current;
        if (!img || !imageSrc) {
            setIsReady(false);
            return;
        }

        let cancelled = false;

        // Store cleanup references so we can remove them in the effect teardown
        let boundSelectionChange: ((e: Event) => void) | null = null;
        let boundImageTransform: ((e: Event) => void) | null = null;
        let selectionEl: HTMLElement | null = null;
        let imageEl: HTMLElement | null = null;
        let resizeObserver: ResizeObserver | null = null;

        // dynamic import keeps @cropper/element out of SSR
        import('cropperjs').then(({ default: Cropper }) => {
            if (cancelled) return;

            const cropperInstance = new Cropper(img, {
                template: CROPPER_TEMPLATE,
            });

            cropperRef.current = cropperInstance;

            const onReady = () => {
                if (cancelled) return;

                const selection = cropperInstance.getCropperSelection();
                const canvas = cropperInstance.getCropperCanvas() as unknown as HTMLElement | null;
                selectionEl = selection as unknown as HTMLElement | null;
                imageEl = cropperInstance.getCropperImage() as unknown as HTMLElement | null;

                // Apply initial preset
                if (activePreset && selection) {
                    selection.aspectRatio = activePreset.aspectRatio ?? NaN;
                    applyShapeMask(selection, activePreset.shape);
                }

                // Force initial layout
                if (canvas && img.parentElement) {
                    const parent = img.parentElement;
                    const w = parent.clientWidth;
                    const h = parent.clientHeight;
                    if (w > 0 && h > 0) {
                        (canvas as HTMLElement).style.width = `${w}px`;
                        (canvas as HTMLElement).style.height = `${h}px`;
                    }
                }

                selection?.$center();

                // ---- Boundary constraint listener (image / canvas mode) ---
                const handleSelectionChange = (e: Event) => {
                    if (isResettingRef.current) return;
                    const mode = withinRef.current;
                    if (mode === 'none') return;

                    const cropperCanvas = cropperInstance.getCropperCanvas();
                    const cropperImage = cropperInstance.getCropperImage();
                    const cropperSelection = cropperInstance.getCropperSelection();
                    if (!cropperCanvas || !cropperImage || !cropperSelection) return;

                    const canvasRect = (cropperCanvas as unknown as HTMLElement).getBoundingClientRect();
                    const targetRect = (
                        mode === 'image' ? (cropperImage as unknown as HTMLElement) : (cropperCanvas as unknown as HTMLElement)
                    ).getBoundingClientRect();
                    const selRect = (cropperSelection as unknown as HTMLElement).getBoundingClientRect();

                    if (!inBounds(selRect, targetRect, canvasRect)) {
                        e.preventDefault();
                    }
                };

                boundSelectionChange = handleSelectionChange;

                if (selectionEl) {
                    selectionEl.addEventListener('change', handleSelectionChange);
                }

                // ---- Track image transforms for 'image' boundary mode ----
                const handleImageTransform = () => {
                    refreshImageBoundsRef.current?.();
                };
                boundImageTransform = handleImageTransform;
                if (imageEl) {
                    imageEl.addEventListener('transform', handleImageTransform);
                }

                // ---- ResizeObserver: reflow on container resize ----------
                const parent = img.parentElement;
                if (parent && canvas) {
                    resizeObserver = new ResizeObserver(() => {
                        if (!cancelled) reflow();
                    });
                    resizeObserver.observe(parent);
                }

                setIsReady(true);
                notifyChange();
            };

            img.addEventListener('ready', onReady, { once: true });
        });

        return () => {
            cancelled = true;

            // Remove event listeners
            if (selectionEl && boundSelectionChange) {
                selectionEl.removeEventListener('change', boundSelectionChange);
            }
            if (imageEl && boundImageTransform) {
                imageEl.removeEventListener('transform', boundImageTransform);
            }

            // Disconnect ResizeObserver
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
            refreshImageBoundsRef.current = null;

            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }
            setIsReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageSrc]);

    // ---- Stabilise first render after upload (like HMR/save effect) -----
    useEffect(() => {
        if (!isReady || !imageSrc) return;

        let raf1 = 0;
        let raf2 = 0;
        const timeoutId = setTimeout(() => {
            reflow();
        }, 80);

        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                reflow();
            });
        });

        return () => {
            clearTimeout(timeoutId);
            if (raf1) cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
        };
    }, [isReady, imageSrc, reflow]);

    // ---- React to preset changes ------------------------------------------
    useEffect(() => {
        if (!isReady || !cropperRef.current || !activePreset) return;

        const selection = cropperRef.current.getCropperSelection();
        if (selection) {
            selection.aspectRatio = activePreset.aspectRatio ?? NaN;
            applyShapeMask(selection, activePreset.shape);
            selection.$center();
        }

        notifyChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePreset?.key, isReady]);

    // ---- Preset setter ----------------------------------------------------
    const setPreset = useCallback((key: string) => {
        setActivePresetKey(key);
    }, []);

    // ---- Convenience accessors for image / selection ----------------------
    const getImage = useCallback((): CropperImage | null => {
        return cropperRef.current?.getCropperImage() ?? null;
    }, []);

    const getSelection = useCallback((): CropperSelection | null => {
        return cropperRef.current?.getCropperSelection() ?? null;
    }, []);

    const centerImage = useCallback(() => {
        getImage()?.$center('contain');
        notifyChange();
    }, [getImage, notifyChange]);

    // ---- Actions ----------------------------------------------------------
    const zoomIn = useCallback(() => {
        getImage()?.$zoom(0.1);
        notifyChange();
    }, [getImage, notifyChange]);

    const zoomOut = useCallback(() => {
        getImage()?.$zoom(-0.1);
        notifyChange();
    }, [getImage, notifyChange]);

    const rotateLeft = useCallback(() => {
        getImage()?.$rotate('-90deg');
        notifyChange();
    }, [getImage, notifyChange]);

    const rotateRight = useCallback(() => {
        getImage()?.$rotate('90deg');
        notifyChange();
    }, [getImage, notifyChange]);

    const rotateTo = useCallback(
        (degrees: number) => {
            const image = getImage();
            if (!image) return;
            image.$resetTransform();
            image.$rotate(`${degrees}deg`);
            image.$center('contain');
            notifyChange();
        },
        [getImage, notifyChange],
    );

    const flipX = useCallback(() => {
        getImage()?.$scale(-1, 1);
        notifyChange();
    }, [getImage, notifyChange]);

    const flipY = useCallback(() => {
        getImage()?.$scale(1, -1);
        notifyChange();
    }, [getImage, notifyChange]);

    const setAspectRatio = useCallback(
        (ratio: number | null) => {
            const selection = getSelection();
            if (selection) {
                selection.aspectRatio = ratio ?? NaN;
                selection.$center();
                notifyChange();
            }
        },
        [getSelection, notifyChange],
    );

    const reset = useCallback(() => {
        const image = getImage();
        const selection = getSelection();
        isResettingRef.current = true;
        image?.$resetTransform();
        image?.$center('contain');
        selection?.$reset();
        selection?.$center();

        // Re-apply shape mask after reset
        if (activePreset) {
            applyShapeMask(selection, activePreset.shape);
        }

        reflow();

        requestAnimationFrame(() => {
            isResettingRef.current = false;
        });
    }, [getImage, getSelection, activePreset, applyShapeMask, reflow]);

    // ---- Output helpers ---------------------------------------------------

    /**
     * Returns a canvas element with the cropped image.
     * If the active preset uses circle shape, the output is clipped to a circle.
     */
    const getCroppedCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
        const selection = getSelection();
        if (!selection || !activePreset) return null;

        const { outputWidth: w, outputHeight: h, shape } = activePreset;

        const canvas = await selection.$toCanvas({ width: w, height: h });

        // Apply circular clip for circle-shaped presets
        if (shape === 'circle') {
            const circleCanvas = document.createElement('canvas');
            circleCanvas.width = w;
            circleCanvas.height = h;
            const ctx = circleCanvas.getContext('2d');
            if (!ctx) return canvas;

            ctx.beginPath();
            ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(canvas, 0, 0, w, h);

            return circleCanvas;
        }

        return canvas;
    }, [getSelection, activePreset]);

    /**
     * Returns a Blob of the cropped image.
     * @param type  MIME type (default: image/png)
     * @param quality  Quality between 0 and 1 (relevant for image/jpeg, image/webp)
     */
    const getCroppedBlob = useCallback(
        async (type = 'image/png', quality = 0.92): Promise<Blob | null> => {
            const canvas = await getCroppedCanvas();
            if (!canvas) return null;

            return new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to create blob from cropped canvas'))), type, quality);
            });
        },
        [getCroppedCanvas],
    );

    // ---- Return public API ------------------------------------------------
    return {
        imageRef,
        cropper: isReady ? cropperRef.current : null,
        isReady,
        preset: activePreset,
        presets: allPresets,
        changeVersion,
        within,
        setWithin,
        reflow,

        setPreset,

        centerImage,
        zoomIn,
        zoomOut,
        rotateLeft,
        rotateRight,
        rotateTo,
        flipX,
        flipY,
        setAspectRatio,
        reset,

        getCroppedCanvas,
        getCroppedBlob,
    };
}
