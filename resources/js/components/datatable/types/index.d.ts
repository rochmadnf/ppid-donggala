import type { PaginationMetaProps } from '@/types/pagination';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type RequestParams = Record<string, string | number | boolean | null | undefined>;

export type DataTableProps<T> = {
    data: T[];
    metadata: PaginationMetaProps;
    columns: ColumnDef<T>[];
    routeName: string;
    keepCurrentUrl?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchBy?: string;
    toolbarRight?: ReactNode;
};