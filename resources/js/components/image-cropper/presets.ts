/**
 * Crop Preset System
 *
 * Defines the shape and configuration of image cropping presets.
 * Supports built-in presets (avatar, og-image) and custom user presets.
 * Custom presets can override built-in ones by matching the `key`.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CropPreset = {
    /** Unique identifier used for selection and merging */
    key: string;
    /** Human-readable label shown in the UI */
    label: string;
    /** Aspect ratio constraint (`null` = free crop) */
    aspectRatio: number | null;
    /** Visual shape of the crop area */
    shape: 'circle' | 'rect';
    /** Output canvas width in pixels */
    outputWidth: number;
    /** Output canvas height in pixels */
    outputHeight: number;
    /** Minimum acceptable width in pixels */
    minWidth?: number;
    /** Minimum acceptable height in pixels */
    minHeight?: number;
};

// ---------------------------------------------------------------------------
// Built-in Presets
// ---------------------------------------------------------------------------

export const BUILT_IN_PRESETS: CropPreset[] = [
    {
        key: 'avatar',
        label: 'Avatar',
        aspectRatio: 1,
        shape: 'circle',
        outputWidth: 256,
        outputHeight: 256,
        minWidth: 256,
        minHeight: 256,
    },
    {
        key: 'og-image',
        label: 'OG Image',
        aspectRatio: 1200 / 630,
        shape: 'rect',
        outputWidth: 1200,
        outputHeight: 630,
        minWidth: 600,
        minHeight: 315,
    },
];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Merge custom presets with built-in presets.
 * Custom presets with the same `key` override built-in ones.
 * New custom presets are appended at the end.
 */
export function mergePresets(builtIn: CropPreset[], custom: CropPreset[] = []): CropPreset[] {
    const merged = [...builtIn];

    for (const preset of custom) {
        const existingIndex = merged.findIndex((p) => p.key === preset.key);

        if (existingIndex >= 0) {
            // Override existing preset
            merged[existingIndex] = preset;
        } else {
            // Append new preset
            merged.push(preset);
        }
    }

    return merged;
}

/**
 * Find a preset by its key from a list of presets.
 */
export function getPreset(presets: CropPreset[], key: string): CropPreset | undefined {
    return presets.find((p) => p.key === key);
}
