/**
 * CropperControls — Toolbar for image manipulation
 *
 * Renders preset selector, zoom, rotate, flip, and reset controls.
 * Uses shadcn Button with lucide-react icons.
 * All controls are disabled when the cropper is not ready.
 */

import { FlipHorizontalIcon, FlipVerticalIcon, RatioIcon, RefreshCwIcon, RotateCcwIcon, RotateCwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
        <div data-slot="cropper-controls" className={cn('flex flex-col gap-3', className)}>
            {/* ---- Preset selector ---- */}
            {presets.length > 1 && (
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Preset</span>
                    <div className="flex flex-wrap gap-1.5">
                        {presets.map((p) => (
                            <Button
                                key={p.key}
                                type="button"
                                size="sm"
                                variant={preset?.key === p.key ? 'default' : 'outline'}
                                disabled={disabled}
                                onClick={() => setPreset(p.key)}
                                aria-pressed={preset?.key === p.key}
                                aria-label={`Preset: ${p.label}`}
                            >
                                {p.label}
                            </Button>
                        ))}

                        {/* Free crop toggle */}
                        <Button
                            type="button"
                            size="sm"
                            variant={preset?.aspectRatio === null ? 'default' : 'ghost'}
                            disabled={disabled}
                            onClick={() => setAspectRatio(null)}
                            aria-label="Free crop (no aspect ratio)"
                        >
                            <RatioIcon className="mr-1 size-3.5" />
                            Free
                        </Button>
                    </div>
                </div>
            )}

            {/* ---- Action buttons ---- */}
            <div className="flex flex-wrap items-center gap-1">
                {/* Zoom */}
                <ControlGroup label="Zoom">
                    <IconButton icon={ZoomInIcon} label="Zoom in" disabled={disabled} onClick={zoomIn} />
                    <IconButton icon={ZoomOutIcon} label="Zoom out" disabled={disabled} onClick={zoomOut} />
                </ControlGroup>

                <Separator />

                {/* Rotate */}
                <ControlGroup label="Rotate">
                    <IconButton icon={RotateCcwIcon} label="Rotate left 90°" disabled={disabled} onClick={rotateLeft} />
                    <IconButton icon={RotateCwIcon} label="Rotate right 90°" disabled={disabled} onClick={rotateRight} />
                </ControlGroup>

                <Separator />

                {/* Flip */}
                <ControlGroup label="Flip">
                    <IconButton icon={FlipHorizontalIcon} label="Flip horizontal" disabled={disabled} onClick={flipX} />
                    <IconButton icon={FlipVerticalIcon} label="Flip vertical" disabled={disabled} onClick={flipY} />
                </ControlGroup>

                <Separator />

                {/* Reset */}
                <IconButton icon={RefreshCwIcon} label="Reset" disabled={disabled} onClick={reset} />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/** Visually groups related controls */
function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div role="group" aria-label={label} className="flex items-center gap-0.5">
            {children}
        </div>
    );
}

/** Thin vertical divider between control groups */
function Separator() {
    return <div aria-hidden className="mx-1 h-6 w-px bg-border" />;
}

/** Icon-only button wired to an action */
function IconButton({
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
        <Button type="button" variant="ghost" size="icon-sm" disabled={disabled} onClick={onClick} aria-label={label} title={label}>
            <Icon className="size-4" />
        </Button>
    );
}
