import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createContext, useContext, useId } from 'react';
import { ComboBoxTrigger } from './combobox-trigger';
import { useComboBox } from './hooks/use-combobox';
import { ComboBoxContent } from './parts/combobox-content';
import type { ComboBoxContextValue, ComboBoxProps, CreateFormProps } from './types';

// ── Context ──────────────────────────────────────────────────
const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);

export function useComboBoxContext(): ComboBoxContextValue {
    const ctx = useContext(ComboBoxContext);
    if (!ctx) throw new Error('useComboBoxContext must be used inside <ComboBox>');
    return ctx;
}

// ── Root Component ────────────────────────────────────────────
export function ComboBox({
    value,
    options,
    placeholder = 'Select…',
    searchable = true,
    creatable = false,
    deletable = false,
    createMode = 'inline',
    loading = false,
    multiple = false,
    disabled = false,
    debounceDelay = 350,
    onChange,
    onSearch,
    onCreate,
    onDelete,
    renderOption,
    renderCreateForm,
    filterFn,
    className,
}: ComboBoxProps) {
    const id = useId();

    const state = useComboBox({
        value,
        options,
        searchable,
        creatable,
        deletable,
        createMode,
        loading,
        multiple,
        disabled,
        debounceDelay,
        onChange,
        onSearch,
        onCreate,
        onDelete,
        filterFn,
    });

    const contextValue: ComboBoxContextValue = {
        ...state,
        renderOption,
        renderCreateForm,
    };

    return (
        <ComboBoxContext.Provider value={contextValue}>
            <Popover open={state.open} onOpenChange={(o) => !disabled && state.setOpen(o)}>
                <PopoverTrigger asChild disabled={disabled}>
                    <ComboBoxTrigger
                        placeholder={placeholder}
                        disabled={disabled}
                        className={className}
                        aria-haspopup="listbox"
                        aria-expanded={state.open}
                        aria-controls={`combobox-listbox-${id}`}
                        aria-label={placeholder}
                    />
                </PopoverTrigger>

                <PopoverContent
                    className="p-0"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                    align="start"
                    sideOffset={6}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <ComboBoxContent id={`combobox-listbox-${id}`} />
                </PopoverContent>
            </Popover>

            {/* Modal Create Dialog */}
            {createMode === 'modal' && (
                <Dialog open={state.showCreateModal} onOpenChange={state.setShowCreateModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Data Baru</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        {renderCreateForm?.({
                            query: state.query,
                            onSubmit: async (option) => {
                                state.setShowCreateModal(false);
                                // Add to list and select
                                state.selectOption(option);
                            },
                            onCancel: () => state.setShowCreateModal(false),
                        } satisfies CreateFormProps)}
                    </DialogContent>
                </Dialog>
            )}
        </ComboBoxContext.Provider>
    );
}
