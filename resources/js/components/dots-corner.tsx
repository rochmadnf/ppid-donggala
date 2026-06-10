import { cn } from '@/lib/utils';

const sides = {
    top: '-top-[4px]',
    bottom: '-bottom-[4px]',
} as const;

export function DotsCorner({ side = 'top' }: { side?: keyof typeof sides }) {
    const positionClass = sides[side];

    return (
        <>
            <div className={cn('absolute -left-[4px] z-25 size-[7px] bg-ppid-primary', positionClass)} aria-hidden="true" />
            <div className={cn('absolute -right-[4px] z-25 size-[7px] bg-ppid-primary', positionClass)} aria-hidden="true" />
        </>
    );
}
