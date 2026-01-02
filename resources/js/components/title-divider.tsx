import { cn } from '@/lib/utils';

export function TitleDivider({ title, className }: { title: string; className?: string }) {
    return (
        <h4
            className={cn(
                `relative mb-4 text-4xl font-bold tracking-wide text-blue-700 before:absolute before:-bottom-2 before:h-1.5 before:w-20 before:bg-yellow-300`,
                className,
            )}
        >
            {title}
        </h4>
    );
}
