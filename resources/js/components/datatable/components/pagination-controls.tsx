import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PaginationState, Table as TanstackTable } from '@tanstack/react-table';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { PAGE_SIZE_OPTIONS } from '../constants';

type PaginationControlsProps<T> = {
    table: TanstackTable<T>;
    pagination: PaginationState;
    totalPages: number;
};

export function PaginationControls<T>({ table, pagination, totalPages }: PaginationControlsProps<T>) {
    return (
        <>
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                            {size} / Halaman
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
