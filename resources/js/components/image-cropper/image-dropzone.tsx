/**
 * ImageDropzone — Drag-and-drop / click-to-upload image picker
 *
 * Accepts JPEG, PNG, and WebP images with optional size validation.
 * Fully accessible (keyboard, screen reader, mobile-friendly).
 */

import { ImageIcon, UploadCloudIcon, XCircleIcon } from 'lucide-react';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPT_STRING = ACCEPTED_TYPES.join(',');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageDropzoneProps {
    /** Callback when a valid image file is selected */
    onImageSelect: (file: File) => void;
    /** Maximum file size in megabytes (default: 5) */
    maxSizeMB?: number;
    /** Disable the dropzone */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageDropzone({ onImageSelect, maxSizeMB = 5, disabled = false, className }: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ---- Validation -------------------------------------------------------
    const validate = useCallback(
        (file: File): string | null => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                return 'Invalid file type. Only JPEG, PNG, and WebP are accepted.';
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                return `File too large. Maximum size is ${maxSizeMB} MB.`;
            }
            return null;
        },
        [maxSizeMB],
    );

    const handleFile = useCallback(
        (file: File) => {
            const err = validate(file);
            if (err) {
                setError(err);
                return;
            }
            setError(null);
            onImageSelect(file);
        },
        [validate, onImageSelect],
    );

    // ---- Drag & drop handlers ---------------------------------------------
    const onDragEnter = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) setIsDragOver(true);
        },
        [disabled],
    );

    const onDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) setIsDragOver(true);
        },
        [disabled],
    );

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            if (disabled) return;

            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        [disabled, handleFile],
    );

    // ---- Click / keyboard handler -----------------------------------------
    const onClick = useCallback(() => {
        if (!disabled) inputRef.current?.click();
    }, [disabled]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        },
        [onClick],
    );

    const onInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset so the same file can be re-selected
            e.target.value = '';
        },
        [handleFile],
    );

    // ---- Render -----------------------------------------------------------
    return (
        <div
            data-slot="image-dropzone"
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Upload an image by dragging and dropping or clicking"
            aria-disabled={disabled}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
                'relative flex min-h-50 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                isDragOver && !disabled && 'border-primary bg-primary/5',
                !isDragOver && !disabled && 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
                disabled && 'pointer-events-none opacity-50',
                className,
            )}
        >
            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_STRING}
                className="sr-only"
                onChange={onInputChange}
                tabIndex={-1}
                aria-hidden
                disabled={disabled}
            />

            {/* Icon & text */}
            <div className="flex flex-col items-center gap-2">
                {isDragOver ? (
                    <UploadCloudIcon className="size-10 text-primary" aria-hidden />
                ) : (
                    <ImageIcon className="size-10 text-muted-foreground" aria-hidden />
                )}

                <p className="text-sm font-medium">{isDragOver ? 'Drop your image here' : 'Drag & drop an image, or click to browse'}</p>

                <p className="text-xs text-muted-foreground">JPEG, PNG, WebP — max {maxSizeMB} MB</p>
            </div>

            {/* Error message */}
            {error && (
                <div role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                    <XCircleIcon className="size-3.5 shrink-0" aria-hidden />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
