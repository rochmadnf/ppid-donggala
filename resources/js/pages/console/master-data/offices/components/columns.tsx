import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import type { OfficeDataProps } from '../types';

export const columns: ColumnDef<OfficeDataProps>[] = [
    {
        id: 'name',
        header: 'Nama OPD',
        accessorFn: (row) => row.name.raw,
        cell: ({ row }) => {
            const xName = row.original.name;

            return (
                <div className="flex flex-col gap-y-0.5">
                    <span className="text-base font-medium">{xName.raw}</span>
                    <span className="w-max rounded-xs text-xs text-slate-600 group-hover/tr:text-slate-700/70">{xName.alias}</span>
                </div>
            );
        },
    },
    {
        id: 'merger',
        header: 'Gabungan',
        cell: ({ row }) => {
            const mergerOf = row.original.merger.of;
            if (mergerOf.length === 0) return <Badge variant={'ghost'}> &mdash; </Badge>;

            return mergerOf.map((office) => (
                <Badge key={office.id} className="mr-1 cursor-help bg-blue-500 text-xs last:mr-0" title={office.name.raw}>
                    {office.name.alias}
                </Badge>
            ));
        },
    },
    {
        id: 'actions',
    },
];
