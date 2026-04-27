import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type EmptyStateProps = {
    icon: ReactNode;
    title: string;
    description: ReactNode;
    action?: ReactNode;
    iconWrapperClassName: string;
};

export function EmptyState({ icon, title, description, action, iconWrapperClassName }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-y-3 py-16 text-center">
            <div className={cn('rounded-full p-4', iconWrapperClassName)}>{icon}</div>
            <div className="space-y-1">
                <p className="font-medium text-gray-700">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            {action}
        </div>
    );
}
