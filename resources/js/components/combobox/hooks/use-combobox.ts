import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import type { ComboBoxProps, Option } from '../types';
import { useDebouncedCallback } from './use-debounce';

const DEFAULT_FILTER = (option: Option, query: string): boolean => option.label.toLowerCase().includes(query.toLowerCase());

export function useComboBox({
    name,
    value,
    options: externalOptions,
    multiple = false,
    creatable = false,
    deletable = false,
    createMode = 'inline',
    searchable = true,
    loading: externalLoading = false,
    onChange,
    onSearch,
    onCreate,
    onDelete,
    filterFn = DEFAULT_FILTER,
    debounceDelay = 350,
}: ComboBoxProps) {
    // ── Popover open state ──────────────────────────────────────
    const [open, setOpenState] = useState(false);

    // ── Query (search input) ────────────────────────────────────
    const [query, setQueryState] = useState('');

    // ── Internal options list (may grow after creates) ──────────
    const [internalOptions, setInternalOptions] = useState<Option[]>(externalOptions);

    // Sync external options
    useEffect(() => {
        setInternalOptions(externalOptions);
    }, [externalOptions]);

    useEffect(() => {
        if (!value) return;
        const ids = Array.isArray(value) ? value : [value];
        const matched = externalOptions.filter((o) => ids.includes(o.id));
        if (matched.length > 0) {
            setSelectedOptions(matched);
        }
    }, [externalOptions, value]);

    // ── Selection state ─────────────────────────────────────────
    const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
        if (!value) return [];
        const ids = Array.isArray(value) ? value : [value];
        return externalOptions.filter((o) => ids.includes(o.id));
    });

    // ── Active highlighted index ─────────────────────────────────
    const [activeIndex, setActiveIndex] = useState(-1);

    // ── Loading states ───────────────────────────────────────────
    const [isSearching, startSearch] = useTransition();
    const [isCreating, setIsCreating] = useState(false);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // ── Modal state (modal create mode) ─────────────────────────
    const [showCreateModal, setShowCreateModal] = useState(false);

    // ── Combined loading ─────────────────────────────────────────
    const isLoading = externalLoading || isSearching;

    // ── Filtered options ─────────────────────────────────────────
    const filteredOptions = useMemo(() => {
        if (!query.trim()) return internalOptions;
        return internalOptions.filter((o) => filterFn(o, query));
    }, [internalOptions, query, filterFn]);

    // ── Reset active index when filtered list changes ─────────────
    useEffect(() => {
        setActiveIndex(-1);
    }, [query]);

    // ── Debounced remote search ──────────────────────────────────
    const debouncedSearch = useDebouncedCallback(async (q: string) => {
        if (!onSearch) return;
        startSearch(async () => await onSearch(q));
    }, debounceDelay);

    // ── Open/close helpers ───────────────────────────────────────
    const setOpen = useCallback((next: boolean) => {
        setOpenState(next);
        if (!next) {
            setQueryState('');
            setActiveIndex(-1);
        }
    }, []);

    // ── Query change ─────────────────────────────────────────────
    const setQuery = useCallback(
        (q: string) => {
            setQueryState(q);
            if (onSearch) debouncedSearch(q);
        },
        [onSearch, debouncedSearch],
    );

    // ── Selection ────────────────────────────────────────────────
    const selectOption = useCallback(
        (option: Option) => {
            let next: Option[];
            if (multiple) {
                const already = selectedOptions.some((o) => o.id === option.id);
                next = already ? selectedOptions.filter((o) => o.id !== option.id) : [...selectedOptions, option];
            } else {
                next = [option];
                setOpen(false);
            }
            setSelectedOptions(next);
            onChange?.(multiple ? next : (next[0] ?? null));
        },
        [multiple, selectedOptions, onChange, setOpen],
    );

    const removeOption = useCallback(
        (option: Option) => {
            const next = selectedOptions.filter((o) => o.id !== option.id);
            setSelectedOptions(next);
            onChange?.(multiple ? next : (next[0] ?? null));
        },
        [multiple, selectedOptions, onChange],
    );

    const clearAll = useCallback(() => {
        setSelectedOptions([]);
        onChange?.(multiple ? [] : null);
    }, [multiple, onChange]);

    // ── Create ───────────────────────────────────────────────────
    const handleCreate = useCallback(
        async (value: string) => {
            if (!onCreate) return;
            setIsCreating(true);
            try {
                const newOption = await onCreate(value);
                setInternalOptions((prev) => [...prev, newOption]);
                selectOption(newOption);
                setQueryState('');
            } catch (err) {
                console.error('[ComboBox] onCreate error:', err);
            } finally {
                setIsCreating(false);
            }
        },
        [onCreate, selectOption],
    );

    // ── Delete ───────────────────────────────────────────────────
    const handleDelete = useCallback(
        async (item: Option) => {
            if (!onDelete) return;
            setDeletingIds((prev) => new Set(prev).add(item.id));
            try {
                await onDelete(item);
                setInternalOptions((prev) => prev.filter((o) => o.id !== item.id));
                setSelectedOptions((prev) => prev.filter((o) => o.id !== item.id));
            } catch (err) {
                console.error('[ComboBox] onDelete error:', err);
            } finally {
                setDeletingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                });
            }
        },
        [onDelete],
    );

    return {
        // State
        open,
        query,
        selectedOptions,
        filteredOptions,
        activeIndex,
        isLoading,
        isCreating,
        deletingIds,
        showCreateModal,

        // Derived
        internalOptions,
        multiple,
        creatable,
        deletable,
        createMode,
        searchable,

        // Actions
        setOpen,
        setQuery,
        setActiveIndex,
        selectOption,
        removeOption,
        clearAll,
        handleCreate,
        handleDelete,
        setShowCreateModal,
    };
}
