import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { PaginationMetaProps } from '@/types/pagination';
import { router } from '@inertiajs/react';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState } from '@tanstack/react-table';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, DatabaseZapIcon, SearchXIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type RequestParams = Record<string, string | number | boolean | null | undefined>;

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

export function DataTable<T>({
    data,
    metadata,
    columns,
    routeName,
    keepCurrentUrl = false,
    searchable = false,
    searchPlaceholder = 'Cari...',
    searchBy = 'name',
}: DataTableProps<T>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: metadata.current_page - 1,
        pageSize: metadata.per_page,
    });

    const [search, setSearch] = useState<string>(() => {
        return new URLSearchParams(window.location.search).get('keyword') || '';
    });

    useEffect(() => {
        setPagination({
            pageIndex: metadata.current_page - 1,
            pageSize: metadata.per_page,
        });
    }, [metadata.current_page, metadata.per_page]);

    const sendRequest = (overrides: RequestParams = {}) => {
        const params: RequestParams = {
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
        };

        if (search) {
            params.keyword = search;
            if (searchBy) params.search_by = searchBy;
        }

        router.get(
            route(routeName),
            { ...params, ...overrides },
            {
                preserveUrl: keepCurrentUrl,
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = useDebouncedCallback((value: string) => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        sendRequest({
            keyword: value || undefined,
            search_by: searchBy || undefined,
            page: 1,
        });
    }, 500);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const onSearchReset = () => {
        setSearch('');
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        sendRequest({
            keyword: undefined,
            search_by: undefined,
            page: 1,
        });
    };

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: (updater) => {
            const next = typeof updater === 'function' ? updater(pagination) : updater;
            setPagination(next);
            sendRequest({
                page: next.pageIndex + 1,
                per_page: next.pageSize,
            });
        },
        manualPagination: true,
        rowCount: metadata.total,
        getCoreRowModel: getCoreRowModel(),
    });

    const isEmptyData = metadata.total === 0 && !search;
    const isEmptySearch = metadata.total === 0 && !!search;

    return (
        <div className="space-y-3 rounded-md border border-line-brand bg-slate-50/80 p-6">
            {/* Toolbar */}
            {searchable && (
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <Input placeholder={searchPlaceholder} value={search} onChange={onSearchChange} className="bg-white pr-8" />
                        {search && (
                            <button
                                onClick={onSearchReset}
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                                aria-label="Reset pencarian"
                            >
                                <XIcon className="size-3" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-md border border-line-brand bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className={cn('p-4', header.column.columnDef.meta?.className)}
                                        key={header.id}
                                        style={{ width: header.column.columnDef.meta?.width }}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow className="group/tr hover:bg-sidebar-menu-bg hover:text-sidebar-menu-text" key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            className={cn('p-4', cell.column.columnDef.meta?.className)}
                                            key={cell.id}
                                            style={{ width: cell.column.columnDef.meta?.width }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    {isEmptySearch ? (
                                        <div className="flex flex-col items-center justify-center gap-y-3 py-16 text-center">
                                            <div className="rounded-full bg-amber-50 p-4">
                                                <SearchXIcon className="size-8 text-amber-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-700">Hasil tidak ditemukan</p>
                                                <p className="text-sm text-gray-500">
                                                    Tidak ada data yang cocok dengan kata kunci <strong className="text-gray-700">"{search}"</strong>
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={onSearchReset}>
                                                <XIcon className="mr-1.5 size-3.5" />
                                                Reset Pencarian
                                            </Button>
                                        </div>
                                    ) : isEmptyData ? (
                                        <div className="flex flex-col items-center justify-center gap-y-3 py-16 text-center">
                                            <div className="rounded-full bg-blue-50 p-4">
                                                <DatabaseZapIcon className="size-8 text-blue-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-700">Belum ada data</p>
                                                <p className="text-sm text-gray-500">Data yang ditambahkan akan muncul di sini.</p>
                                            </div>
                                        </div>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination — sembunyikan jika tidak ada data */}
            {metadata.total > 0 && (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        Menampilkan {metadata.from} – {metadata.to} dari <strong>{metadata.total}</strong> data
                    </span>

                    <div className="flex flex-row items-center justify-center gap-x-2">
                        <Button size="icon" variant="ghost" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                            <ChevronFirstIcon />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <ChevronLeftIcon />
                        </Button>

                        <Select value={String(pagination.pageIndex + 1)} onValueChange={(value) => table.setPageIndex(Number(value) - 1)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Halaman" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: metadata.last_page }, (_, i) => i + 1).map((page) => (
                                    <SelectItem key={page} value={page.toString()}>
                                        {`Hal. ${page}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button size="icon" variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <ChevronRightIcon />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                            <ChevronLastIcon />
                        </Button>
                    </div>

                    <Select value={String(pagination.pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Data perhalaman" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 25, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} / Halaman
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
