/**
 * useTempUpload — Upload an image file to the server temp endpoint
 *
 * Solves the CSP/WAF blob-URL restriction: instead of creating a local
 * `blob:` URL that the browser refuses to load into <img crossOrigin>,
 * we POST the file to `/api/temp-images` and use the returned server
 * URL as the image source for CropperJS.
 *
 * The server stores the file under `storage/app/public/temp/` with a
 * timestamped filename (`{unix_ms}_{uuid}.{ext}`) so a scheduled job
 * can prune files older than 4 hours automatically.
 */

import { useCallback, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TempUploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export interface TempUploadResult {
    /** Public URL returned by the server — safe to set as <img src> */
    url: string;
    /** Opaque filename on the server (used for cleanup reference) */
    filename: string;
}

export interface UseTempUploadReturn {
    /** Current status of the upload */
    status: TempUploadStatus;
    /** Whether an upload is in progress */
    isUploading: boolean;
    /** Error message if status === 'error' */
    error: string | null;
    /** Upload a file and resolve with the server URL */
    upload: (file: File) => Promise<TempUploadResult>;
    /** Reset state back to idle */
    reset: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TEMP_UPLOAD_ENDPOINT = '/api/temp-images';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTempUpload(): UseTempUploadReturn {
    const [status, setStatus] = useState<TempUploadStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const upload = useCallback(async (file: File): Promise<TempUploadResult> => {
        setStatus('uploading');
        setError(null);

        const body = new FormData();
        body.append('image', file);

        // Read CSRF token from the meta tag (standard Laravel/Inertia setup)
        const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        const csrfToken = csrfMeta?.content ?? '';

        try {
            const response = await fetch(TEMP_UPLOAD_ENDPOINT, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body,
            });

            if (!response.ok) {
                let message = `Upload failed (HTTP ${response.status})`;
                try {
                    const json = (await response.json()) as { message?: string };
                    if (json.message) message = json.message;
                } catch {
                    // Ignore parse errors — stick with the generic message
                }
                throw new Error(message);
            }

            const json = (await response.json()) as { url: string; filename: string };

            if (!json.url) {
                throw new Error('Server did not return a URL.');
            }

            setStatus('done');
            return { url: json.url, filename: json.filename };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown upload error';
            setError(message);
            setStatus('error');
            throw err; // Re-throw so the caller can handle it too
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
    }, []);

    return {
        status,
        isUploading: status === 'uploading',
        error,
        upload,
        reset,
    };
}
