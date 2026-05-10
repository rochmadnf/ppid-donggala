import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

type SIDE_OPTIONS = 'top' | 'bottom' | 'left' | 'right';

export interface DeleteButtonProps {
    url: string;
    pageName?: string;
    onlyProps?: string[] | undefined;
    ttSide?: SIDE_OPTIONS; // Tooltip side
    popSide?: SIDE_OPTIONS; // Popover side
    popSideOffset?: number | undefined;
    title: string;
    description: string;
    selectedData: string;
    variant?: 'flat' | 'pill' | 'rect' | undefined;
    className?: string;
}

export function DeleteButton({
    url,
    onlyProps = ['resources'],
    ttSide = 'top',
    popSide = 'top',
    popSideOffset = 12,
    title,
    description,
    selectedData,
    variant = 'flat',
    pageName = 'Unknown',
    className,
}: DeleteButtonProps) {
    const [openPop, setOpenPop] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const baseStyles = cn(
        'inline-flex cursor-pointer items-center justify-center bg-white transition duration-150 hover:border-destructive hover:bg-destructive hover:text-white [&_svg]:pointer-events-none',
        className,
        openPop ? 'border-destructive bg-destructive text-white' : '',
    );

    const buttonVariant: Record<NonNullable<DeleteButtonProps['variant']>, string> = {
        flat: cn('first:border-r-app-primary-300 last:border-l-app-primary-300 first:border-r last:border-l [&_svg]:size-5', baseStyles),
        pill: cn('rounded-full border p-2 [&_svg]:size-4', baseStyles),
        rect: cn('rounded-md p-2 [&_svg]:size-5', baseStyles),
    };

    const deleteSelectedData = (name: string) => {
        router.delete(url, {
            replace: true,
            preserveScroll: true,
            preserveUrl: true,
            only: onlyProps,
            onSuccess: () => {
                toast.success(`${pageName} ${name} berhasil dihapus.`);
            },
            onError: (err) => {
                toast.error(err.message);
            },
            onFinish: () => {
                setOpenPop(false);
            },
        });
    };

    return (
        <Popover open={openPop} onOpenChange={setOpenPop}>
            <Tooltip open={isHovered && !openPop}>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <button
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={buttonVariant[(variant ?? 'flat') as keyof typeof buttonVariant]}
                        >
                            <Trash2Icon />
                        </button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side={ttSide}>
                    <p>Hapus Data</p>
                </TooltipContent>
            </Tooltip>

            <PopoverContent className="border-app-primary-300 p-4 shadow-none" side={popSide} sideOffset={popSideOffset}>
                <div className="flex flex-col items-center justify-center">
                    <TriangleAlertIcon className="pointer-events-none size-8 text-red-400" />
                    <h4 className="mt-4 text-lg font-bold">{title}</h4>
                    <p className="text-center text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: description }} />

                    <div className="mt-6 flex flex-row items-center justify-between gap-x-4">
                        <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => setOpenPop(!openPop)}>
                            Tidak, batalkan.
                        </Button>
                        <Button size="sm" variant="destructive" className="cursor-pointer" onClick={() => deleteSelectedData(selectedData)}>
                            Ya, Hapus!
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
