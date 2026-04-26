import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { PaginationMetaProps } from '@/types/pagination';
import { router } from '@inertiajs/react';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState } from '@tanstack/react-table';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export type DataTableProps<T> = {
    data: T[];
    metadata: PaginationMetaProps;
    columns: ColumnDef<T>[];
    routeName: string;
    keepCurrentUrl?: boolean;
};

export function DataTable<T>({ data, metadata, columns, routeName, keepCurrentUrl = true }: DataTableProps<T>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: metadata.current_page - 1,
        pageSize: metadata.per_page,
    });

    // refresh pagination state when metadata changes
    useEffect(() => {
        setPagination({
            pageIndex: metadata.current_page - 1,
            pageSize: metadata.per_page,
        });
    }, [metadata.current_page, metadata.per_page]);

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: (updater) => {
            const next = typeof updater === 'function' ? updater(pagination) : updater;

            setPagination(next);

            router.get(
                route(routeName),
                {
                    page: next.pageIndex + 1,
                    per_page: next.pageSize,
                },
                {
                    preserveUrl: keepCurrentUrl,
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        },

        manualPagination: true,
        rowCount: metadata.total,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-3 rounded-md border border-line-brand bg-slate-50/80 p-6">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Data belum tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                {/* Info */}
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

                {/* Ukuran halaman */}
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
        </div>
    );
}
