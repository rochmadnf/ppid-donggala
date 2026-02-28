import Compressor from 'compressorjs';
import { useCallback, useRef, useState } from 'react';

type CompressorOptions = Omit<Compressor.Options, 'success' | 'error'>;

interface UseImageCompressorReturn {
    compressFile: (file: File, overrideOptions?: CompressorOptions) => Promise<File>;
    compressFiles: (files: File[], overrideOptions?: CompressorOptions) => Promise<File[]>;
    isCompressing: boolean;
    error: Error | null;
}

const DEFAULT_OPTIONS: CompressorOptions = {
    quality: 0.8,
    maxWidth: Infinity,
    maxHeight: Infinity,
    convertSize: 5_000_000,
};

function compressWithPromise(file: File, options: CompressorOptions): Promise<File> {
    return new Promise<File>((resolve, reject) => {
        new Compressor(file, {
            ...options,
            mimeType: options.mimeType ?? file.type,
            success(result) {
                if (result instanceof File) {
                    resolve(result);
                } else {
                    // CompressorJS may return a Blob; convert it to a File
                    resolve(new File([result], file.name, { type: result.type }));
                }
            },
            error(err) {
                reject(err);
            },
        });
    });
}

export function useImageCompressor(defaultOptions?: CompressorOptions): UseImageCompressorReturn {
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const activeRef = useRef(0);

    const compressFile = useCallback(
        async (file: File, overrideOptions?: CompressorOptions): Promise<File> => {
            const mergedOptions: CompressorOptions = {
                ...DEFAULT_OPTIONS,
                ...defaultOptions,
                ...overrideOptions,
            };

            activeRef.current += 1;
            setIsCompressing(true);
            setError(null);

            try {
                return await compressWithPromise(file, mergedOptions);
            } catch (err) {
                const compressError = err instanceof Error ? err : new Error(String(err));
                setError(compressError);
                throw compressError;
            } finally {
                activeRef.current -= 1;
                if (activeRef.current === 0) {
                    setIsCompressing(false);
                }
            }
        },
        [defaultOptions],
    );

    const compressFiles = useCallback(
        async (files: File[], overrideOptions?: CompressorOptions): Promise<File[]> => {
            const mergedOptions: CompressorOptions = {
                ...DEFAULT_OPTIONS,
                ...defaultOptions,
                ...overrideOptions,
            };

            activeRef.current += 1;
            setIsCompressing(true);
            setError(null);

            try {
                const results: File[] = [];

                // Sequential compression — one file at a time
                for (const file of files) {
                    const compressed = await compressWithPromise(file, mergedOptions);
                    results.push(compressed);
                }

                return results;
            } catch (err) {
                const compressError = err instanceof Error ? err : new Error(String(err));
                setError(compressError);
                throw compressError;
            } finally {
                activeRef.current -= 1;
                if (activeRef.current === 0) {
                    setIsCompressing(false);
                }
            }
        },
        [defaultOptions],
    );

    return { compressFile, compressFiles, isCompressing, error };
}
