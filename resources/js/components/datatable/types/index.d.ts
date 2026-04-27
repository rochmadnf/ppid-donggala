import type { PaginationMetaProps } from "@/types/pagination";
import type { ColumnDef } from "@tanstack/react-table";

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
};

// Features
// Add
export type AddModeModal = {
    mode: 'modal';
    label?: string;
    title?: string;
    children: React.ReactNode;
};
 
export type AddModeLink = {
    mode: 'link';
    label?: string;
    href: string;
};
// --Add
 
export type AddConfig = AddModeModal | AddModeLink;
