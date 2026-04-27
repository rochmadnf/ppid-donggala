import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { flexRender, getCoreRowModel, useReactTable, type PaginationState } from '@tanstack/react-table';
import { DatabaseZapIcon, SearchXIcon, XIcon } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { EmptyState } from './components/empty-state';
import { PaginationControls } from './components/pagination-controls';
import type { DataTableProps, RequestParams } from './types';

export function DataTable<T>({
    data,
    metadata,
    columns,
    routeName,
    keepCurrentUrl = false,
    searchable = false,
    searchPlaceholder = 'Cari...',
    searchBy = 'name',
    toolbarRight,
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

    const buildRequestParams = (overrides: RequestParams = {}): RequestParams => {
        const params: RequestParams = {
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
        };

        if (search) {
            params.keyword = search;
            if (searchBy) params.search_by = searchBy;
        }

        return { ...params, ...overrides };
    };

    const sendRequest = (overrides: RequestParams = {}) => {
        const requestParams = buildRequestParams(overrides);

        router.get(route(routeName), requestParams, {
            preserveUrl: keepCurrentUrl,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = useDebouncedCallback((value: string) => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        sendRequest({
            keyword: value || undefined,
            search_by: searchBy || undefined,
            page: 1,
        });
    }, 500);

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    const rows = table.getRowModel().rows;

    const showToolbar = searchable || !!toolbarRight;

    return (
        <div className="space-y-3 rounded-md border border-line-brand bg-slate-50/80 p-6">
            {/* Toolbar */}
            {showToolbar && (
                <div className="flex items-center justify-between gap-x-3">
                    {searchable ? (
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
                    ) : (
                        <div />
                    )}

                    {toolbarRight && <div className="flex items-center gap-x-2">{toolbarRight}</div>}
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
                        {rows.length ? (
                            rows.map((row) => (
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
                                        <EmptyState
                                            icon={<SearchXIcon className="size-8 text-amber-400" />}
                                            title="Hasil tidak ditemukan"
                                            description={
                                                <>
                                                    Tidak ada data yang cocok dengan kata kunci <strong className="text-gray-700">"{search}"</strong>
                                                </>
                                            }
                                            action={
                                                <Button variant="outline" size="sm" onClick={onSearchReset}>
                                                    <XIcon className="mr-1.5 size-3.5" />
                                                    Reset Pencarian
                                                </Button>
                                            }
                                            iconWrapperClassName="bg-amber-50"
                                        />
                                    ) : isEmptyData ? (
                                        <EmptyState
                                            icon={<DatabaseZapIcon className="size-8 text-blue-400" />}
                                            title="Belum ada data"
                                            description="Data yang ditambahkan akan muncul di sini."
                                            iconWrapperClassName="bg-blue-50"
                                        />
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

                    <PaginationControls table={table} pagination={pagination} totalPages={metadata.last_page} />
                </div>
            )}
        </div>
    );
}
