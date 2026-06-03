// src/components/combobox/types.ts

import type { ReactNode } from 'react';

export type Option = {
    id: string;
    label: string;
    meta?: Record<string, unknown>;
};

export type CreateMode = 'inline' | 'modal';

export interface CreateFormProps {
    query: string;
    onSubmit: (option: Option) => void;
    onCancel: () => void;
}

export interface ComboBoxProps {
    value?: string | string[];
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    creatable?: boolean;
    deletable?: boolean;
    createMode?: CreateMode;
    loading?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    debounceDelay?: number;
    onChange?: (value: Option | Option[] | null) => void;
    onSearch?: (query: string) => Promise<void>;
    onCreate?: (value: string) => Promise<Option>;
    onDelete?: (item: Option) => Promise<void>;
    renderOption?: (option: Option) => ReactNode;
    renderCreateForm?: (props: CreateFormProps) => ReactNode;
    filterFn?: (option: Option, query: string) => boolean;
}

export interface ComboBoxContextValue {
    open: boolean;
    query: string;
    selectedOptions: Option[];
    filteredOptions: Option[];
    activeIndex: number;
    isLoading: boolean;
    deletingIds: Set<string>;
    isCreating: boolean;
    showCreateModal: boolean;
    multiple: boolean;
    creatable: boolean;
    deletable: boolean;
    createMode: CreateMode;
    searchable: boolean;
    setOpen: (open: boolean) => void;
    setQuery: (query: string) => void;
    setActiveIndex: (index: number) => void;
    selectOption: (option: Option) => void;
    removeOption: (option: Option) => void;
    clearAll: () => void;
    handleCreate: (value: string) => Promise<void>;
    handleDelete: (item: Option) => Promise<void>;
    setShowCreateModal: (show: boolean) => void;
    renderOption?: (option: Option) => ReactNode;
    renderCreateForm?: (props: CreateFormProps) => ReactNode;
}
