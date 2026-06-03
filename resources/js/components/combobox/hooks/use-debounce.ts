import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounces a value — only updates after `delay` ms of inactivity.
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Debounced callback — returns a stable function that only fires
 * after `delay` ms of no new calls.
 *
 * @example
 * const debouncedSearch = useDebouncedCallback(onSearch, 300);
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T, delay = 300): (...args: Parameters<T>) => void {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fnRef = useRef(fn);
    const delayRef = useRef(delay); // ← tambah ref untuk delay

    useEffect(() => {
        fnRef.current = fn;
    });

    // Sync delay setiap render
    useEffect(() => {
        delayRef.current = delay;
    }, [delay]);

    return useCallback((...args: Parameters<T>) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            fnRef.current(...args);
        }, delayRef.current);
    }, []);
}
