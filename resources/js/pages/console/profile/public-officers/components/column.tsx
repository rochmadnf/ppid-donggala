import { DeleteButton } from '@/components/delete-button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getEndpoint } from '@/lib/endpoint';
import type { PaginationMetaProps } from '@/types/pagination';
import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { BookUserIcon } from 'lucide-react';
import type { PublicOfficerDataIndexProps } from '../types';

interface ColumnsOptions {
    metadata: PaginationMetaProps;
}

export const columns = ({ metadata }: ColumnsOptions): ColumnDef<PublicOfficerDataIndexProps>[] => [
    {
        id: 'number',
        header: () => 'No.',
        cell: ({ row }) => <div className="mt-1">{metadata.from + row.index}.</div>,
        meta: {
            className: 'text-center',
            width: '35px',
        },
    },
    {
        id: 'name',
        header: () => 'Pejabat',
        accessorFn: (row) => row.name,
        cell: ({ row }) => {
            const { name: xName, photo, position } = row.original;

            return (
                <div className="flex items-center gap-x-3">
                    <div className="w-full max-w-12">
                        <AspectRatio ratio={4 / 5}>
                            <img src={photo} alt={xName} className="rounded-md object-cover" />
                        </AspectRatio>
                    </div>
                    <div className="space-y-0.5">
                        <h5 className="text-base font-semibold">{xName}</h5>
                        <p className="text-xs text-slate-600/80">{position.name}</p>
                    </div>
                </div>
            );
        },
    },
    {
        id: 'office',
        header: () => 'Kantor',
        accessorFn: (row) => row.office.name,
        cell: ({ row }) => {
            const { office } = row.original;
            return <span className="font-medium">{office.alias}</span>;
        },
    },
    {
        id: 'status',
        header: () => 'Status',
        accessorFn: (row) => row.is_active,
        cell: ({ row }) => {
            const { is_active } = row.original;
            return (
                <span
                    className={`inline-flex items-center rounded-full px-4 py-2 font-medium ${
                        is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
            );
        },
        meta: {
            className: 'text-center',
            width: '100px',
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const { id, name } = row.original;
            return (
                <div className="flex w-full items-center justify-around gap-x-0.5" role="group" aria-label={`Aksi untuk ${name}`}>
                    {/* Tombol Info */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-10 cursor-pointer group-hover/tr:text-sky-500 hover:bg-sky-500 hover:text-white"
                                aria-label={`Info ${name}`}
                                asChild
                            >
                                <Link href={getEndpoint('officers.console.show', { id })}>
                                    <BookUserIcon className="size-5" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Detail Data</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Tombol Delete */}
                    <DeleteButton
                        url={getEndpoint('officers.console.delete', { id })}
                        title="Hapus Pejabat Publik"
                        variant="rect"
                        popSide="bottom"
                        pageName="Pejabat Publik"
                        className="size-10 group-hover/tr:bg-transparent group-hover/tr:text-red-500 [&_svg]:size-5"
                        description="Anda yakin ingin menghapus Pejabat Publik ini? Tindakan ini tidak dapat dibatalkan."
                        selectedData={name}
                    />
                </div>
            );
        },
        meta: {
            className: '',
            width: '100px',
        },
    },
];
