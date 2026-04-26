import { DeleteButton } from '@/components/delete-button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { PaginationMetaProps } from '@/types/pagination';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDownIcon, CombineIcon, GlobeIcon, GlobeOffIcon, MapPinHouseIcon, MapPinOffIcon, PhoneIcon, PhoneOffIcon } from 'lucide-react';
import type { OfficeDataProps } from '../types';

export const columns = (metadata: PaginationMetaProps): ColumnDef<OfficeDataProps>[] => [
    {
        id: 'number',
        header: () => 'No.',
        cell: ({ row }) => <div className="mt-1">{metadata.from + row.index}.</div>,
        meta: {
            className: 'text-center align-top',
            width: '35px',
        },
    },
    {
        id: 'name',
        header: () => 'Nama OPD',
        accessorFn: (row) => row.name.raw,
        cell: ({ row }) => {
            const { name: xName, phone, address, site_url, merger } = row.original;

            return (
                <Collapsible className="group/office-name">
                    <CollapsibleTrigger className="flex flex-row items-center gap-x-1.5">
                        <ChevronDownIcon className="pointer-events-none mb-4.5 size-4 text-gray-600 transition-transform duration-300 group-data-[state=open]/office-name:rotate-180" />
                        <div className="flex flex-col gap-y-0.5">
                            <span className="text-base font-medium">{xName.raw}</span>
                            <span className="w-max rounded-xs text-xs text-slate-600 group-hover/tr:text-slate-700">{xName.alias}</span>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4">
                        <section
                            className="flex flex-col gap-y-3 rounded-md border border-slate-400/30 px-4 py-2"
                            role="main"
                            aria-label="Informasi Kantor"
                        >
                            <div className="space-y-1.5">
                                <label className="inline-flex items-center text-sm font-medium text-slate-600 [&_svg]:pointer-events-none [&_svg]:mr-2 [&_svg]:size-4">
                                    {address !== null ? <MapPinHouseIcon /> : <MapPinOffIcon />} Alamat
                                </label>
                                <p className="pl-1 italic">{address ?? '—'}</p>
                            </div>

                            <div className="flex flex-col gap-y-1.5">
                                <label className="inline-flex items-center text-sm font-medium text-slate-600 [&_svg]:pointer-events-none [&_svg]:mr-2 [&_svg]:size-4">
                                    {phone !== null ? <PhoneIcon /> : <PhoneOffIcon />} No. HP/Telepon
                                </label>
                                {phone !== null ? (
                                    <a href={`tel:${phone}`} target="_self" rel="noopener noreferrer" className="pl-1 tracking-widest italic">
                                        {phone}
                                    </a>
                                ) : (
                                    <p className="pl-1 italic">—</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-1.5">
                                <label className="inline-flex items-center text-sm font-medium text-slate-600 [&_svg]:pointer-events-none [&_svg]:mr-2 [&_svg]:size-4">
                                    {site_url !== null ? <GlobeIcon /> : <GlobeOffIcon />} Situs Web
                                </label>
                                {site_url !== null ? (
                                    <a href={site_url} target="_blank" rel="noopener noreferrer" className="pl-1 italic">
                                        {site_url}
                                    </a>
                                ) : (
                                    <p className="pl-1 italic">—</p>
                                )}
                            </div>

                            {merger.of.length > 0 ? (
                                <div className="flex flex-col gap-y-1.5">
                                    <label className="inline-flex items-center text-sm font-medium text-slate-600 [&_svg]:pointer-events-none [&_svg]:mr-2 [&_svg]:size-4">
                                        <CombineIcon /> Gabungan Kantor
                                    </label>
                                    <div className="flex flex-col gap-y-0.5">
                                        {merger.of.map((office) => (
                                            <Badge key={office.id} className="mr-1 ml-1 cursor-help text-xs last:mr-0" title={office.name.alias}>
                                                {office.name.raw}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </section>
                    </CollapsibleContent>
                </Collapsible>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const { id, name } = row.original;
            return (
                <div className="flex w-full items-center justify-around gap-x-2" role="group" aria-label={`Aksi untuk ${row.original.name.raw}`}>
                    <DeleteButton
                        url={route('console.master-data.offices.destroy', { office_id: id })}
                        title="Hapus Perangkat Daerah"
                        variant="rect"
                        popSide="bottom"
                        pageName="Perangkat Daerah"
                        className="group-hover/tr:text-destructive [&_svg]:size-4"
                        description="Anda yakin ingin menghapus perangkat daerah ini? Tindakan ini tidak dapat dibatalkan."
                        selectedData={name.alias}
                    />
                </div>
            );
        },
        meta: {
            className: 'align-top',
            width: '100px',
        },
    },
];
