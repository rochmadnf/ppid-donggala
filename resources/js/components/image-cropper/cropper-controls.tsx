/**
 * CropperControls — Pintura-style bottom toolbar
 *
 * Dark floating toolbar with grouped icon buttons and compact preset pills.
 * Uses shadcn Button with lucide-react icons.
 * All controls are disabled when the cropper is not ready.
 */

import { FlipHorizontalIcon, FlipVerticalIcon, RatioIcon, RotateCcwIcon, RotateCwIcon, UndoIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { CropPreset } from './presets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CropperControlsProps {
    /** Whether the cropper instance is initialised */
    isReady: boolean;
    /** Currently active preset */
    preset: CropPreset | null;
    /** All available presets */
    presets: CropPreset[];

    // -- Callbacks from useCropper --
    setPreset: (key: string) => void;
    setAspectRatio: (ratio: number | null) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    rotateLeft: () => void;
    rotateRight: () => void;
    flipX: () => void;
    flipY: () => void;
    reset: () => void;

    /** Additional class names for the root element */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CropperControls({
    isReady,
    preset,
    presets,
    setPreset,
    setAspectRatio,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
    flipX,
    flipY,
    reset,
    className,
}: CropperControlsProps) {
    const disabled = !isReady;

    return (
        <div data-slot="cropper-controls" className={cn('flex flex-col gap-2.5', className)}>
            {/* ---- Preset selector row (compact pills) ---- */}
            {presets.length > 1 && (
                <div className="flex items-center justify-center gap-1">
                    {presets.map((p) => (
                        <button
                            key={p.key}
                            type="button"
                            disabled={disabled}
                            onClick={() => setPreset(p.key)}
                            aria-pressed={preset?.key === p.key}
                            aria-label={`Preset: ${p.label}`}
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                                'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                                'disabled:pointer-events-none disabled:opacity-40',
                                preset?.key === p.key ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            {p.label}
                        </button>
                    ))}

                    {/* Free crop pill */}
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setAspectRatio(null)}
                        aria-label="Free crop (no aspect ratio)"
                        className={cn(
                            'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                            'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                            'disabled:pointer-events-none disabled:opacity-40',
                            preset?.aspectRatio === null
                                ? 'bg-white text-neutral-900 shadow-sm'
                                : 'text-neutral-400 hover:bg-white/10 hover:text-white',
                        )}
                    >
                        <RatioIcon className="size-3" />
                        Free
                    </button>
                </div>
            )}

            {/* ---- Tool bar (icon buttons in a dark pill) ---- */}
            <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-0.5 rounded-full bg-neutral-800/80 p-1 shadow-lg backdrop-blur-sm">
                    {/* Zoom */}
                    <ToolButton icon={ZoomInIcon} label="Zoom in" disabled={disabled} onClick={zoomIn} />
                    <ToolButton icon={ZoomOutIcon} label="Zoom out" disabled={disabled} onClick={zoomOut} />

                    <ToolDivider />

                    {/* Rotate */}
                    <ToolButton icon={RotateCcwIcon} label="Rotate left 90°" disabled={disabled} onClick={rotateLeft} />
                    <ToolButton icon={RotateCwIcon} label="Rotate right 90°" disabled={disabled} onClick={rotateRight} />

                    <ToolDivider />

                    {/* Flip */}
                    <ToolButton icon={FlipHorizontalIcon} label="Flip horizontal" disabled={disabled} onClick={flipX} />
                    <ToolButton icon={FlipVerticalIcon} label="Flip vertical" disabled={disabled} onClick={flipY} />

                    <ToolDivider />

                    {/* Reset */}
                    <ToolButton icon={UndoIcon} label="Reset" disabled={disabled} onClick={reset} />
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/** Dark circular icon button for the floating toolbar */
function ToolButton({
    icon: Icon,
    label,
    disabled,
    onClick,
}: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
            title={label}
            className={cn(
                'inline-flex size-8 items-center justify-center rounded-full text-neutral-300 transition-colors',
                'hover:bg-white/15 hover:text-white',
                'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-40',
            )}
        >
            <Icon className="size-4" />
        </button>
    );
}

/** Subtle divider dot between tool groups */
function ToolDivider() {
    return <div aria-hidden className="mx-0.5 size-0.5 rounded-full bg-neutral-600" />;
}
